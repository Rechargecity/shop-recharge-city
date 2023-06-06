package shop.recharge.city.payform.backend.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint
import org.springframework.web.cors.CorsConfiguration
import shop.recharge.city.payform.backend.BackendApplication
import shop.recharge.city.payform.backend.service.Role

@Configuration
class SecurityConfig {

    @Bean
    fun basicAuthEntrypoint() = BasicAuthenticationEntryPoint().apply {
        realmName = BackendApplication::class.simpleName
    }

    @Bean
    fun authProvider(passwordEncoder: PasswordEncoder, userDetailsService: UserDetailsService) =
        DaoAuthenticationProvider().apply {
            setPasswordEncoder(passwordEncoder)
            setUserDetailsService(userDetailsService)
        }

    @Bean
    fun passwordEncoder() = BCryptPasswordEncoder(8)

    @Bean
    fun filterChain(http: HttpSecurity): DefaultSecurityFilterChain = http
        .csrf { it.disable() }
        .authorizeHttpRequests {
            it
                .requestMatchers(HttpMethod.OPTIONS).permitAll()
                .requestMatchers(HttpMethod.GET).hasAnyRole(Role.ADMIN.name, Role.USER.name)
                .requestMatchers("/api/payform/**").hasAnyRole(Role.ADMIN.name, Role.USER.name)
                .anyRequest().hasRole(Role.ADMIN.name)
        }
        .httpBasic {
            it.authenticationEntryPoint(basicAuthEntrypoint())
        }
        .cors {
            it.configurationSource {
                CorsConfiguration()
                    .applyPermitDefaultValues()
                    .apply {
                        addAllowedMethod(HttpMethod.DELETE)
                        addAllowedMethod(HttpMethod.PUT)
                    }
            }
        }.build()
}
