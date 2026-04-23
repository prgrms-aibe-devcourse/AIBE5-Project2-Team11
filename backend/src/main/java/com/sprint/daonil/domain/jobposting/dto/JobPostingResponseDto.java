package com.sprint.daonil.domain.jobposting.dto;

import com.sprint.daonil.domain.jobposting.entity.JobPosting;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostingResponseDto {

    private Long jobPostingId;
    private Long companyId;
    private String companyName;
    private String title;
    private String mainCategory;
    private String subCategory;
    private String employmentType;
    private String workRegion;
    private Integer salary;
    private String salaryType;
    private Integer recruitCount;
    private String qualification;
    private LocalDate applicationStartDate;
    private LocalDate applicationEndDate;
    private Boolean isClosed;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String content;
    private String workHours;
    private String envBothHands;
    private String envEyesight;
    private String envHandWork;
    private String envLiftPower;
    private String envLstnTalk;
    private String envStndWalk;

    public static JobPostingResponseDto fromEntity(JobPosting jobPosting) {
        return JobPostingResponseDto.builder()
                .jobPostingId(jobPosting.getJobPostingId())
                .companyId(jobPosting.getCompany().getCompanyId())
                .companyName(jobPosting.getCompany().getCompanyName())
                .title(jobPosting.getTitle())
                .mainCategory(jobPosting.getMainCategory())
                .subCategory(jobPosting.getSubCategory())
                .employmentType(jobPosting.getEmploymentType())
                .workRegion(jobPosting.getWorkRegion())
                .salary(jobPosting.getSalary())
                .salaryType(jobPosting.getSalaryType())
                .recruitCount(jobPosting.getRecruitCount())
                .qualification(jobPosting.getQualification())
                .applicationStartDate(jobPosting.getApplicationStartDate())
                .applicationEndDate(jobPosting.getApplicationEndDate())
                .isClosed(jobPosting.getIsClosed())
                .viewCount(jobPosting.getViewCount())
                .createdAt(jobPosting.getCreatedAt())
                .updatedAt(jobPosting.getUpdatedAt())
                .content(jobPosting.getContent())
                .workHours(jobPosting.getWorkHours())
                .envBothHands(jobPosting.getEnvBothHands())
                .envEyesight(jobPosting.getEnvEyesight())
                .envHandWork(jobPosting.getEnvHandWork())
                .envLiftPower(jobPosting.getEnvLiftPower())
                .envLstnTalk(jobPosting.getEnvLstnTalk())
                .envStndWalk(jobPosting.getEnvStndWalk())
                .build();
    }
}
