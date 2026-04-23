package com.sprint.daonil.domain.alarm.controller;

import com.sprint.daonil.config.JwtUtil;
import com.sprint.daonil.domain.alarm.dto.AlarmDTO;
import com.sprint.daonil.domain.alarm.service.AlarmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/alarms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AlarmController {

    private final AlarmService alarmService;
    private final JwtUtil jwtUtil;

    /**
     * 현재 로그인한 회원의 모든 알림 조회
     * GET /api/alarms
     * Header: Authorization: Bearer {token}
     */
    @GetMapping
    public ResponseEntity<List<AlarmDTO>> getMyAlarms(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtUtil.extractTokenFromHeader(authHeader);
        Long memberId = jwtUtil.getMemberIdFromToken(token);

        if (memberId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("회원 {} 의 알림 조회 요청", memberId);
        List<AlarmDTO> alarms = alarmService.getAlarmsByMemberId(memberId);
        return ResponseEntity.ok(alarms);
    }

    /**
     * 현재 로그인한 회원의 읽지 않은 알림 조회
     * GET /api/alarms/unread
     * Header: Authorization: Bearer {token}
     */
    @GetMapping("/unread")
    public ResponseEntity<List<AlarmDTO>> getUnreadAlarms(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtUtil.extractTokenFromHeader(authHeader);
        Long memberId = jwtUtil.getMemberIdFromToken(token);

        if (memberId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("회원 {} 의 읽지 않은 알림 조회 요청", memberId);
        List<AlarmDTO> alarms = alarmService.getUnreadAlarmsByMemberId(memberId);
        return ResponseEntity.ok(alarms);
    }

    /**
     * 특정 알림을 읽음 처리
     * PUT /api/alarms/{alarmId}
     * Header: Authorization: Bearer {token}
     */
    @PutMapping("/{alarmId}")
    public ResponseEntity<AlarmDTO> markAlarmAsRead(
            @PathVariable Long alarmId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtUtil.extractTokenFromHeader(authHeader);
        Long memberId = jwtUtil.getMemberIdFromToken(token);

        if (memberId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("회원 {} 의 알림 {} 읽음 처리 요청", memberId, alarmId);
        AlarmDTO updatedAlarm = alarmService.markAsRead(alarmId);
        return ResponseEntity.ok(updatedAlarm);
    }

    /**
     * 알림 삭제
     * DELETE /api/alarms/{alarmId}
     * Header: Authorization: Bearer {token}
     */
    @DeleteMapping("/{alarmId}")
    public ResponseEntity<String> deleteAlarm(
            @PathVariable Long alarmId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtUtil.extractTokenFromHeader(authHeader);
        Long memberId = jwtUtil.getMemberIdFromToken(token);

        if (memberId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("회원 {} 의 알림 {} 삭제 요청", memberId, alarmId);
        alarmService.deleteAlarm(alarmId);
        return ResponseEntity.ok("알림이 삭제되었습니다.");
    }
}

