package shop.recharge.city.payform.backend.repository

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import shop.recharge.city.payform.backend.entity.ProductEntity
import shop.recharge.city.payform.backend.model.Product
import java.util.UUID

@Repository
interface ProductRepository : CrudRepository<ProductEntity, UUID> {
    fun findAll(pageRequest: Pageable): Page<ProductEntity>
}
