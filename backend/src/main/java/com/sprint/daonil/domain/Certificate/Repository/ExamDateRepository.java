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
    
    // Native Query: DB의 camelCase 컬럼을 Hibernate가 기대하는 snake_case 별칭으로 매핑
    @Query(value = "SELECT " +
            "jmCd AS jmCd, jmCd AS jm_cd, " +
            "year AS year, period AS period, " +
            "docRegStart AS doc_reg_start, docRegEnd AS doc_reg_end, " +
            "docVacancyStart AS doc_vacancy_start, docVacancyEnd AS doc_vacancy_end, " +
            "docExamStart AS doc_exam_start, docExamEnd AS doc_exam_end, " +
            "docPass AS doc_pass, " +
            "pracRegStart AS prac_reg_start, pracRegEnd AS prac_reg_end, " +
            "pracVacancyStart AS prac_vacancy_start, pracVacancyEnd AS prac_vacancy_end, " +
            "pracExamStart AS prac_exam_start, pracExamEnd AS prac_exam_end, " +
            "pracPass AS prac_pass " +
            "FROM `date` WHERE jmCd = :jmCd ORDER BY year DESC, period DESC", nativeQuery = true)
    List<ExamDate> findByJmCdNative(@Param("jmCd") String jmCd);
}







