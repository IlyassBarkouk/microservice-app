package org.devoir.deliveryservice.dto;

import lombok.Data;

@Data
public class DeliveryForOrderRequest {
    private Long orderId;
    private String deliveryAddress;
    private String pickupAddress;
}
