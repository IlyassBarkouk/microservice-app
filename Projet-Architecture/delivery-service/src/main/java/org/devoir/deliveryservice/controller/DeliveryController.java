package org.devoir.deliveryservice.controller;

import lombok.RequiredArgsConstructor;
import org.devoir.deliveryservice.model.Delivery;
import org.devoir.deliveryservice.model.DeliveryStatus;
import org.devoir.deliveryservice.service.DeliveryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.devoir.deliveryservice.dto.RatingRequest;
import org.devoir.deliveryservice.dto.DeliveryForOrderRequest;


import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {
    private final DeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<Delivery> createDelivery(@RequestBody Delivery delivery) {
        // Appel synchrone direct au service
        Delivery createdDelivery = deliveryService.createDelivery(delivery);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDelivery);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDelivery(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.getDelivery(id));
    }
    
    @PostMapping("/{deliveryId}/rate")
    public ResponseEntity<Delivery> rateDelivery(
            @PathVariable Long deliveryId,
            @RequestBody RatingRequest request
    ) {
        return ResponseEntity.ok(
                deliveryService.rateDeliveryById(
                        deliveryId,
                        request.getRating(),
                        request.getComment()
                )
        );
    }

    


    @PutMapping("/{id}/location")
    public ResponseEntity<Delivery> updateLocation(
            @PathVariable Long id,
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        return ResponseEntity.ok(
                deliveryService.updateLocation(id, latitude, longitude)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Delivery> updateStatus(
            @PathVariable Long id,
            @RequestParam DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.updateStatus(id, status));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Delivery>> getDriverDeliveries(@PathVariable Long driverId) {
        return ResponseEntity.ok(deliveryService.getDriverDeliveries(driverId));
    }
    
    @PostMapping("/create-for-order")
    public ResponseEntity<Delivery> createDeliveryForOrder(
            @RequestBody DeliveryForOrderRequest request
    ) {
        Delivery delivery = new Delivery();
        delivery.setOrderId(request.getOrderId());
        delivery.setDeliveryAddress(request.getDeliveryAddress());
        delivery.setPickupAddress(request.getPickupAddress() != null ? request.getPickupAddress() : "Restaurant Address");
        delivery.setStatus(DeliveryStatus.PENDING); // PENDING first

        // createDelivery will assign driver automatically
        Delivery savedDelivery = deliveryService.createDelivery(delivery);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedDelivery);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Delivery> getDeliveryByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(deliveryService.getDeliveryByOrderId(orderId));
    }



    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }
}