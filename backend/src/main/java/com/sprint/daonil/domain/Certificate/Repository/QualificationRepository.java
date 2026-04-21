package com.sprint.daonil.domain.Certificate.Repository;

import com.sprint.daonil.domain.Certificate.Entity.Qualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QualificationRepository extends JpaRepository<Qualification, Integer> {
    List<Qualification> findByNameIn(List<String> names);
    
    // JPQL JOIN 방식
    @Query("SELECT q FROM Qualification q JOIN q.field f WHERE f.depth2 = :depth2")
    List<Qualification> findByFieldDepth2(@Param("depth2") String depth2);
    
    // Native SQL 방식 (JPQL이 작동하지 않을 때 사용)
    @Query(value = "SELECT q.* FROM qualification q " +
                   "INNER JOIN field f ON q.fieldId = f.id " +
                   "WHERE f.depth2 = :depth2", nativeQuery = true)
    List<Qualification> findByFieldDepth2Native(@Param("depth2") String depth2);

    // 자격증명으로 조회
    Qualification findByName(String name);
    
    // JMCD로 조회
    Qualification findByJMCD(String jmcd);

    // 자격증명 검색
    @Query("SELECT q FROM Qualification q LEFT JOIN FETCH q.field WHERE q.name LIKE %:keyword%")
    List<Qualification> searchByKeyword(@Param("keyword") String keyword);

    // 디버그용: 모든 자격증과 필드 정보 조회
    @Query("SELECT q FROM Qualification q LEFT JOIN q.field f")
    List<Qualification> findAllWithField();
}
