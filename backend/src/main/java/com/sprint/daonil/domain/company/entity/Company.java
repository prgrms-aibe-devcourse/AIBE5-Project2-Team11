package com.sprint.daonil.domain.company.entity;

import com.sprint.daonil.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "company")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "business_number", nullable = false, length = 30)
    private String businessNumber;

    @Column(name = "industry_type_id")
    private Long industryTypeId;

    @Column(name = "detail_industry_type_id")
    private Long detailIndustryTypeId;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "company_name", length = 30)
    private String companyName;

    @Column(name = "company_email", length = 100)
    private String companyEmail;

    @Column(name = "company_description", columnDefinition = "TEXT")
    private String companyDescription;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

