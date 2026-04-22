package com.sprint.daonil.domain.member.repository;

import com.sprint.daonil.domain.member.entity.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {

    /**
     * provider와 providerUserId로 소셜 계정 찾기
     */
    Optional<SocialAccount> findByProviderAndProviderUserId(String provider, String providerUserId);

    /**
     * 특정 회원의 소셜 계정 찾기
     */
    Optional<SocialAccount> findByMemberMemberIdAndProvider(Long memberId, String provider);

    /**
     * provider 이메일로 소셜 계정 찾기
     */
    Optional<SocialAccount> findByProviderAndEmail(String provider, String email);

    /**
     * ✅ Fetch Join으로 Member와 함께 조회
     * Lazy Loading 문제를 완전히 해결
     * 세션 밖에서도 Member 데이터 접근 가능
     */
    @Query("SELECT s FROM SocialAccount s JOIN FETCH s.member WHERE s.provider = :provider AND s.providerUserId = :providerUserId")
    Optional<SocialAccount> findByProviderAndProviderUserIdWithMember(
            @Param("provider") String provider,
            @Param("providerUserId") String providerUserId
    );
}

