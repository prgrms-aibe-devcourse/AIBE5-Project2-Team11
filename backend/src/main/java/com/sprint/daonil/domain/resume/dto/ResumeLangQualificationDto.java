package com.sprint.daonil.domain.resume.dto;


import com.sprint.daonil.domain.resume.entity.Resume;
import com.sprint.daonil.domain.resume.entity.ResumeLangQualification;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeLangQualificationDto {

    private String languageName;
    private String testName;
    private String score;
    private LocalDate acquiredDate;
    private LocalDate expirationDate;

    public ResumeLangQualification toEntity(Resume resume) {
        ResumeLangQualification entity = new ResumeLangQualification();
        entity.setLanguageName(languageName);
        entity.setTestName(testName);
        entity.setScore(score);
        entity.setAcquiredDate(acquiredDate);
        entity.setExpirationDate(expirationDate);
        entity.setResume(resume);
        return entity;
    }
}