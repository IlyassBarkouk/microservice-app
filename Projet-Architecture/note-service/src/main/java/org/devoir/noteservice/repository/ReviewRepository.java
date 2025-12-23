package org.devoir.noteservice.repository;

import org.devoir.noteservice.model.Review;
import org.devoir.noteservice.model.ReviewType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTypeAndEntityId(ReviewType type, Long entityId);
    List<Review> findByUserId(Long userId);
    List<Review> findByOrderId(Long orderId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.type = :type AND r.entityId = :entityId AND r.moderated = true")
    Double getAverageRating(ReviewType type, Long entityId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.type = :type AND r.entityId = :entityId AND r.moderated = true")
    Long getReviewCount(ReviewType type, Long entityId);
}
