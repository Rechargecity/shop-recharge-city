package shop.recharge.city.payform.backend.service

import com.plaid.client.model.CountryCode
import com.plaid.client.model.ItemPublicTokenExchangeRequest
import com.plaid.client.model.LinkTokenCreateRequest
import com.plaid.client.model.LinkTokenCreateRequestUser
import com.plaid.client.model.ProcessorTokenCreateRequest
import com.plaid.client.model.Products
import com.plaid.client.request.PlaidApi
import org.springframework.stereotype.Service

@Service
class PlaidService(
    private val plaidApi: PlaidApi,
) {

    private val products = listOf(
        Products.ASSETS,
        Products.AUTH,
        Products.TRANSACTIONS
    )

    fun createLinkToken(customerId: String) = with(
        LinkTokenCreateRequestUser()
            .clientUserId(customerId)
    ) {
        plaidApi.linkTokenCreate(
            LinkTokenCreateRequest()
                .user(this)
                .clientName("Recharge App")
                .products(products)
                .countryCodes(listOf(CountryCode.US))
                .language("en")
        ).execute()
            .body()
            ?.linkToken ?: throw RuntimeException("Failed to obtain processor token")
    }

    fun createProcessorToken(publicToken: String, accountId: String) = with(getAccessToken(publicToken)) {
        getProcessorToken(this, accountId)
    }

    private fun getProcessorToken(accessToken: String, accountId: String): String {
        val processorTokenCreateResponse = plaidApi.processorTokenCreate(
            ProcessorTokenCreateRequest()
                .processor(ProcessorTokenCreateRequest.ProcessorEnum.DWOLLA)
                .accessToken(accessToken)
                .accountId(accountId)
        ).execute()

        if (!processorTokenCreateResponse.isSuccessful || processorTokenCreateResponse.body() == null) {
            throw RuntimeException("Failed to exchange item public token")
        }

        return processorTokenCreateResponse.body()!!.processorToken
    }

    private fun getAccessToken(publicToken: String): String {
        val exchangeResponse = plaidApi.itemPublicTokenExchange(
            ItemPublicTokenExchangeRequest()
                .publicToken(publicToken)
        ).execute()

        if (!exchangeResponse.isSuccessful || exchangeResponse.body() == null) {
            throw RuntimeException("Failed to exchange item public token")
        }
        return exchangeResponse.body()!!.accessToken
    }
}
