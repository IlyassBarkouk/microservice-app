package org.devoir.deliveryservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private Long driverId;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    private String pickupAddress;
    private String deliveryAddress;

    private Double currentLatitude;
    private Double currentLongitude;

    private Integer estimatedTime;
    private LocalDateTime pickupTime;
    private LocalDateTime deliveryTime;
}
