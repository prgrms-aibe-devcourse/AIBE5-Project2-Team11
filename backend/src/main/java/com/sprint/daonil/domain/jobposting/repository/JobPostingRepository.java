package com.sprint.daonil.domain.jobposting.repository;

import com.sprint.daonil.domain.jobposting.entity.JobPosting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying; // 추가
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

    /**
     * 1. 다중 필터 검색 및 페이징 (목록 조회용)
     * - 컨트롤러에서 파라미터가 안 넘어오면(null) 해당 조건은 무시하고 전체 검색으로 동작
     * - 키워드(keyword)는 제목(title)과 내용(content)에서 모두 검색
     */
    @Query("SELECT jp FROM JobPosting jp WHERE jp.isClosed = :isClosed " +
            "AND (:keyword IS NULL OR jp.title LIKE %:keyword% OR jp.content LIKE %:keyword%) " +
            "AND (:jobCategory IS NULL OR jp.jobCategory = :jobCategory) " +
            "AND (:workRegion IS NULL OR jp.workRegion LIKE %:workRegion%) " +
            "AND (:envBothHands IS NULL OR jp.envBothHands = :envBothHands) " +
            "AND (:envEyesight IS NULL OR jp.envEyesight = :envEyesight) " +
            "AND (:envHandWork IS NULL OR jp.envHandWork = :envHandWork) " +
            "AND (:envLiftPower IS NULL OR jp.envLiftPower = :envLiftPower) " +
            "AND (:envLstnTalk IS NULL OR jp.envLstnTalk = :envLstnTalk) " +
            "AND (:envStndWalk IS NULL OR jp.envStndWalk = :envStndWalk)")
    Page<JobPosting> findByFilters(@Param("keyword") String keyword,
                                   @Param("jobCategory") String jobCategory,
                                   @Param("workRegion") String workRegion,
                                   @Param("envBothHands") String envBothHands,
                                   @Param("envEyesight") String envEyesight,
                                   @Param("envHandWork") String envHandWork,
                                   @Param("envLiftPower") String envLiftPower,
                                   @Param("envLstnTalk") String envLstnTalk,
                                   @Param("envStndWalk") String envStndWalk,
                                   @Param("isClosed") Boolean isClosed,
                                   Pageable pageable);

    /**
     * 2. 채용공고 조회수 증가 (상세 조회용)
     * - DB에 직접 UPDATE 쿼리를 날려 동시성 문제를 방지하고 성능 최적화
     * - clearAutomatically = true: 업데이트 직후 영속성 컨텍스트(메모리)를 비워 최신 상태 유지
     */
    @Modifying(clearAutomatically = true)
    @Query("UPDATE JobPosting jp SET jp.viewCount = jp.viewCount + 1 WHERE jp.jobPostingId = :jobPostingId")
    void incrementViewCount(@Param("jobPostingId") Long jobPostingId);





    // ----------추후 구현 --------------
    // 기업 아이디별 공고 조회 / 일괄 마감 처리 / 검색 성능 최적화용 N+1 문제 해결 (@EntityGraph)

    /**
     * 특정 회사가 작성한 채용공고 목록 조회 (기업 마이페이지용)
     */
    Page<JobPosting> findByCompany_Member_LoginId(String loginId, Pageable pageable);

    /**
     * 마감일이 지난 채용공고 일괄 마감 처리 (스케줄러용 벌크 연산)
     */
    @Modifying(clearAutomatically = true)
    @Query("UPDATE JobPosting jp SET jp.isClosed = true " +
            "WHERE jp.isClosed = false AND jp.applicationEndDate < :today")
    int closeExpiredJobPostings(@Param("today") LocalDate today);
}