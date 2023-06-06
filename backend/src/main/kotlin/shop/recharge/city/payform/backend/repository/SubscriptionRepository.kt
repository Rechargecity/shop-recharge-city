package shop.recharge.city.payform.backend.repository

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import shop.recharge.city.payform.backend.entity.SubscriptionEntity
import java.util.UUID

@Repository
interface SubscriptionRepository : CrudRepository<SubscriptionEntity, UUID> {
    fun existsByPaymentIdAndUsername(paymentId: String, username: String): Boolean
}
