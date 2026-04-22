package com.sprint.daonil.domain.bookmark.entity;

import com.sprint.daonil.domain.jobposting.entity.JobPosting;
import com.sprint.daonil.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 무분별한 객체 생성 방지 (JPA 프록시 생성을 위해 PROTECTED 허용)
@EntityListeners(AuditingEntityListener.class) // created_at 자동 저장을 위한 리스너
@Table(
        name = "bookmark",
        // 1. 중복 북마크 방지용 복합 유니크 제약조건 명시
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_member_job",
                        columnNames = {"member_id", "job_posting_id"}
                )
        },
        // 2. 공고 기준 조회 최적화용 단일 인덱스 명시
        indexes = {
                @Index(name = "idx_job_posting", columnList = "job_posting_id")
        }
)
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookmark_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE) // DB의 ON DELETE CASCADE와 동기화
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE) // DB의 ON DELETE CASCADE와 동기화
    private JobPosting jobPosting;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Builder 패턴을 사용하여 필수 값만으로 안전하게 객체 생성
    @Builder
    public Bookmark(Member member, JobPosting jobPosting) {
        this.member = member;
        this.jobPosting = jobPosting;
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
