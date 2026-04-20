package com.sprint.daonil.domain.resume.dto;

import com.sprint.daonil.domain.resume.entity.Resume;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ResumeListResponseDto {
    private Long resumeId;
    private String title;
    private String memberName;
    private LocalDateTime updatedAt;
    private List<ResumeSkillDto> skills;


    public static ResumeListResponseDto from(Resume resume) {
        ResumeListResponseDto dto = new ResumeListResponseDto();
        dto.setResumeId(resume.getResumeId());
        dto.setTitle(resume.getTitle());
        dto.setMemberName(
                resume.getMember() != null ? resume.getMember().getName() : null
        );
        dto.setUpdatedAt(resume.getUpdatedAt());
        dto.setSkills(
                resume.getSkills().stream()
                        .map(s -> new ResumeSkillDto(s.getSkillKeyword()))
                        .toList()
        );

        return dto;
    }
}
