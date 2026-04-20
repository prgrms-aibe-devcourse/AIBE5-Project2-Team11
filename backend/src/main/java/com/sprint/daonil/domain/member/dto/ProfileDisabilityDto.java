package com.sprint.daonil.domain.member.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDisabilityDto {

    private Long id;
    private String disabilityName;
    private String severity;
    private String note;
}

