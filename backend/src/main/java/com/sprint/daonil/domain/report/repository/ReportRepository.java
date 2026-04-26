package com.sprint.daonil.domain.report.repository;

import com.sprint.daonil.domain.report.entity.Report;
import com.sprint.daonil.domain.report.enumtype.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
    // 동일한 사용자가 동일한 대상(게시글 또는 댓글)을 중복 신고하는 것을 방지하기 위한 메서드
    boolean existsByReporterMemberIdAndTargetTypeAndTargetId(
            Long reporterMemberId,
            TargetType targetType,
            Long targetId
    );

}