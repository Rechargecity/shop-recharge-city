package shop.recharge.city.payform.backend.service

import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import shop.recharge.city.payform.backend.entity.CustomerEntity
import shop.recharge.city.payform.backend.repository.CustomerRepository

@Service
class CustomerService(
    private val customerRepository: CustomerRepository,
) {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun findOrCreateCustomer() = with(SecurityContextHolder.getContext().authentication.principal as UserDetails) {
        customerRepository.findByIdOrNull(username)
            ?: customerRepository.save(CustomerEntity(username))
    }

    fun findCustomer(username: String) = customerRepository.findByIdOrNull(username)

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun setDwollaId(username: String, dwollaId: String) = customerRepository.setDwollaId(username, dwollaId)

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun setFundingSource(username: String, fundingSourceId: String) =
        customerRepository.setFundingSource(username, fundingSourceId)

    fun checkCustomerReadyForTransfer() =
        with(SecurityContextHolder.getContext().authentication.principal as UserDetails) {
            val customer = customerRepository.findByIdOrNull(username) ?: return@with false
            customer.dwollaId != null && customer.fundingSource != null
        }
}
