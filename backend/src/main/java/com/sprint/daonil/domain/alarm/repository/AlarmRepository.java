package com.sprint.daonil.domain.alarm.repository;

import com.sprint.daonil.domain.alarm.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm, Long> {

    /**
     * 특정 회원의 모든 알림 조회 (최신순)
     */
    @Query("SELECT a FROM Alarm a WHERE a.receiver.memberId = :memberId ORDER BY a.createdAt DESC")
    List<Alarm> findByReceiverId(@Param("memberId") Long memberId);

    /**
     * 특정 회원의 읽지 않은 알림 조회
     */
    @Query("SELECT a FROM Alarm a WHERE a.receiver.memberId = :memberId AND a.isRead = false ORDER BY a.createdAt DESC")
    List<Alarm> findUnreadByReceiverId(@Param("memberId") Long memberId);
}

