package com.sprint.daonil.domain.company.repository;

import com.sprint.daonil.domain.company.entity.Company;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    boolean existsByBusinessNumber(String businessNumber);

    @EntityGraph(attributePaths = {"member"})
    Optional<Company> findByMember_LoginId(String loginId);

}
