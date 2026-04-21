package com.sprint.daonil.domain.ai.repository;

import com.sprint.daonil.domain.ai.entity.JobEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface JobEmbeddingRepository extends JpaRepository<JobEmbedding, Long> {

    /**
     * Job ID로 임베딩 조회
     */
    Optional<JobEmbedding> findByJobId(Long jobId);

    /**
     * 모든 임베딩 조회 (추천 시 전체 비교용)
     */
    List<JobEmbedding> findAll();

    /**
     * Job ID로 임베딩 삭제 (공고 삭제 시)
     */
    void deleteByJobId(Long jobId);

    /**
     * 임베딩이 존재하는지 확인
     */
    boolean existsByJobId(Long jobId);
}

