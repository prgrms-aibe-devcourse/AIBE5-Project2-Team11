package com.sprint.daonil.domain.resume.dto;

import com.sprint.daonil.domain.resume.entity.Resume;
import com.sprint.daonil.domain.resume.entity.ResumeCareer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResumeCareerDto {

    private String companyName;
    private String position;
    private LocalDate startDate;
    private LocalDate endDate;
    private String content;

    public ResumeCareer toEntity(Resume resume) {
        ResumeCareer entity = new ResumeCareer();
        entity.setCompanyName(companyName);
        entity.setPosition(position);
        entity.setStartDate(startDate);
        entity.setEndDate(endDate);
        entity.setContent(content);
        entity.setResume(resume);
        return entity;
    }
}