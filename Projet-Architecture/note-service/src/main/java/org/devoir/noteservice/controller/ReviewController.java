package org.devoir.noteservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.devoir.noteservice.dto.RatingStats;
import org.devoir.noteservice.model.Review;
import org.devoir.noteservice.model.ReviewType;
import org.devoir.noteservice.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@Valid @RequestBody Review review) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(review));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReview(id));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Review>> getRestaurantReviews(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(
                reviewService.getEntityReviews(ReviewType.RESTAURANT, restaurantId)
        );
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Review>> getDriverReviews(@PathVariable Long driverId) {
        return ResponseEntity.ok(
                reviewService.getEntityReviews(ReviewType.DRIVER, driverId)
        );
    }

    @GetMapping("/restaurant/{restaurantId}/stats")
    public ResponseEntity<RatingStats> getRestaurantStats(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(
                reviewService.getEntityStats(ReviewType.RESTAURANT, restaurantId)
        );
    }

    @GetMapping("/driver/{driverId}/stats")
    public ResponseEntity<RatingStats> getDriverStats(@PathVariable Long driverId) {
        return ResponseEntity.ok(
                reviewService.getEntityStats(ReviewType.DRIVER, driverId)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getUserReviews(userId));
    }

    @PutMapping("/{id}/moderate")
    public ResponseEntity<Review> moderateReview(
            @PathVariable Long id,
            @RequestParam boolean approved) {
        return ResponseEntity.ok(reviewService.moderateReview(id, approved));
    }
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

}
