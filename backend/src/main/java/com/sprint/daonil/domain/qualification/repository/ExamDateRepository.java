package com.sprint.daonil.domain.qualification.repository;

import com.sprint.daonil.domain.qualification.entity.ExamDate;
import com.sprint.daonil.domain.qualification.entity.ExamDateId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamDateRepository extends JpaRepository<ExamDate, ExamDateId> {

    // JMCD로 시험일정 조회
    List<ExamDate> findByIdJmcd(String jmcd);

    // JMCD와 연도로 시험일정 조회
    List<ExamDate> findByIdJmcdAndIdYear(String jmcd, Integer year);
}

