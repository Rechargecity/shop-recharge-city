package shop.recharge.city.payform.backend.model

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import shop.recharge.city.payform.backend.entity.UserEntity

data class UserDetailsImpl(
    val login: String,
    val pass: String,
    val roles: MutableSet<out GrantedAuthority>,
) : UserDetails {
    override fun getAuthorities() = roles

    override fun getPassword() = pass

    override fun getUsername() = login

    override fun isAccountNonExpired() = true

    override fun isAccountNonLocked() = true

    override fun isCredentialsNonExpired() = true

    override fun isEnabled() = true
}

fun UserEntity.toModel() = UserDetailsImpl(username, password, roles.split(",").map { SimpleGrantedAuthority(it) }.toMutableSet())
