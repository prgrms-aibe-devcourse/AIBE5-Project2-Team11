package com.sprint.daonil.domain.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "profile_lang_qualification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileLanguage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_lang_qualification_id")
    private Long profileLanguageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Column(name = "language_name", length = 50)
    private String languageName;

    @Column(name = "test_name", length = 100)
    private String testName;

    @Column(name = "score", length = 50)
    private String score;

    @Column(name = "acquired_date")
    private LocalDate acquiredDate;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;
}

