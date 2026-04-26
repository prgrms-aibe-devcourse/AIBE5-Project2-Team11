package com.sprint.daonil.domain.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequestDto {

    private String loginId;
    private String password;
    private String role;  // JOB_SEEKER 또는 COMPANY
}