package com.sprint.daonil.domain.resume.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "resume_lang_qualification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeLangQualification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resume_lang_qualification_id")
    private Long id;

    // 🔗 Resume 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(name = "language_name", nullable = false, length = 50)
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