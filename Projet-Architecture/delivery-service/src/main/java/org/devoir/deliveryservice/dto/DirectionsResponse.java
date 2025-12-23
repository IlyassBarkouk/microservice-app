package org.devoir.deliveryservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class DirectionsResponse {
    private List<Route> routes;
    private String status;

    @Data
    public static class Route {
        private List<Leg> legs;
    }

    @Data
    public static class Leg {
        private Duration duration;
        private Distance distance;
    }

    @Data
    public static class Duration {
        private String text;
        private Integer value;
    }

    @Data
    public static class Distance {
        private String text;
        private Integer value;
    }
}
