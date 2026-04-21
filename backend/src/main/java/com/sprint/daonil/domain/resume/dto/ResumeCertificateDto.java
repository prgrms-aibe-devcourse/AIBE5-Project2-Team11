package com.sprint.daonil.domain.resume.dto;

import com.sprint.daonil.domain.Certificate.Entity.Qualification;
import com.sprint.daonil.domain.resume.entity.Resume;
import com.sprint.daonil.domain.resume.entity.ResumeCertificate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResumeCertificateDto {

    private String certificateName;
    private LocalDate acquiredDate;

    public ResumeCertificate toEntity(Resume resume, Qualification qualification) {
        ResumeCertificate entity = new ResumeCertificate();
        entity.setResume(resume);
        entity.setQualification(qualification);
        entity.setAcquiredDate(acquiredDate);

        return entity;
    }
}