package shop.recharge.city.payform.backend.entity

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.IdClass
import shop.recharge.city.payform.backend.annotations.NoArg
import java.io.Serializable

@Entity
@IdClass(SubscriptionEntityId::class)
data class SubscriptionEntity(
    @Id val username: String,
    @Id val paymentId: String,
)

@NoArg
data class SubscriptionEntityId(
    val username: String,
    val paymentId: String,
) : Serializable
