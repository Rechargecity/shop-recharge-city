package shop.recharge.city.payform.backend.entity

import jakarta.persistence.Entity
import jakarta.persistence.Id

@Entity
data class UserEntity(
    @Id
    val username: String,
    val password: String,
    val roles: String,
)
