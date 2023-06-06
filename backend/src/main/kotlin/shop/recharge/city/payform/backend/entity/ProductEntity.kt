package shop.recharge.city.payform.backend.entity

import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.math.BigDecimal
import java.util.UUID

@Entity
data class ProductEntity(
    @Id
    val id: UUID,
    var name: String,
    var description: String,
    var price: BigDecimal,
    var isRecurring: Boolean,
) {
    fun update(new: ProductEntity) {
        name = new.name
        description = new.description
        price = new.price
        isRecurring = new.isRecurring
    }
}
