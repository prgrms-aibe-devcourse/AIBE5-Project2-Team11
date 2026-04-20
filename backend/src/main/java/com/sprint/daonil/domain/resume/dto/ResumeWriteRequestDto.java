package com.sprint.daonil.domain.resume.dto;

import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.resume.entity.Resume;
import com.sprint.daonil.domain.resume.entity.test.Disability;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeWriteRequestDto {
    private String title;
    private String selfIntroduction;
    private String userPhoto;
    private String portfolioUrl;

    private List<ResumeCareerDto> careers;
    private List<ResumeEducationDto> educations;
    private List<ResumeSkillDto> skills;
    private List<ResumeCertificateDto> certificates;
    private List<ResumeDisabilityDto> resumeDisabilities;
    private List<ResumeLangQualificationDto> langQualifications;


    public Resume toEntity(Member member, String userPhoto) {
        Resume resume = new Resume();

        resume.setMember(member);
        resume.setTitle(this.title);
        resume.setSelfIntroduction(this.selfIntroduction);
        resume.setUserPhoto(userPhoto);
        resume.setPortfolioUrl(this.portfolioUrl);
        resume.setIsPublic(false);
        resume.setIsDeleted(false);

        if (careers != null) {
            resume.setCareers(careers.stream()
                    .map(c -> c.toEntity(resume))
                    .toList());
        }

        if (educations != null) {
            resume.setEducations(educations.stream()
                    .map(e -> e.toEntity(resume))
                    .toList());
        }

        if (skills != null) {
            resume.setSkills(skills.stream()
                    .map(s -> s.toEntity(resume))
                    .toList());
        }

        if (langQualifications != null) {
            resume.setLangQualifications(langQualifications.stream()
                    .map(l -> l.toEntity(resume))
                    .toList());
        }

        // 장애 유형 엔티티 변환 추가 예정
        // 자격증 엔티티 변환 추가 예정

        return resume;
    }
}
