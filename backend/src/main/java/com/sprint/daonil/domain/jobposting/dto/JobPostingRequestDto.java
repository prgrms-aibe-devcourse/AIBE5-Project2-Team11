package com.sprint.daonil.domain.jobposting.dto;

import com.sprint.daonil.domain.company.entity.Company;
import com.sprint.daonil.domain.jobposting.entity.JobPosting;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostingRequestDto {

    private String title;
    private String jobCategory;
    private String employmentType;
    private String workRegion;
    private Integer salary;
    private String salaryType;
    private Integer recruitCount;
    private String qualification;
    private LocalDate applicationStartDate;
    private LocalDate applicationEndDate;
    private String content;
    private String workHours;
    private Integer envBothHands;
    private Integer envEyesight;
    private Integer envHandWork;
    private Integer envLiftPower;
    private Integer envLstnTalk;
    private Integer envStndWalk;

    // service에서 Company엔티티 전달
    public JobPosting toEntity(Company company) {
        return JobPosting.builder()
                .company(company)
                .title(this.title)
                .jobCategory(this.jobCategory)
                .employmentType(this.employmentType)
                .workRegion(this.workRegion)
                .salary(this.salary)
                .salaryType(this.salaryType)
                .recruitCount(this.recruitCount)
                .qualification(this.qualification)
                .applicationStartDate(this.applicationStartDate)
                .applicationEndDate(this.applicationEndDate)
                .content(this.content)
                .workHours(this.workHours)
                .envBothHands(this.envBothHands)
                .envEyesight(this.envEyesight)
                .envHandWork(this.envHandWork)
                .envLiftPower(this.envLiftPower)
                .envLstnTalk(this.envLstnTalk)
                .envStndWalk(this.envStndWalk)
                .isClosed(false)
                .viewCount(0)
                .build();
    }
}
