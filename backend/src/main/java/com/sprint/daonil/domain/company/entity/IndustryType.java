package com.sprint.daonil.domain.company.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "industry_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IndustryType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "industry_type_id")
    private Long industryTypeId;

    @Column(name = "industry_name", nullable = false, length = 100)
    private String industryName;
}