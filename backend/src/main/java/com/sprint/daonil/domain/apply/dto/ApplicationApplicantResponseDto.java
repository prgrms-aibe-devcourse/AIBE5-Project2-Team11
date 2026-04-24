package com.sprint.daonil.domain.apply.dto;

import com.sprint.daonil.domain.apply.entity.Application;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ApplicationApplicantResponseDto {
    private Long applicationId;
    private String applicantName;
    private String applicantEmail;
    private String status;
    private LocalDateTime appliedAt;
    private Long resumeId;

    public static ApplicationApplicantResponseDto from(Application application) {
        return ApplicationApplicantResponseDto.builder()
                .applicationId(application.getApplicationId())
                .applicantName(application.getMember().getName())
                .applicantEmail(application.getMember().getEmail())
                .status(application.getStatus().name())
                .appliedAt(application.getAppliedAt())
                .resumeId(application.getResume().getResumeId())
                .build();
    }
}
