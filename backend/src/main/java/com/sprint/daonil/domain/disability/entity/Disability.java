package com.sprint.daonil.domain.disability.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "disability")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Disability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "disability_id")
    private Long disabilityId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = 255)
    private String description;
}

