package shop.recharge.city.payform.backend.service

import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import shop.recharge.city.payform.backend.entity.UserEntity
import shop.recharge.city.payform.backend.model.toModel
import shop.recharge.city.payform.backend.repository.UserRepository

enum class Role {
    USER,
    ADMIN;

    fun getAuthorityName() = "ROLE_$name"
}

@Service
class UserDetailsServiceImpl(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    @Value("\${default.admin.username:admin}")
    private val username: String,
    @Value("\${default.admin.password:password}")
    private val password: String,
) : UserDetailsService {

    @PostConstruct
    fun init() {
        register(
            username,
            password,
            setOf(Role.ADMIN.getAuthorityName(), Role.USER.getAuthorityName())
        )
    }

    private fun register(username: String, password: String, roles: Set<String>) {
        if (userRepository.existsById(username)) throw IllegalArgumentException("User with username $username already exists")
        userRepository.save(
            UserEntity(
                username,
                passwordEncoder.encode(password),
                roles.joinToString(",")
            )
        )
    }

    override fun loadUserByUsername(username: String): UserDetails = userRepository.findByIdOrNull(username)
        ?.toModel()
        ?: throw UsernameNotFoundException("User not found by username $username")

    fun register(username: String, password: String) = register(username, password, setOf(Role.USER.getAuthorityName()))
}
