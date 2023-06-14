package shop.recharge.city.payform.backend.configuration

import com.plaid.client.ApiClient
import com.plaid.client.request.PlaidApi
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

const val PLAID_OKHTTP_CLIENT = "PLAID_OKHTTP_CLIENT"

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
    private val okHttpLoggingInterceptor: HttpLoggingInterceptor,
) {

    @Bean(PLAID_OKHTTP_CLIENT)
    fun plaidOkHttpClient() = OkHttpClient.Builder()
        .addInterceptor(okHttpLoggingInterceptor)
        .build()

    @Bean
    fun plaidClient(plaidOkHttpClient: OkHttpClient): PlaidApi = ApiClient(
        mapOf(
            "clientId" to clientId,
            "secret" to secret
        )
    ).apply {
        setPlaidAdapter(env.adapter)
        configureFromOkclient(plaidOkHttpClient)
    }.createService(PlaidApi::class.java)
}
