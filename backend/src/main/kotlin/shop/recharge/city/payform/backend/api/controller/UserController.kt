package shop.recharge.city.payform.backend.api.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import shop.recharge.city.payform.backend.dto.CredentialsDto
import shop.recharge.city.payform.backend.service.UserDetailsServiceImpl

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userDetailsService: UserDetailsServiceImpl,
) {

    @GetMapping("check")
    fun checkPassword() = true

    @PostMapping
    fun register(@RequestBody dto: CredentialsDto) {
        userDetailsService.register(dto.username, dto.password)
    }
}
