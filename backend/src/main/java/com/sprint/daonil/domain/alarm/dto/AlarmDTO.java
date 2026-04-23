package com.sprint.daonil.domain.alarm.dto;

import com.sprint.daonil.domain.alarm.entity.Alarm;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlarmDTO {

    private Long alarmId;
    private Long receiverId;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static AlarmDTO fromEntity(Alarm alarm) {
        return AlarmDTO.builder()
                .alarmId(alarm.getAlarmId())
                .receiverId(alarm.getReceiver() != null ? alarm.getReceiver().getMemberId() : null)
                .message(alarm.getMessage())
                .isRead(alarm.getIsRead())
                .createdAt(alarm.getCreatedAt())
                .build();
    }
}

