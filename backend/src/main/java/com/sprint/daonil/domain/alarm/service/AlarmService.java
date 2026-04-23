package com.sprint.daonil.domain.alarm.service;

import com.sprint.daonil.domain.alarm.dto.AlarmDTO;
import com.sprint.daonil.domain.alarm.entity.Alarm;
import com.sprint.daonil.domain.alarm.repository.AlarmRepository;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlarmService {

    private final AlarmRepository alarmRepository;
    private final MemberRepository memberRepository;

    /**
     * 특정 회원의 모든 알림 조회
     */
    @Transactional(readOnly = true)
    public List<AlarmDTO> getAlarmsByMemberId(Long memberId) {
        log.info("회원 {} 의 알림 조회", memberId);
        List<Alarm> alarms = alarmRepository.findByReceiverId(memberId);
        return alarms.stream()
                .map(AlarmDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 특정 회원의 읽지 않은 알림 조회
     */
    @Transactional(readOnly = true)
    public List<AlarmDTO> getUnreadAlarmsByMemberId(Long memberId) {
        log.info("회원 {} 의 읽지 않은 알림 조회", memberId);
        List<Alarm> alarms = alarmRepository.findUnreadByReceiverId(memberId);
        return alarms.stream()
                .map(AlarmDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 알림 읽음 처리
     */
    @Transactional
    public AlarmDTO markAsRead(Long alarmId) {
        log.info("알림 {} 읽음 처리", alarmId);
        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다. alarmId: " + alarmId));
        alarm.setIsRead(true);
        alarmRepository.save(alarm);
        return AlarmDTO.fromEntity(alarm);
    }

    /**
     * 알림 생성
     */
    @Transactional
    public AlarmDTO createAlarm(Long receiverId, String message) {
        log.info("회원 {} 에게 알림 생성: {}", receiverId, message);
        Member receiver = memberRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다. memberId: " + receiverId));

        Alarm alarm = Alarm.builder()
                .receiver(receiver)
                .message(message)
                .isRead(false)
                .build();

        alarmRepository.save(alarm);
        return AlarmDTO.fromEntity(alarm);
    }

    /**
     * 알림 삭제
     */
    @Transactional
    public void deleteAlarm(Long alarmId) {
        log.info("알림 {} 삭제", alarmId);
        alarmRepository.deleteById(alarmId);
    }
}

