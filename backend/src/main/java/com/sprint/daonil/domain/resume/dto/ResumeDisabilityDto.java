package com.sprint.daonil.domain.resume.dto;

import com.sprint.daonil.domain.resume.entity.Resume;
import com.sprint.daonil.domain.resume.entity.ResumeDisability;
import com.sprint.daonil.domain.resume.entity.test.Disability;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeDisabilityDto {
    private String disabilityName;   // 장애 이름
    private String description;      // 개인 설명

//    public Object toEntity(Resume resume, Disability disability) {
//        ResumeDisability entity = new ResumeDisability();
//
//        entity.setDisability(disability);
//        entity.setResume(resume);
//        entity.setDescription(this.description);
//
//        return entity;
//    }
}