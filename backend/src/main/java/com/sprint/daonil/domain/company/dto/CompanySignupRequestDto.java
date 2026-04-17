package com.sprint.daonil.domain.company.dto;

import com.sprint.daonil.domain.member.enumtype.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CompanySignupRequestDto {
    private String email;
    private String loginId;
    private String password;
    private String name;
    private String phoneNumber;
    private String address;
    private Role role;

    private String businessNumber;
    private String companyName;
    private String companyEmail;
    private String companyAddress;
    private String companyDescription;
}
