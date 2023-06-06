package shop.recharge.city.payform.backend.service

import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import shop.recharge.city.payform.backend.model.Product
import shop.recharge.city.payform.backend.model.toEntity
import shop.recharge.city.payform.backend.model.toModel
import shop.recharge.city.payform.backend.repository.ProductRepository
import java.util.UUID

@Service
class ProductService(
    private val productRepository: ProductRepository,
) {

    fun save(product: Product) = productRepository.save(product.toEntity())
    fun update(product: Product) =
        productRepository.findById(
            product.id ?: throw IllegalArgumentException("No product id")
        ).orElseThrow { NoSuchElementException("No product with id ${product.id}") }
            .let {
                productRepository.save(
                    it.apply {
                        update(product.toEntity())
                    })
            }

    fun findAll(pageRequest: PageRequest) = productRepository.findAll(pageRequest).map { it.toModel() }
    fun findById(id: UUID) =
        productRepository.findById(id)
            .orElseThrow { NoSuchElementException("No product with id $id") }
            .toModel()

    fun delete(id: UUID) = productRepository.deleteById(id)
}
