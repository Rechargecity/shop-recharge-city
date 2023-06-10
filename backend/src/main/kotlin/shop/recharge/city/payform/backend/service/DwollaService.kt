package shop.recharge.city.payform.backend.service

import com.dwolla.Dwolla
import com.dwolla.DwollaEnvironment
import com.dwolla.api.shared.DateOfBirth
import com.dwolla.exception.DwollaApiException
import com.dwolla.http.JsonBody
import com.dwolla.resource.customers.CustomerStatus
import com.dwolla.resource.fundingsources.FundingSource
import com.dwolla.shared.USState
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import shop.recharge.city.payform.backend.model.DwollaFundingSourceLink
import shop.recharge.city.payform.backend.model.DwollaMoney
import shop.recharge.city.payform.backend.model.Product
import java.time.LocalDate
import java.util.UUID

private const val DUPLICATE = "Duplicate"
private const val DUPLICATE_RESOURCE = "DuplicateResource"
private const val ABOUT = "about"
private const val ACCOUNT = "account"
private const val PATH_DELIMITER = "/"

private const val LOCATION = "Location"

@Service
class DwollaService(
    private val dwolla: Dwolla,
    private val productService: ProductService,
    private val customerService: CustomerService,
    private val subscriptionService: SubscriptionService,
) {

    private val dwollaBaseUrl: String = when (dwolla.environment) {
        DwollaEnvironment.PRODUCTION -> "https://api.dwolla.com"
        else -> "https://api-sandbox.dwolla.com"
    }

    private val log = LoggerFactory.getLogger(DwollaService::class.java)

    @Transactional
    fun createOrGetCustomer(
        firstName: String,
        lastName: String,
        email: String,
        address: String,
        city: String,
        state: USState,
        postalCode: String,
        dateOfBirth: String,
        ssn: String,
    ) = with(customerService.findOrCreateCustomer()) {
        if (this.dwollaId != null) return@with this
        else {
            val created = doCreateOrGetDwollaCustomer(
                firstName, lastName, email, address, city, state, postalCode, dateOfBirth, ssn
            )
            customerService.setDwollaId(this.username, created.id)
            customerService.findOrCreateCustomer()
        }
    }

    @Transactional
    fun createOrGetFundingSource(userId: String, plaidToken: String, name: String) =
        with(customerService.findOrCreateCustomer()) {
            if (fundingSource != null) return@with fundingSource!!
            else {
                val created = doCreateOrGetFundingSource(userId, name, plaidToken)
                return@with created.also {
                    customerService.setFundingSource(this.username, it)
                }
            }
        }

    @Transactional
    fun createTransaction(productId: String): String {

        val actualSourceFundingSourceId = customerService.findOrCreateCustomer().fundingSource!!

        return createTransaction(productId, actualSourceFundingSourceId)
    }

    @Transactional
    fun createTransaction(productId: String, fundingSourceId: String): String {

        val actualSourceFundingSourceId = customerService.findOrCreateCustomer().fundingSource!!

        val product = productService.findById(UUID.fromString(productId))
        val accountId = dwolla.root.get().getHref(ACCOUNT).split(PATH_DELIMITER).last()
        val destinationFundingSource =
            dwolla.fundingSources.listByAccount(accountId, false)._embedded.fundingSources.first()

        val transaction = doCreateTransaction(destinationFundingSource, actualSourceFundingSourceId, product)

        if (product.isRecurring) {
            subscriptionService.subscribe(product.id!!)
        }

        return transaction.split(PATH_DELIMITER).last()
    }

    private fun doCreateTransaction(
        destinationFundingSource: FundingSource,
        actualSourceFundingSourceId: String,
        product: Product,
    ) = dwolla.post(
        "$dwollaBaseUrl/transfers",
        JsonBody(
            "_links" to mapOf(
                "destination" to DwollaFundingSourceLink("${dwollaBaseUrl}/funding-sources/${destinationFundingSource.id}"),
                "source" to DwollaFundingSourceLink("${dwollaBaseUrl}/funding-sources/$actualSourceFundingSourceId")
            ),
            "amount" to DwollaMoney("USD", product.price.toString()),
        ),
    ).headers.get(LOCATION) ?: throw IllegalArgumentException("Failed to get transfer url")

    @Scheduled(cron = "\${dwolla.recurring.cron:@monthly}")
    fun processRecurring() = subscriptionService.getAll().forEach { subscription ->
        val customer = customerService.findCustomer(subscription.username)
            ?: throw IllegalArgumentException("Customer ${subscription.username} does not exist")

        val product = productService.findById(UUID.fromString(subscription.paymentId))

        val accountId = dwolla.root
            .get()
            .getHref(ACCOUNT)
            .split(PATH_DELIMITER)
            .last()

        val destinationFundingSource = dwolla.fundingSources
            .listByAccount(accountId, false)
            ._embedded
            .fundingSources
            .first()

        doCreateTransaction(destinationFundingSource, customer.fundingSource!!, product)
            .let {
                log.info("Created transfer $it by recurring service for subscription $subscription")
            }
    }

    private fun doCreateOrGetDwollaCustomer(
        firstName: String,
        lastName: String,
        email: String,
        address: String,
        city: String,
        state: USState,
        postalCode: String,
        dateOfBirth: String,
        ssn: String,
    ) = try {
        dwolla.customers.createVerifiedPersonal(
            firstName,
            lastName,
            email,
            address,
            city = city,
            state = state,
            postalCode = postalCode,
            dateOfBirth = LocalDate.parse(dateOfBirth).let { DateOfBirth(it.year, it.monthValue, it.dayOfMonth) },
            ssn = ssn
        )
    } catch (e: DwollaApiException) {
        val embeddedError = e.error._embedded?.errors?.firstOrNull { it.code == DUPLICATE } ?: throw e

        var customer = dwolla.customers.get(embeddedError.getHref(ABOUT).split("/").last())
        if (customer.status == CustomerStatus.UNVERIFIED) {
            customer = dwolla.customers.retryVerifiedPersonal(
                customer.id,
                firstName,
                lastName,
                email,
                address,
                city = city,
                state = state,
                postalCode = postalCode,
                dateOfBirth = LocalDate.parse(dateOfBirth).let { DateOfBirth(it.year, it.monthValue, it.dayOfMonth) },
                ssn = ssn
            )
        }
        customer
    }

    private fun doCreateOrGetFundingSource(userId: String, name: String, plaidToken: String) = try {
        dwolla.post(
            "$dwollaBaseUrl/customers/$userId/funding-sources",
            JsonBody(
                "name" to name,
                "plaidToken" to plaidToken,
            ),
        ).headers.get(LOCATION) ?: throw IllegalArgumentException("Failed to get transfer url")
    } catch (e: DwollaApiException) {
        if (e.error.code != DUPLICATE_RESOURCE) throw e
        e.error.getHref(ABOUT).split(PATH_DELIMITER).last()
    }
}
