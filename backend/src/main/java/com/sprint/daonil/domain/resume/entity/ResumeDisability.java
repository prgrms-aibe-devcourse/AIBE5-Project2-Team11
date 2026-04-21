package com.sprint.daonil.domain.resume.entity;

import com.sprint.daonil.domain.disability.entity.Disability;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resume_disability")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeDisability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resume_disability_id")
    private Long resumeDisabilityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disability_id", nullable = false)
    private Disability disability;

    private String description;
}