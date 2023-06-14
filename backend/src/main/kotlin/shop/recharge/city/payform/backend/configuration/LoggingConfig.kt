package shop.recharge.city.payform.backend.configuration

import okhttp3.logging.HttpLoggingInterceptor
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class LoggingConfig(
    @Value("\${logging.ok-http.level:NONE}")
    private val okHttpLevel: HttpLoggingInterceptor.Level,
) {

    @Bean
    fun okHttpInterceptor() = HttpLoggingInterceptor().apply {
        level = okHttpLevel
    }
}
