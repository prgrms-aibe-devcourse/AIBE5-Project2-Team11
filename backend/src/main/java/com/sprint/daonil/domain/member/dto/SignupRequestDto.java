package com.sprint.daonil.domain.member.dto;

import com.sprint.daonil.domain.member.entity.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignupRequestDto {

    private String email;
    private String loginId;
    private String password;
    private String name;
    private String phoneNumber;
    private String address;
    private Role role;
}