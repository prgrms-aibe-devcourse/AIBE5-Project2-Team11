package com.sprint.daonil.domain.company.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "detail_industry_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetailIndustryType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_industry_type_id")
    private Long detailIndustryTypeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "industry_type_id", nullable = false)
    private IndustryType industryType;

    @Column(name = "detail_industry_name", nullable = false, length = 100)
    private String detailIndustryName;
}