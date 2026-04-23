package com.sprint.daonil.domain.Certificate.Repository;

import com.sprint.daonil.domain.Certificate.Entity.ExamDate;
import com.sprint.daonil.domain.Certificate.Entity.ExamDateId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamDateRepository extends JpaRepository<ExamDate, ExamDateId> {
    
    // jmCd로 모든 시험 일정 조회
    @Query("SELECT e FROM ExamDate e WHERE e.id.jmCd = :jmCd ORDER BY e.id.year DESC, e.id.period DESC")
    List<ExamDate> findByJmCd(@Param("jmCd") String jmCd);
    
}







