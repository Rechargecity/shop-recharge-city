package shop.recharge.city.payform.backend.api.controller

import org.springframework.data.domain.PageRequest
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import shop.recharge.city.payform.backend.dto.GetProductsResponseDto
import shop.recharge.city.payform.backend.model.Product
import shop.recharge.city.payform.backend.service.ProductService
import java.util.UUID

@RestController
@RequestMapping("/api/products")
class ProductController(
    private val productService: ProductService,
) {

    @PostMapping(
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun create(@RequestBody product: Product) = productService.save(product).id

    @PutMapping(
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun update(@RequestBody product: Product) = productService.update(product).id

    @GetMapping
    fun get(
        @RequestParam(required = false, defaultValue = "1") page: Int,
        @RequestParam(required = false, defaultValue = "10") size: Int = 10,
    ) = GetProductsResponseDto(
        productService.findAll(PageRequest.of(page - 1, size)).content
    )

    @GetMapping("{id}")
    fun get(@PathVariable id: UUID) = productService.findById(id)

    @DeleteMapping("{id}")
    fun delete(@PathVariable id: UUID) = productService.delete(id)
}
