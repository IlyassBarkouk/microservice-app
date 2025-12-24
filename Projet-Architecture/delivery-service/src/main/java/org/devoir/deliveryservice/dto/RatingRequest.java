package org.devoir.deliveryservice.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private Integer rating;
    private String comment;
}
