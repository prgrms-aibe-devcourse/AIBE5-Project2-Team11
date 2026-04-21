package com.sprint.daonil.domain.resume.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "resume_education")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "education_id")
    private Long educationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    private String schoolName;
    private String major;

    private LocalDate startDate;
    private LocalDate endDate;

    private String degree;


}