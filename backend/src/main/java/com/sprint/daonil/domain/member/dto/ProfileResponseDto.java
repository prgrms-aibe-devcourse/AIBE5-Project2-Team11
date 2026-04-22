package com.sprint.daonil.domain.member.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponseDto {

    private Long profileId;
    private String birthDate;
    private String career;
    private String preferredJob;
    private String preferredRegion;
    private String desiredSalary;
    private String introduction;
    private String envBothHands;
    private String envEyesight;
    private String envHandWork;
    private String envLiftPower;
    private String envLstnTalk;
    private String envStndWalk;
    private List<ProfileLanguageDto> languages;
    private List<ProfileCertificateDto> certificates;
    private List<ProfileDisabilityDto> disabilities;
}

