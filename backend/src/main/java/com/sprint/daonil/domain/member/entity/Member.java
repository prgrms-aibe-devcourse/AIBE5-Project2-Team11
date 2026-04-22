package com.sprint.daonil.domain.member.entity;

import com.sprint.daonil.domain.member.enumtype.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "login_id", nullable = false, length = 50)
    private String loginId;

    @Column(nullable = true, length = 255)
    private String password;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;

    @Column(length = 255)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)  // ✅ length 20으로 설정 (JOB_SEEKER 10글자 + 여유)
    private Role role;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}