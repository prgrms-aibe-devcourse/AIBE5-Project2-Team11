package com.sprint.daonil.domain.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "social_account", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"provider", "provider_user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "social_account_id")
    private Long socialAccountId;

    @ManyToOne(fetch = FetchType.EAGER)  // ✅ EAGER 로딩 - 프록시 문제 완전 해결
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "provider", nullable = false, length = 20)
    private String provider;  // GOOGLE, NAVER

    @Column(name = "provider_user_id", nullable = false, length = 100)
    private String providerUserId;  // 구글 sub, 네이버 id

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(name = "linked_at", nullable = false)
    private LocalDateTime linkedAt;
}

