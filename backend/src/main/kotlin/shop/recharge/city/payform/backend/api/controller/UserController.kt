package shop.recharge.city.payform.backend.api.controller

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import shop.recharge.city.payform.backend.dto.RegisterUserDto
import shop.recharge.city.payform.backend.service.UserDetailsServiceImpl

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userDetailsService: UserDetailsServiceImpl,
) {

    @PostMapping
    fun register(@RequestBody dto: RegisterUserDto) {
        userDetailsService.register(dto.username, dto.password)
    }
}
