package com.sprint.daonil.domain.resume.entity.test;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "disability")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Disability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "disability_id")
    private Long disabilityId;

    @Column(nullable = false)
    private String name;

    private String description;
}