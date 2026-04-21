package com.sprint.daonil.domain.Certificate.Repository;

import com.sprint.daonil.domain.Certificate.Entity.Qualification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QualificationRepository extends JpaRepository<Qualification, Integer> {
    List<Qualification> findByNameIn(List<String> names);
}
