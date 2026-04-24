package com.sprint.daonil.domain.company.dto;


import com.sprint.daonil.domain.company.entity.Company;
import com.sprint.daonil.domain.member.entity.Member;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CompanyInfoResponseDto {
    // 회사 정보
    private String companyName;
    private String businessNumber; // 사업자 등록 번호

    private Long industryTypeId;
    private Long detailIndustryTypeId;

    private String companyEmail;
    private String address;
    private String companyDescription;

    // 담당자 정보 (Member)
    private String managerName;
    private String managerPhone;
    private String managerOfficeAddress;


    // Entity -> DTO 변환
    public static CompanyInfoResponseDto fromEntity(Company company) {
        CompanyInfoResponseDto dto = new CompanyInfoResponseDto();

        dto.setCompanyName(company.getCompanyName());
        dto.setBusinessNumber(company.getBusinessNumber());
        dto.setIndustryTypeId(company.getIndustryTypeId());
        dto.setDetailIndustryTypeId(company.getDetailIndustryTypeId());
        dto.setCompanyEmail(company.getCompanyEmail());
        dto.setAddress(company.getAddress());
        dto.setCompanyDescription(company.getCompanyDescription());
        dto.setManagerName(company.getMember().getName());
        dto.setManagerPhone(company.getMember().getPhoneNumber());
        dto.setManagerOfficeAddress(company.getMember().getAddress());

        return dto;
    }
}
