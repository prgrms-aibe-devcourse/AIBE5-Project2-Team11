package com.sprint.daonil.domain.member.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMemberInfoRequestDto {
    private String name;
    private String phoneNumber;
    private String address;
}

