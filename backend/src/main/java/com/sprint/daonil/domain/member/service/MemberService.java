package com.sprint.daonil.domain.member.service;

import com.sprint.daonil.config.JwtUtil;
import com.sprint.daonil.domain.company.dto.CompanySignupRequestDto;
import com.sprint.daonil.domain.company.entity.Company;
import com.sprint.daonil.domain.company.repository.CompanyRepository;
import com.sprint.daonil.domain.member.dto.LoginRequestDto;
import com.sprint.daonil.domain.member.dto.SignupRequestDto;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.entity.SocialAccount;
import com.sprint.daonil.domain.member.enumtype.Role;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import com.sprint.daonil.domain.member.repository.SocialAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final SocialAccountRepository socialAccountRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public Member signup(SignupRequestDto requestDto) {
        // 중복 체크
        if (memberRepository.existsByLoginId(requestDto.getLoginId())) {
            throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
        }

        if (memberRepository.existsByEmail(requestDto.getEmail())) {
            throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

        // Member 엔티티 생성
        Member member = Member.builder()
                .email(requestDto.getEmail())
                .loginId(requestDto.getLoginId())
                .password(encodedPassword)
                .name(requestDto.getName())
                .phoneNumber(requestDto.getPhoneNumber())
                .address(requestDto.getAddress())
                .role(requestDto.getRole())
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return memberRepository.save(member);
    }

    @Transactional
    public Member companySignup(CompanySignupRequestDto requestDto) {
        // 중복 체크
        if (memberRepository.existsByLoginId(requestDto.getLoginId())) {
            throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
        }

        if (memberRepository.existsByEmail(requestDto.getEmail())) {
            throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
        }

        if (companyRepository.existsByBusinessNumber(requestDto.getBusinessNumber())) {
            throw new IllegalArgumentException("이미 등록된 사업자 번호입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

        // Member 엔티티 생성
        Member member = Member.builder()
                .email(requestDto.getEmail())
                .loginId(requestDto.getLoginId())
                .password(encodedPassword)
                .name(requestDto.getName())
                .phoneNumber(requestDto.getPhoneNumber())
                .address(requestDto.getAddress())
                .role(Role.COMPANY)
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Member savedMember = memberRepository.save(member);

        // Company 엔티티 생성 및 저장
        Company company = Company.builder()
                .member(savedMember)
                .businessNumber(requestDto.getBusinessNumber())
                .companyName(requestDto.getCompanyName())
                .companyEmail(requestDto.getCompanyEmail())
                .address(requestDto.getCompanyAddress())
                .companyDescription(requestDto.getCompanyDescription())
                .industryTypeId(null)
                .detailIndustryTypeId(null)
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        companyRepository.save(company);

        return savedMember;
    }

    public Member login(LoginRequestDto requestDto) {
        // 아이디로 회원 찾기
        Member member = memberRepository.findByLoginId(requestDto.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        // 비밀번호 검증
        if (!passwordEncoder.matches(requestDto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return member;
    }

    public String generateToken(Member member) {
        return jwtUtil.generateToken(member.getMemberId(), member.getLoginId());
    }

    public Member getMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
    }

    public Member getMemberByLoginId(String loginId) {
        return memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
    }

    public boolean existsByLoginId(String loginId) {
        return memberRepository.existsByLoginId(loginId);
    }

    public boolean existsByEmail(String email) {
        return memberRepository.existsByEmail(email);
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Transactional
    public void changePassword(String loginId, String currentPassword, String newPassword) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호와 현재 비밀번호가 같은지 확인
        if (currentPassword.equals(newPassword)) {
            throw new IllegalArgumentException("새 비밀번호는 현재 비밀번호와 다르게 설정해주세요.");
        }

        // 새 비밀번호 암호화하여 저장
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        member.setPassword(encodedNewPassword);
        member.setUpdatedAt(LocalDateTime.now());
        memberRepository.save(member);
    }

    @Transactional
    public void deleteMember(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // isDeleted를 true로 변경
        member.setIsDeleted(true);
        member.setUpdatedAt(LocalDateTime.now());
        memberRepository.save(member);
    }

    @Transactional
    public Member updateMemberInfo(String loginId, String name, String phoneNumber, String address) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // name은 필수 필드
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("이름은 필수입니다.");
        }

        member.setName(name.trim());

        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            member.setPhoneNumber(phoneNumber.trim());
        }
        if (address != null && !address.trim().isEmpty()) {
            member.setAddress(address.trim());
        }

        member.setUpdatedAt(LocalDateTime.now());
        return memberRepository.save(member);
    }

    /**
     * 소셜 계정 조회 - provider와 providerUserId로
     */
    public Optional<SocialAccount> findSocialAccount(String provider, String providerUserId) {
        return socialAccountRepository.findByProviderAndProviderUserId(provider, providerUserId);
    }

    /**
     * 소셜 계정 생성 및 회원 연결
     */
    @Transactional
    public Member createOrUpdateSocialUser(String provider, String providerUserId, String email, String name, String profileImageUrl) {

        // 1. 기존 소셜 계정 확인
        Optional<SocialAccount> existingSocialAccount = socialAccountRepository
                .findByProviderAndProviderUserId(provider, providerUserId);

        if (existingSocialAccount.isPresent()) {
            // 기존 소셜 계정이 있으면 해당 회원 반환
            return existingSocialAccount.get().getMember();
        }

        // 2. 기존 회원 확인 (같은 이메일로)
        Member member;
        if (email != null) {
            Optional<Member> existingMember = memberRepository.findByEmail(email);
            if (existingMember.isPresent()) {
                member = existingMember.get();
            } else {
                // 새로운 회원 생성
                member = createNewSocialMember(provider, providerUserId, email, name);
            }
        } else {
            // 이메일이 없으면 새로운 회원 생성
            member = createNewSocialMember(provider, providerUserId, email, name);
        }

        // 3. 소셜 계정 정보 저장
        SocialAccount socialAccount = SocialAccount.builder()
                .member(member)
                .provider(provider)
                .providerUserId(providerUserId)
                .email(email)
                .name(name)
                .profileImageUrl(profileImageUrl)
                .linkedAt(LocalDateTime.now())
                .build();

        socialAccountRepository.save(socialAccount);

        return member;
    }

    /**
     * 소셜 로그인용 새로운 회원 생성
     */
    @Transactional
    private Member createNewSocialMember(String provider, String providerUserId, String email, String name) {
        Member member = Member.builder()
                .email(email != null ? email : "oauth2_" + provider + "_" + providerUserId + "@daonil.com")
                .loginId(provider + "_" + providerUserId)
                .password(null)  // 소셜 로그인은 비밀번호 없음
                .name(name != null ? name : "User")
                .phoneNumber(null)
                .address(null)
                .role(Role.JOB_SEEKER)  // 기본값: 구직자
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return memberRepository.save(member);
    }

    /**
     * 소셜 계정으로 회원 조회
     */
    public Member getSocialMember(String provider, String providerUserId) {
        SocialAccount socialAccount = socialAccountRepository
                .findByProviderAndProviderUserId(provider, providerUserId)
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 소셜 계정입니다."));

        return socialAccount.getMember();
    }

    /**
     * 회원이 소셜 계정을 연결했는지 확인
     */
    public boolean hasSocialAccount(Long memberId, String provider) {
        return socialAccountRepository.findByMemberMemberIdAndProvider(memberId, provider).isPresent();
    }

    /**
     * 소셜 계정 해제
     */
    @Transactional
    public void unlinkSocialAccount(Long memberId, String provider) {
        SocialAccount socialAccount = socialAccountRepository
                .findByMemberMemberIdAndProvider(memberId, provider)
                .orElseThrow(() -> new IllegalArgumentException("연결된 소셜 계정이 없습니다."));

        socialAccountRepository.delete(socialAccount);
    }

    /**
     * 소셜 로그인 후 추가 정보 입력 및 역할 설정
     */
    @Transactional
    public Member completeSocialMemberRegistration(Long memberId, Role role, String phoneNumber, String address) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 역할 필수 설정
        if (role == null || role == Role.PENDING) {
            throw new IllegalArgumentException("역할(JOB_SEEKER 또는 COMPANY)을 선택해주세요.");
        }

        // PENDING 상태의 회원만 변경 가능
        if (member.getRole() != Role.PENDING) {
            throw new IllegalArgumentException("이미 역할이 설정된 회원입니다.");
        }

        member.setRole(role);
        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            member.setPhoneNumber(phoneNumber.trim());
        }
        if (address != null && !address.trim().isEmpty()) {
            member.setAddress(address.trim());
        }

        member.setUpdatedAt(LocalDateTime.now());
        return memberRepository.save(member);
    }
}