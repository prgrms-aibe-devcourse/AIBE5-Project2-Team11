package com.sprint.daonil.domain.member.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profile_disability")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDisability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_disability_id")
    private Long profileDisabilityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Column(name = "disability_name", length = 100)
    private String disabilityName;

    @Column(name = "severity", length = 50)
    private String severity;

    @Column(name = "note", length = 255)
    private String note;
}

