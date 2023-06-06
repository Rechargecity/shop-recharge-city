package shop.recharge.city.payform.backend.configuration

import com.plaid.client.ApiClient
import com.plaid.client.request.PlaidApi
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

enum class PlaidEnv(
    val adapter: String,
) {
    SANDBOX(ApiClient.Sandbox),
    DEV(ApiClient.Development),
    PROD(ApiClient.Production)
}

@Configuration
class PlaidConfig(
    @Value("\${plaid.client}")
    private val clientId: String,
    @Value("\${plaid.secret}")
    private val secret: String,
    @Value("\${plaid.env:SANDBOX}")
    private val env: PlaidEnv,
) {

    @Bean
    fun plaidClient(): PlaidApi = ApiClient(
        mapOf(
            "clientId" to clientId,
            "secret" to secret
        )
    ).apply {
        setPlaidAdapter(env.adapter)
    }.createService(PlaidApi::class.java)
}
