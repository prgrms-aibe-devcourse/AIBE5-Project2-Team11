package com.sprint.daonil.domain.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "birth_date")
    private String birthDate;

    @Column(name = "preferred_job", length = 100)
    private String preferredJob;

    @Column(name = "preferred_region", length = 100)
    private String preferredRegion;

    @Column(name = "desired_salary", length = 100)
    private String desiredSalary;

    @Column(name = "career", length = 100)
    private String career;

    @Column(name = "introduction", columnDefinition = "TEXT")
    private String introduction;

    @Column(name = "env_both_hands", length = 50)
    private String envBothHands;

    @Column(name = "env_eyesight", length = 50)
    private String envEyesight;

    @Column(name = "env_hand_work", length = 50)
    private String envHandWork;

    @Column(name = "env_lift_power", length = 50)
    private String envLiftPower;

    @Column(name = "env_lstn_talk", length = 50)
    private String envLstnTalk;

    @Column(name = "env_stnd_walk", length = 50)
    private String envStndWalk;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProfileLanguage> languages = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProfileCertificate> certificates = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProfileDisability> disabilities = new ArrayList<>();
}

