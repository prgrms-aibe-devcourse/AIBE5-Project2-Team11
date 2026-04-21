package com.sprint.daonil.domain.resume.dto;

import com.sprint.daonil.domain.resume.entity.Resume;
import com.sprint.daonil.domain.resume.entity.ResumeSkill;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResumeSkillDto {

    private String skillKeyword;

    public ResumeSkill toEntity(Resume resume) {
        ResumeSkill entity = new ResumeSkill();
        entity.setSkillKeyword(skillKeyword);
        entity.setResume(resume);
        return entity;
    }
}