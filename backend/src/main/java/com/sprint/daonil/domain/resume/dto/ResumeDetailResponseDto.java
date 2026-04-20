package com.sprint.daonil.domain.resume.dto;

import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.resume.entity.Resume;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResumeDetailResponseDto {

    // 회원 정보
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private LocalDate birthDate;

    // 이력서 정보
    private String title;
    private String selfIntroduction;
    private String userPhoto;
    private String portfolioUrl;
    private Boolean isPublic;

    // 리스트
    private List<ResumeCareerDto> careers;
    private List<ResumeEducationDto> educations;
    private List<ResumeSkillDto> skills;
    private List<ResumeCertificateDto> certificates;
    private List<ResumeDisabilityDto> resumeDisabilities;
    private List<ResumeLangQualificationDto> langQualifications;


    public static ResumeDetailResponseDto from(Resume resume) {
        ResumeDetailResponseDto dto = new ResumeDetailResponseDto();

        Member member = resume.getMember();

        dto.setName(member.getName());
        dto.setEmail(member.getEmail());
        dto.setPhoneNumber(member.getPhoneNumber());
        dto.setAddress(member.getAddress());

        dto.setTitle(resume.getTitle());
        dto.setSelfIntroduction(resume.getSelfIntroduction());
        dto.setUserPhoto(resume.getUserPhoto());
        dto.setPortfolioUrl(resume.getPortfolioUrl());
        dto.setIsPublic(resume.getIsPublic());

        dto.setCareers(toCareerList(resume));
        dto.setEducations(toEducationList(resume));
        dto.setSkills(toSkillList(resume));
        dto.setCertificates(toCertificateList(resume));
        dto.setLangQualifications(toLangList(resume));
        dto.setResumeDisabilities(toDisabilityList(resume));

        return dto;
    }

    private static List<ResumeCareerDto> toCareerList(Resume resume) {
        return resume.getCareers().stream()
                .map(c -> {
                    ResumeCareerDto dto = new ResumeCareerDto();
                    dto.setCompanyName(c.getCompanyName());
                    dto.setPosition(c.getPosition());
                    dto.setStartDate(c.getStartDate());
                    dto.setEndDate(c.getEndDate());
                    dto.setContent(c.getContent());
                    return dto;
                }).toList();
    }

    private static List<ResumeEducationDto> toEducationList(Resume resume) {
        return resume.getEducations().stream()
                .map(e -> {
                    ResumeEducationDto dto = new ResumeEducationDto();
                    dto.setSchoolName(e.getSchoolName());
                    dto.setMajor(e.getMajor());
                    dto.setStartDate(e.getStartDate());
                    dto.setEndDate(e.getEndDate());
                    dto.setDegree(e.getDegree());
                    return dto;
                }).toList();
    }

    private static List<ResumeSkillDto> toSkillList(Resume resume) {
        return resume.getSkills().stream()
                .map(s -> {
                    ResumeSkillDto dto = new ResumeSkillDto();
                    dto.setSkillKeyword(s.getSkillKeyword());
                    return dto;
                }).toList();
    }

    private static List<ResumeCertificateDto> toCertificateList(Resume resume) {
        return resume.getCertificates().stream()
                .map(c -> {
                    ResumeCertificateDto dto = new ResumeCertificateDto();
                    dto.setCertificateName(c.getCertificate().getCertificateName());
                    dto.setDescription(c.getCertificate().getDescription());
                    dto.setIssuingOrganization(c.getCertificate().getIssuingOrganization());
                    dto.setAcquiredDate(c.getAcquiredDate());
                    return dto;
                }).toList();
    }

    private static List<ResumeLangQualificationDto> toLangList(Resume resume) {
        return resume.getLangQualifications().stream()
                .map(l -> {
                    ResumeLangQualificationDto dto = new ResumeLangQualificationDto();
                    dto.setLanguageName(l.getLanguageName());
                    dto.setTestName(l.getTestName());
                    dto.setScore(l.getScore());
                    dto.setAcquiredDate(l.getAcquiredDate());
                    dto.setExpirationDate(l.getExpirationDate());
                    return dto;
                }).toList();
    }

    private static List<ResumeDisabilityDto> toDisabilityList(Resume resume) {
        return resume.getDisabilities().stream()
                .map(d -> {
                    ResumeDisabilityDto dto = new ResumeDisabilityDto();
                    dto.setDisabilityName(d.getDisability().getName());
                    dto.setDescription(d.getDescription());
                    return dto;
                }).toList();
    }
}