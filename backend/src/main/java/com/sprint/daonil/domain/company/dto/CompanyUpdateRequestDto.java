package com.sprint.daonil.domain.company.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyUpdateRequestDto {
    // 회사 정보
    private String companyName;
    private String companyEmail;
    private String address;
    private String companyDescription;

    // 업종
    private Long industryTypeId;
    private Long detailIndustryTypeId;

}