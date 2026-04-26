package com.sprint.daonil.domain.apply.event;

import com.sprint.daonil.domain.alarm.service.AlarmService;
import com.sprint.daonil.domain.apply.eunmtype.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * 지원 상태 변경 이벤트를 수신하여 알림을 생성하는 리스너.
 *
 * - @TransactionalEventListener(AFTER_COMMIT): 상태 변경 트랜잭션이 커밋된 후에만 실행
 * - @Transactional(REQUIRES_NEW): 알림 저장은 별도 트랜잭션으로 실행
 * - @Async: 비동기로 실행하여 응답 지연 방지
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ApplicationStatusEventListener {

    private final AlarmService alarmService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleStatusChanged(ApplicationStatusChangedEvent event) {
        try {
            String statusMessage = getStatusMessage(event.getNewStatus());
            String message = String.format(
                    "[%s] 공고에 지원하신 건의 상태가 '%s'(으)로 변경되었습니다.",
                    event.getJobTitle(), statusMessage
            );

            alarmService.createAlarm(event.getReceiverId(), message);

            log.info("지원 상태 변경 알림 전송 완료 - 지원자: {}, 공고: {}, {} → {}",
                    event.getReceiverId(), event.getJobTitle(),
                    event.getOldStatus(), event.getNewStatus());
        } catch (Exception e) {
            // 알림 실패가 원래 트랜잭션에 영향을 주지 않음 (이미 커밋 완료)
            log.error("지원 상태 변경 알림 전송 실패 - applicationId: {}, error: {}",
                    event.getApplicationId(), e.getMessage(), e);
        }
    }

    private String getStatusMessage(Status status) {
        return switch (status) {
            case SUBMITTED -> "지원 완료";
            case DOCUMENT_PASSED -> "서류 합격";
            case DOCUMENT_FAILED -> "서류 불합격";
            case INTERVIEW_PASSED -> "면접 합격";
            case INTERVIEW_FAILED -> "면접 불합격";
            case FINAL_ACCEPTED -> "최종 합격";
            case FINAL_REJECTED -> "최종 불합격";
        };
    }
}
