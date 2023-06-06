package shop.recharge.city.payform.backend.repository

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import shop.recharge.city.payform.backend.entity.CustomerEntity

@Repository
interface CustomerRepository : CrudRepository<CustomerEntity, String> {

    @Modifying
    @Query("update CustomerEntity set dwollaId=:dwollaId where username=:username")
    fun setDwollaId(username: String, dwollaId: String)

    @Modifying
    @Query("update CustomerEntity set fundingSource=:fundingSource where username=:username")
    fun setFundingSource(username: String, fundingSource: String)
}
