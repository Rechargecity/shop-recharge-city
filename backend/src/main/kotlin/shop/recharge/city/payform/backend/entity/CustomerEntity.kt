package shop.recharge.city.payform.backend.entity

import jakarta.persistence.Entity
import jakarta.persistence.Id

@Entity
data class CustomerEntity(
    @Id
    val username: String,
    var dwollaId: String? = null,
    var fundingSource: String? = null,
)
