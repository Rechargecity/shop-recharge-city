package shop.recharge.city.payform.backend.dto

data class CreateFundingSourceRequestDto(
    val userId: String,
    val publicToken: String,
    val accountId: String,
    val accountName: String = accountId,
)
