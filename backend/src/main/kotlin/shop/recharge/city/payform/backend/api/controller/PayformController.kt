package shop.recharge.city.payform.backend.api.controller

import com.dwolla.shared.USState
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import shop.recharge.city.payform.backend.dto.CreateFundingSourceRequestDto
import shop.recharge.city.payform.backend.dto.GetUserResponseDto
import shop.recharge.city.payform.backend.service.CustomerService
import shop.recharge.city.payform.backend.service.DwollaService
import shop.recharge.city.payform.backend.service.PlaidService

@RestController
@RequestMapping("/api/payform")
class PayformController(
    private val dwollaService: DwollaService,
    private val plaidService: PlaidService,
    private val customerService: CustomerService,
) {

    @GetMapping("/check-user")
    fun checkUser() = customerService.checkCustomerReadyForTransfer()

    @GetMapping("/user")
    fun getUser(
        @RequestParam("first-name") firstName: String,
        @RequestParam("last-name") lastName: String,
        @RequestParam email: String,
        @RequestParam address: String,
        @RequestParam city: String,
        @RequestParam state: USState,
        @RequestParam("postal-code") postalCode: String,
        @RequestParam("date-of-birth") dateOfBirth: String,
        @RequestParam ssn: String,
    ) = dwollaService.createOrGetCustomer(
        firstName,
        lastName,
        email,
        address,
        city,
        state,
        postalCode,
        dateOfBirth,
        ssn
    ).let {
        GetUserResponseDto(it.dwollaId!!, it.fundingSource != null)
    }

    @GetMapping("/link-token")
    fun getLinkToken(
        @RequestParam("user-id") userId: String,
    ) = plaidService.createLinkToken(userId)

    @PostMapping("/process-not-attached/{paymentId}")
    fun processNotAttached(
        @RequestBody payload: CreateFundingSourceRequestDto,
        @PathVariable paymentId: String,
    ): String {
        val processorToken = plaidService.createProcessorToken(payload.publicToken, payload.accountId)
        val fundingSourceId =
            dwollaService.createOrGetFundingSource(payload.userId, processorToken, payload.accountName)
        return dwollaService.createTransaction(paymentId, fundingSourceId)
    }

    @PostMapping("/process-attached/{paymentId}")
    fun processAttached(
        @PathVariable paymentId: String,
    ): String {
        return dwollaService.createTransaction(paymentId)
    }
}
