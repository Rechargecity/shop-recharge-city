package shop.recharge.city.payform.backend.repository

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import shop.recharge.city.payform.backend.entity.UserEntity

@Repository
interface UserRepository : CrudRepository<UserEntity, String>
