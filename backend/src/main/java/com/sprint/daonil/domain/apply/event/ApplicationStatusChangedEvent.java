package com.sprint.daonil.domain.apply.event;

import com.sprint.daonil.domain.apply.eunmtype.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 지원서 상태 변경 시 발행되는 도메인 이벤트.
 * ApplicationService 트랜잭션과 완전히 분리되어 처리됩니다.
 */
@Getter
@AllArgsConstructor
public class ApplicationStatusChangedEvent {

    private final Long applicationId;
    private final Long receiverId;
    private final String jobTitle;
    private final Status oldStatus;
    private final Status newStatus;
}
