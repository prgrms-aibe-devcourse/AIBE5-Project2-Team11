package com.sprint.daonil.domain.ai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "job_embedding", indexes = {
    @Index(name = "idx_job_id", columnList = "job_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class JobEmbedding {

    @Id
    @Column(name = "job_embedding_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobEmbeddingId;

    @Column(name = "job_id", nullable = false, unique = true)
    private Long jobId;

    @Column(name = "embedding", columnDefinition = "JSON")
    private String embedding;  // JSON 형식으로 저장: "[0.123, -0.456, ...]"

    @Column(name = "embedding_dimension")
    private Integer embeddingDimension;  // 1536 (text-embedding-3-small)

    @Column(name = "job_title", length = 150)
    private String jobTitle;

    @Column(name = "job_content", columnDefinition = "TEXT")
    private String jobContent;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * 저장된 JSON 임베딩을 List<Double>로 변환
     * (Jackson 사용시 자동 변환)
     */
    public List<Double> getEmbeddingVector() {
        // 호출처에서 ObjectMapper로 파싱
        return null;  // 실제 구현은 호출처에서
    }
}

