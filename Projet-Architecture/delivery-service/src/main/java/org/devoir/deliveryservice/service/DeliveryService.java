package org.devoir.deliveryservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.devoir.deliveryservice.client.GoogleMapsClient;
import org.devoir.deliveryservice.model.Delivery;
import org.devoir.deliveryservice.model.DeliveryStatus;
import org.devoir.deliveryservice.model.Driver;
import org.devoir.deliveryservice.repository.DeliveryRepository;
import org.devoir.deliveryservice.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final DriverRepository driverRepository;
    private final GoogleMapsClient googleMapsClient;

    @Transactional
    public Delivery createDelivery(Delivery delivery) {

        // 1. Find an available driver
        List<Driver> availableDrivers = driverRepository.findByAvailableTrue();

        if (!availableDrivers.isEmpty()) {
            Driver driver = availableDrivers.get(0);

            // 2. Assign the driver
            delivery.setDriverId(driver.getId());
            delivery.setStatus(DeliveryStatus.ASSIGNED);

            // 3. Mark driver unavailable
            driver.setAvailable(false);
            driverRepository.save(driver);
        } else {
            // fallback if no driver available
            delivery.setStatus(DeliveryStatus.PENDING);
        }

        // 4. Calculate estimated time safely
        try {
            if (delivery.getPickupAddress() != null && delivery.getDeliveryAddress() != null) {
                Integer estimatedTime = googleMapsClient.getEstimatedTime(
                        delivery.getPickupAddress(),
                        delivery.getDeliveryAddress()
                ).block();
                delivery.setEstimatedTime(estimatedTime);
            }
        } catch (Exception e) {
            delivery.setEstimatedTime(null); // fail silently for testing
        }

        // 5. Save delivery
        return deliveryRepository.save(delivery);
    }


    public Delivery getDelivery(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));
    }

    

    @Transactional
    public Delivery updateLocation(Long id, Double latitude, Double longitude) {
        Delivery delivery = getDelivery(id);
        delivery.setCurrentLatitude(latitude);
        delivery.setCurrentLongitude(longitude);
        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery rateDeliveryById(Long deliveryId, Integer rating, String comment) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));

        delivery.setRating(rating);
        delivery.setComment(comment);

        return deliveryRepository.save(delivery);
    }


    @Transactional
    public Delivery updateStatus(Long id, DeliveryStatus status) {
        Delivery delivery = getDelivery(id);
        delivery.setStatus(status);

        if (status == DeliveryStatus.PICKED_UP) {
            delivery.setPickupTime(LocalDateTime.now());
        } else if (status == DeliveryStatus.DELIVERED) {
            delivery.setDeliveryTime(LocalDateTime.now());
            // Libérer le livreur
            Driver driver = driverRepository.findById(delivery.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Livreur non trouvé"));
            driver.setAvailable(true);
            driverRepository.save(driver);
        }

        return deliveryRepository.save(delivery);
    }
    
   

    @Transactional
    public Delivery createDeliveryForOrder(Long orderId, String deliveryAddress) {
        Delivery delivery = new Delivery();
        delivery.setOrderId(orderId);
        delivery.setPickupAddress("Restaurant Address"); // you can make this dynamic
        delivery.setDeliveryAddress(deliveryAddress);
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setEstimatedTime(30); // optional
        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery getDeliveryByOrderId(Long orderId) {
        return deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));
    }




    public List<Delivery> getDriverDeliveries(Long driverId) {
        return deliveryRepository.findByDriverId(driverId);
    }

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }
}