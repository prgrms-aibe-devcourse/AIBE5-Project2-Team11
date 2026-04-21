package com.sprint.daonil.domain.resume.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_career")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeCareer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "career_id")
    private Long careerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    private String companyName;
    private String position;

    private LocalDate startDate;
    private LocalDate endDate;

    @Lob
    private String content;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @PrePersist
    public void onCreate() {
        this.createdDate = LocalDateTime.now();
    }



}