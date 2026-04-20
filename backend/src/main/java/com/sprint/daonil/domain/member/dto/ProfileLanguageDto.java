package com.sprint.daonil.domain.member.dto;

import lombok.*;

import java.time.LocalDate;

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
    private LocalDate acquiredDate;
    private LocalDate expirationDate;
}

