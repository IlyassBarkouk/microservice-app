package org.devoir.noteservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.devoir.noteservice.dto.RatingStats;
import org.devoir.noteservice.model.Review;
import org.devoir.noteservice.model.ReviewType;
import org.devoir.noteservice.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    @Transactional
    public Review createReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        review.setModerated(true);
        return reviewRepository.save(review);
    }

    public List<Review> getEntityReviews(ReviewType type, Long entityId) {
        return reviewRepository.findByTypeAndEntityId(type, entityId)
                .stream()
                .filter(Review::isModerated)
                .collect(Collectors.toList());
    }

    public RatingStats getEntityStats(ReviewType type, Long entityId) {
        List<Review> reviews = reviewRepository.findByTypeAndEntityId(type, entityId)
                .stream()
                .filter(Review::isModerated)
                .collect(Collectors.toList());

        RatingStats stats = new RatingStats();
        stats.setTotalReviews((long) reviews.size());

        if (!reviews.isEmpty()) {
            stats.setAverageRating(
                    reviews.stream()
                            .mapToInt(Review::getRating)
                            .average()
                            .orElse(0.0)
            );

            stats.setFiveStars((int) reviews.stream().filter(r -> r.getRating() == 5).count());
            stats.setFourStars((int) reviews.stream().filter(r -> r.getRating() == 4).count());
            stats.setThreeStars((int) reviews.stream().filter(r -> r.getRating() == 3).count());
            stats.setTwoStars((int) reviews.stream().filter(r -> r.getRating() == 2).count());
            stats.setOneStar((int) reviews.stream().filter(r -> r.getRating() == 1).count());
        } else {
            stats.setAverageRating(0.0);
        }

        return stats;
    }

    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    @Transactional
    public Review moderateReview(Long id, boolean approved) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        review.setModerated(approved);
        return reviewRepository.save(review);
    }

    public Review getReview(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
    }
    public List<Review> getAllReviews() {
        return reviewRepository.findAll(); // Assure-toi d'avoir un reviewRepository injecté
    }

}
