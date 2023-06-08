package shop.recharge.city.payform.backend.api.controller

import com.dwolla.shared.USState
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/states")
class StateController {

    @GetMapping
    fun get() = USState.values()
}
