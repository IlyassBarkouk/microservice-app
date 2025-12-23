package org.devoir.orderservice.client;

import org.devoir.orderservice.dto.MenuItemDTO;
import org.devoir.orderservice.dto.RestaurantDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// CORRECTION : On retire 'url' pour utiliser le LoadBalancer Eureka
@FeignClient(name = "restaurant-service")
public interface RestaurantClient {

    @GetMapping("/api/restaurants/{id}")
    RestaurantDTO getRestaurant(@PathVariable("id") Long id);

    @GetMapping("/api/menu-items/{menuItemId}")
    MenuItemDTO getMenuItem(@PathVariable("menuItemId") Long menuItemId);
}