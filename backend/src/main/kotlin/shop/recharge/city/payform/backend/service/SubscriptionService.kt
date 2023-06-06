package shop.recharge.city.payform.backend.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import shop.recharge.city.payform.backend.entity.SubscriptionEntity
import shop.recharge.city.payform.backend.repository.SubscriptionRepository
import java.util.UUID

@Service
class SubscriptionService(
    private val customerService: CustomerService,
    private val subscriptionRepository: SubscriptionRepository,
) {

    @Transactional
    fun subscribe(paymentId: UUID) = with(customerService.findOrCreateCustomer()) {
        if (!subscriptionRepository.existsByPaymentIdAndUsername(paymentId.toString(), username)) {
            subscriptionRepository.save(SubscriptionEntity(username, paymentId.toString()))
        }
    }

    fun getAll(): Iterable<SubscriptionEntity> = subscriptionRepository.findAll()
}
