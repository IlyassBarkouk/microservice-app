package org.devoir.restaurantservice.repository;

import org.devoir.restaurantservice.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(path = "restaurants")
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByAvailableTrue();
    List<Restaurant> findByCuisine(String cuisine);
}
