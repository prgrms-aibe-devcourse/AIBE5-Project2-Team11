package com.sprint.daonil.domain.jobposting.entity;

import com.sprint.daonil.domain.company.entity.Company;
import com.sprint.daonil.domain.jobposting.dto.JobPostingRequestDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_posting")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 무분별한 객체 생성 방지
@AllArgsConstructor
@Builder
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_posting_id")
    private Long jobPostingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "job_category", length = 100)
    private String jobCategory;

    @Column(name = "employment_type", length = 50)
    private String employmentType;

    @Column(name = "work_region", length = 100)
    private String workRegion;

    @Column(name = "salary")
    private Integer salary;

    @Column(name = "salary_type", length = 50)
    private String salaryType;

    @Column(name = "recruit_count")
    private Integer recruitCount;

    @Column(name = "qualification", columnDefinition = "TEXT")
    private String qualification;

    @Column(name = "application_start_date")
    private LocalDate applicationStartDate;

    @Column(name = "application_end_date")
    private LocalDate applicationEndDate;

    @Builder.Default
    @Column(name = "is_closed", nullable = false)
    private Boolean isClosed = false;

    @Builder.Default
    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false) // 생성일은 업데이트 불가
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "content", length = 225)
    private String content;

    @Column(name = "work_hours", length = 100)
    private String workHours;

    @Column(name = "env_both_hands")
    private String envBothHands;

    @Column(name = "env_eyesight")
    private String envEyesight;

    @Column(name = "env_hand_work")
    private String envHandWork;

    @Column(name = "env_lift_power")
    private String envLiftPower;

    @Column(name = "env_lstn_talk")
    private String envLstnTalk;

    @Column(name = "env_stnd_walk")
    private String envStndWalk;



    public void update(JobPostingRequestDto requestDto) {
        this.title = requestDto.getTitle();
        this.jobCategory = requestDto.getJobCategory();
        this.employmentType = requestDto.getEmploymentType();
        this.workRegion = requestDto.getWorkRegion();
        this.salary = requestDto.getSalary();
        this.salaryType = requestDto.getSalaryType();
        this.recruitCount = requestDto.getRecruitCount();
        this.qualification = requestDto.getQualification();
        this.applicationStartDate = requestDto.getApplicationStartDate();
        this.applicationEndDate = requestDto.getApplicationEndDate();
        this.content = requestDto.getContent();
        this.workHours = requestDto.getWorkHours();

        // 환경 정보 업데이트
        this.envBothHands = requestDto.getEnvBothHands();
        this.envEyesight = requestDto.getEnvEyesight();
        this.envHandWork = requestDto.getEnvHandWork();
        this.envLiftPower = requestDto.getEnvLiftPower();
        this.envLstnTalk = requestDto.getEnvLstnTalk();
        this.envStndWalk = requestDto.getEnvStndWalk();
    }


    public void close() {
        this.isClosed = true;
    }


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}