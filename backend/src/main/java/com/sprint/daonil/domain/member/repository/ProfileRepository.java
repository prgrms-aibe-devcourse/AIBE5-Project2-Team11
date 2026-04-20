package com.sprint.daonil.domain.member.repository;

import com.sprint.daonil.domain.member.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    @Query("SELECT p FROM Profile p WHERE p.member.memberId = :memberId")
    Optional<Profile> findByMemberId(@Param("memberId") Long memberId);
}

