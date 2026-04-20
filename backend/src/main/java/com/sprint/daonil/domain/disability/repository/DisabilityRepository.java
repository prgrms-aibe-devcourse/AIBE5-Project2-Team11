package com.sprint.daonil.domain.disability.repository;

import com.sprint.daonil.domain.disability.entity.Disability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisabilityRepository extends JpaRepository<Disability, Long> {
    Optional<Disability> findByName(String name);
}

