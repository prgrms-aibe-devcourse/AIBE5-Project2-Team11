package com.sprint.daonil.domain.resume.entity;

import com.sprint.daonil.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resume_id")
    private Long resumeId;

    // 🔗 Member (N:1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "user_photo", length = 255)
    private String userPhoto;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "portfolio_url", length = 255)
    private String portfolioUrl;

    @Column(columnDefinition = "TEXT")
    private String education;

    @Column(name = "career_history", columnDefinition = "TEXT")
    private String careerHistory;

    @Column(name = "self_introduction", columnDefinition = "TEXT")
    private String selfIntroduction;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 생성/수정 자동 처리
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isDeleted = false;
        this.isPublic = false;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}