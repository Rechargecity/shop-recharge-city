package shop.recharge.city.payform.backend.configuration

import com.dwolla.Dwolla
import com.dwolla.DwollaEnvironment
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class DwollaConfig(
    @Value("\${dwolla.key}")
    private val key: String,
    @Value("\${dwolla.secret}")
    private val secret: String,
    @Value("\${dwolla.env:SANDBOX}")
    private val env: DwollaEnvironment,
) {

    @Bean
    fun dwollaClient() = Dwolla(key, secret, env)
}
