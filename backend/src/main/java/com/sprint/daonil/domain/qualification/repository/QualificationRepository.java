package com.sprint.daonil.domain.qualification.repository;

import com.sprint.daonil.domain.qualification.entity.Qualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QualificationRepository extends JpaRepository<Qualification, Long> {

    // fieldId로 자격증 조회
    List<Qualification> findByFieldId(String fieldId);

    // 직무분야(depth1)로 자격증 조회
    List<Qualification> findByFieldIdStartingWith(String fieldId);

    // JMCD로 자격증 조회
    Optional<Qualification> findByJmcd(String jmcd);

    // 모든 자격증 조회
    List<Qualification> findAll();

    // 직무 카테고리(depth2)로 자격증 조회
    // Native SQL: field.depth2와 일치하는 필드의 id를 찾아서 qualification을 조회
    @Query(value = "SELECT q.* FROM qualification q " +
                   "WHERE q.fieldId IN (" +
                   "  SELECT f.id FROM field f WHERE f.depth2 = :category" +
                   ")",
           nativeQuery = true)
    List<Qualification> findByFieldDepth2(@Param("category") String category);

    // 디버깅용: category와 일치하는 모든 field 조회
    @Query(value = "SELECT f.id, f.depth1, f.depth2 FROM field f WHERE f.depth2 = :category",
           nativeQuery = true)
    List<Object[]> findFieldsByDepth2(@Param("category") String category);

    // Fallback: fieldId가 category와 일치하거나 포함하는 경우
    @Query(value = "SELECT q.* FROM qualification q " +
                   "WHERE q.fieldId LIKE CONCAT('%', :category, '%') " +
                   "OR q.name LIKE CONCAT('%', :category, '%')",
           nativeQuery = true)
    List<Qualification> findByFieldIdOrNameContaining(@Param("category") String category);
}

