package com.sprint.daonil.domain.member.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileLanguageDto {

    private Long id;
    private String languageName;
    private String testName;
    private String score;
    private String acquiredDate;
    private String expirationDate;
}

