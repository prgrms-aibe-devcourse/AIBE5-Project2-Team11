package com.sprint.daonil.domain.qualification.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "qualification")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Qualification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "fieldId", length = 50)
    private String fieldId;

    @Column(name = "course", columnDefinition = "TEXT")
    private String course;

    @Column(name = "JMCD", length = 20, unique = true)
    private String jmcd;
}

