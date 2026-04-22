package com.sprint.daonil.domain.member.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profile_certificate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_certificate_id")
    private Long profileCertificateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

//    @Column(name = "certificate_name", length = 150)
//    private String certificateName;

    @Column(name = "acquired_date")
    private String acquiredDate;

    @Column(name = "score_or_grade", length = 50)
    private String scoreOrGrade;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "field_id", length = 50, nullable = true)
    private String fieldId;
}



