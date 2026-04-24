package com.sprint.daonil.domain.apply.dto;

import com.sprint.daonil.domain.apply.entity.Application;
import com.sprint.daonil.domain.jobposting.dto.JobPostingResponseDto;
import com.sprint.daonil.domain.jobposting.entity.JobPosting;
import com.sprint.daonil.domain.member.entity.Profile;
import com.sprint.daonil.domain.resume.dto.ResumeDetailResponseDto;
import com.sprint.daonil.domain.resume.entity.Resume;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApplicationDetailResponseDto {

    // 지원 정보
    private Long applicationId;
    private String status;
    private LocalDateTime appliedAt;

    // 공고 정보
    private JobPostingResponseDto jobPosting;

    // 이력서 정보
    private ResumeDetailResponseDto resume;

    // Entity -> DTO 변환
    public static ApplicationDetailResponseDto from(Application application, Profile profile) {
        Resume resume = application.getResume();
        JobPosting jobPosting = application.getJobPosting();

        ApplicationDetailResponseDto dto = new ApplicationDetailResponseDto();

        dto.setApplicationId(application.getApplicationId());
        dto.setJobPosting(JobPostingResponseDto.fromEntity(jobPosting));
        dto.setStatus(application.getStatus().name());
        dto.setAppliedAt(application.getAppliedAt());
        dto.setResume(ResumeDetailResponseDto.from(resume, profile));

        return dto;
    }
}