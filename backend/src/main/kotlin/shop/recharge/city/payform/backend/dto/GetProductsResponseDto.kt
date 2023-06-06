package shop.recharge.city.payform.backend.dto

import shop.recharge.city.payform.backend.model.Product

data class GetProductsResponseDto(
    val items: Collection<Product>,
)
