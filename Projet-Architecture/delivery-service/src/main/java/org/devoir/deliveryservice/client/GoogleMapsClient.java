package org.devoir.deliveryservice.client;

import lombok.RequiredArgsConstructor;
import org.devoir.deliveryservice.dto.DirectionsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class GoogleMapsClient {

    private final WebClient.Builder webClientBuilder;

    @Value("${google.maps.api.key}")
    private String apiKey;

    public Mono<DirectionsResponse> getDirections(String origin, String destination) {
        return webClientBuilder.build()
                .get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("maps.googleapis.com")
                        .path("/maps/api/directions/json")
                        .queryParam("origin", origin)
                        .queryParam("destination", destination)
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(DirectionsResponse.class);
    }

    public Mono<Integer> getEstimatedTime(String origin, String destination) {
        // CORRECTION : Mode simulation si pas de vraie clé API
        // Cela empêche l'appel réel à Google Maps si on utilise "test-key"
        if (apiKey == null || apiKey.equals("test-key") || apiKey.isEmpty()) {
            System.out.println("Mode TEST: Simulation temps de trajet (30 min)");
            return Mono.just(30);
        }

        return getDirections(origin, destination)
                .map(response -> {
                    if (response.getRoutes() != null && !response.getRoutes().isEmpty()) {
                        return response.getRoutes().get(0)
                                .getLegs().get(0)
                                .getDuration().getValue() / 60;
                    }
                    return 30; // Temps par défaut en minutes si l'API ne renvoie pas de route
                });
    }
}