package com.sprint.daonil.domain.member.service;

import com.sprint.daonil.config.JwtUtil;
import com.sprint.daonil.domain.company.dto.CompanySignupRequestDto;
import com.sprint.daonil.domain.company.entity.Company;
import com.sprint.daonil.domain.company.repository.CompanyRepository;
import com.sprint.daonil.domain.member.dto.LoginRequestDto;
import com.sprint.daonil.domain.member.dto.SignupRequestDto;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.enumtype.Role;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
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
}