package com.sprint.daonil.domain.member.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePasswordRequestDto {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}

