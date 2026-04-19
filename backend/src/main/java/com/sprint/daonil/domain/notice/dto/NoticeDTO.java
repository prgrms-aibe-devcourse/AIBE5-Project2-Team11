package com.sprint.daonil.domain.notice.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeDTO {

    private Long noticeId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
}

