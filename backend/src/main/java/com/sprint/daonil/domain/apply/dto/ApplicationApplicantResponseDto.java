package com.sprint.daonil.domain.apply.dto;

import com.sprint.daonil.domain.apply.entity.Application;
import com.sprint.daonil.domain.resume.entity.ResumeSkill;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationApplicantResponseDto {
    private Long applicationId;
    private String applicantName;
    private String applicantEmail;
    private String phoneNumber;
    private String status;
    private LocalDateTime appliedAt;
    private Long resumeId;
    
    // 추가 상세 정보
    private String birthDate;   // Profile 엔티티의 birthDate (String 타입)
    private String disability;  // ResumeDisability 정보
    private String education;   // 대표 학력
    private String career;      // 대표 경력
    private List<String> skills; // 보유 스킬 리스트
    private String intro;       // 자기소개 요약
    private String userPhoto;   // 지원자 사진

    public static ApplicationApplicantResponseDto from(Application application, String birthDate) {
        var resume = application.getResume();
        
        // 대표 학력 추출 (가장 마지막 학력)
        String eduInfo = (resume.getEducations() == null || resume.getEducations().isEmpty()) ? "정보 없음" : 
            resume.getEducations().get(resume.getEducations().size() - 1).getSchoolName() + " (" + 
            resume.getEducations().get(resume.getEducations().size() - 1).getDegree() + ")";

        // 대표 경력 추출
        String careerInfo = (resume.getCareers() == null || resume.getCareers().isEmpty()) ? "신입" : 
            resume.getCareers().get(0).getCompanyName() + " (" + 
            resume.getCareers().get(0).getPosition() + ")";

        // 장애 정보 추출
        String disInfo = (resume.getDisabilities() == null || resume.getDisabilities().isEmpty()) ? "정보 없음" : 
            resume.getDisabilities().get(0).getDisability().getName();

        // 스킬 리스트 추출
        List<String> skillList = resume.getSkills().stream()
                .map(ResumeSkill::getSkillKeyword)
                .collect(Collectors.toList());

        return ApplicationApplicantResponseDto.builder()
                .applicationId(application.getApplicationId())
                .applicantName(application.getMember().getName())
                .applicantEmail(application.getMember().getEmail())
                .phoneNumber(application.getMember().getPhoneNumber())
                .status(application.getStatus().name())
                .appliedAt(application.getAppliedAt())
                .resumeId(resume.getResumeId())
                .birthDate(birthDate)
                .disability(disInfo)
                .education(eduInfo)
                .career(careerInfo)
                .skills(skillList)
                .intro(resume.getSelfIntroduction())
                .userPhoto(resume.getUserPhoto())
                .build();
    }
}
