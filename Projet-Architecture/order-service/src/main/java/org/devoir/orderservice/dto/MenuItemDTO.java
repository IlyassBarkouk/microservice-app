package org.devoir.orderservice.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MenuItemDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private boolean available;
}
