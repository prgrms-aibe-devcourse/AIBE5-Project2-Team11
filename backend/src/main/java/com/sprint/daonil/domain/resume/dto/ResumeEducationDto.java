package com.sprint.daonil.domain.resume.dto;

import com.sprint.daonil.domain.resume.entity.Resume;
import com.sprint.daonil.domain.resume.entity.ResumeEducation;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResumeEducationDto {

    private String schoolName;
    private String major;
    private LocalDate startDate;
    private LocalDate endDate;
    private String degree;

    public ResumeEducation toEntity(Resume resume) {
        ResumeEducation entity = new ResumeEducation();
        entity.setSchoolName(schoolName);
        entity.setMajor(major);
        entity.setStartDate(startDate);
        entity.setEndDate(endDate);
        entity.setDegree(degree);
        entity.setResume(resume);
        return entity;
    }
}