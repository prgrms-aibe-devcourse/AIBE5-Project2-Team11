package com.sprint.daonil.domain.company.repository;

import com.sprint.daonil.domain.company.entity.IndustryType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IndustryTypeRepository extends JpaRepository<IndustryType, Long> {
}