package com.sprint.daonil.domain.resume.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resume_skill")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id")
    private Long skillId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(name = "skill_keyword", nullable = false)
    private String skillKeyword;



}