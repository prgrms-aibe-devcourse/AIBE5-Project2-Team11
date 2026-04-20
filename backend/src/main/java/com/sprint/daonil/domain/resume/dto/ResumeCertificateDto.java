package com.sprint.daonil.domain.resume.dto;

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
    private String description;
    private String issuingOrganization;
    private LocalDate acquiredDate;
}