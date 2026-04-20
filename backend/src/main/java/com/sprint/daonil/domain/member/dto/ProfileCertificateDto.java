package com.sprint.daonil.domain.member.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileCertificateDto {

    private Long id;
    private String certificateName;
    private String acquiredDate;
    private String scoreOrGrade;
    private String status;
    private String fieldId;
}

