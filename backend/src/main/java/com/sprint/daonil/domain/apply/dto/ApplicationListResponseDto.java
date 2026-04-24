package com.sprint.daonil.domain.apply.dto;

import com.sprint.daonil.domain.apply.entity.Application;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApplicationListResponseDto {
    private Long applicationId;      // 지원 ID
    private String companyName;      // 회사명
    private String jobTitle;         // 공고명
    private String jobCategory;      // 직무 대분류
    private String jobSubCategory;   // 직무 소분류
    private LocalDateTime appliedAt; // 지원일
    private String status;           // 지원 상태


    // Entity -> DTO
    public ApplicationListResponseDto(Application application) {
        this.applicationId = application.getApplicationId();
        this.companyName = application.getJobPosting().getCompany().getCompanyName();
        this.jobTitle = application.getJobPosting().getTitle();
        this.jobCategory = application.getJobPosting().getMainCategory();
        this.jobSubCategory = application.getJobPosting().getSubCategory();
        this.appliedAt = application.getAppliedAt();
        this.status = application.getStatus().name();
    }

}
