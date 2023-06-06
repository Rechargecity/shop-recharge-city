package shop.recharge.city.payform.backend.model

import shop.recharge.city.payform.backend.annotations.NoArg
import shop.recharge.city.payform.backend.entity.ProductEntity
import java.math.BigDecimal
import java.util.UUID

@NoArg
data class Product(
    val id: UUID? = UUID.randomUUID(),
    val name: String,
    val description: String,
    val price: BigDecimal,
    val isRecurring: Boolean,
)

fun Product.toEntity() = ProductEntity(id ?: UUID.randomUUID(), name, description, price, isRecurring)
fun ProductEntity.toModel() = Product(id, name, description, price, isRecurring)
