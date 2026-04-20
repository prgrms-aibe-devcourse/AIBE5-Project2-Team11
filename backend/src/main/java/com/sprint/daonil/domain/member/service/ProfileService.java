package com.sprint.daonil.domain.member.service;

import com.sprint.daonil.domain.disability.repository.DisabilityRepository;
import com.sprint.daonil.domain.member.dto.*;
import com.sprint.daonil.domain.member.entity.*;
import com.sprint.daonil.domain.member.repository.ProfileRepository;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final MemberRepository memberRepository;
    private final DisabilityRepository disabilityRepository;
    private final MemberService memberService;

    @Transactional
    public ProfileResponseDto saveProfile(Long memberId, ProfileRequestDto requestDto) {
        // 사용자 조회
        Member member = memberService.getMemberById(memberId);

        // 기존 프로필이 있는지 확인
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseGet(() -> {
                    Profile newProfile = Profile.builder()
                            .member(member)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();
                    return newProfile;
                });

        // 프로필 정보 업데이트
        profile.setCareer(requestDto.getCareer());
        profile.setPreferredJob(requestDto.getPreferredJob());
        profile.setPreferredRegion(requestDto.getPreferredRegion());
        profile.setDesiredSalary(requestDto.getDesiredSalary());
        profile.setIntroduction(requestDto.getIntroduction());
        profile.setEnvBothHands(requestDto.getEnvBothHands());
        profile.setEnvEyesight(requestDto.getEnvEyesight());
        profile.setEnvHandWork(requestDto.getEnvHandWork());
        profile.setEnvLiftPower(requestDto.getEnvLiftPower());
        profile.setEnvLstnTalk(requestDto.getEnvLstnTalk());
        profile.setEnvStndWalk(requestDto.getEnvStndWalk());
        profile.setUpdatedAt(LocalDateTime.now());

        // 언어 정보 업데이트
        if (requestDto.getLanguages() != null) {
            profile.getLanguages().clear();
            for (ProfileLanguageDto langDto : requestDto.getLanguages()) {
                ProfileLanguage language = ProfileLanguage.builder()
                        .profile(profile)
                        .languageName(langDto.getLanguageName())
                        .testName(langDto.getTestName())
                        .score(langDto.getScore())
                        .acquiredDate(langDto.getAcquiredDate())
                        .expirationDate(langDto.getExpirationDate())
                        .build();
                profile.getLanguages().add(language);
            }
        }

        // 자격증 정보 업데이트
        if (requestDto.getCertificates() != null) {
            profile.getCertificates().clear();
            for (ProfileCertificateDto certDto : requestDto.getCertificates()) {
                ProfileCertificate certificate = ProfileCertificate.builder()
                        .profile(profile)
                        .certificateName(certDto.getCertificateName())
                        .acquiredDate(certDto.getAcquiredDate())
                        .scoreOrGrade(certDto.getScoreOrGrade())
                        .status(certDto.getStatus())
                        .build();
                profile.getCertificates().add(certificate);
            }
        }

        // 장애 정보 업데이트
        if (requestDto.getDisabilities() != null) {
            profile.getDisabilities().clear();
            for (ProfileDisabilityDto disDto : requestDto.getDisabilities()) {
                // disabilityName으로 Disability 조회
                var disability = disabilityRepository.findByName(disDto.getDisabilityName())
                        .orElseThrow(() -> new IllegalArgumentException("장애 유형을 찾을 수 없습니다: " + disDto.getDisabilityName()));

                ProfileDisability profileDisability = ProfileDisability.builder()
                        .profile(profile)
                        .disability(disability)
                        .severity(disDto.getSeverity())
                        .note(disDto.getNote())
                        .build();
                profile.getDisabilities().add(profileDisability);
            }
        }

        Profile savedProfile = profileRepository.save(profile);
        return convertToResponseDto(savedProfile);
    }

    public ProfileResponseDto getProfile(Long memberId) {
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseGet(() -> {
                    // 프로필이 없으면 빈 프로필 생성
                    Member member = memberService.getMemberById(memberId);
                    Profile newProfile = Profile.builder()
                            .member(member)
                            .languages(new ArrayList<>())
                            .certificates(new ArrayList<>())
                            .disabilities(new ArrayList<>())
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();
                    return profileRepository.save(newProfile);
                });

        return convertToResponseDto(profile);
    }

    private ProfileResponseDto convertToResponseDto(Profile profile) {
        List<ProfileLanguageDto> languages = profile.getLanguages().stream()
                .map(lang -> ProfileLanguageDto.builder()
                        .id(lang.getProfileLanguageId())
                        .languageName(lang.getLanguageName())
                        .testName(lang.getTestName())
                        .score(lang.getScore())
                        .acquiredDate(lang.getAcquiredDate())
                        .expirationDate(lang.getExpirationDate())
                        .build())
                .collect(Collectors.toList());

        List<ProfileCertificateDto> certificates = profile.getCertificates().stream()
                .map(cert -> ProfileCertificateDto.builder()
                        .id(cert.getProfileCertificateId())
                        .certificateName(cert.getCertificateName())
                        .acquiredDate(cert.getAcquiredDate())
                        .scoreOrGrade(cert.getScoreOrGrade())
                        .status(cert.getStatus())
                        .build())
                .collect(Collectors.toList());

        List<ProfileDisabilityDto> disabilities = profile.getDisabilities().stream()
                .map(dis -> ProfileDisabilityDto.builder()
                        .id(dis.getProfileDisabilityId())
                        .disabilityName(dis.getDisability().getName())
                        .severity(dis.getSeverity())
                        .note(dis.getNote())
                        .build())
                .collect(Collectors.toList());

        return ProfileResponseDto.builder()
                .profileId(profile.getProfileId())
                .career(profile.getCareer())
                .preferredJob(profile.getPreferredJob())
                .preferredRegion(profile.getPreferredRegion())
                .desiredSalary(profile.getDesiredSalary())
                .introduction(profile.getIntroduction())
                .envBothHands(profile.getEnvBothHands())
                .envEyesight(profile.getEnvEyesight())
                .envHandWork(profile.getEnvHandWork())
                .envLiftPower(profile.getEnvLiftPower())
                .envLstnTalk(profile.getEnvLstnTalk())
                .envStndWalk(profile.getEnvStndWalk())
                .languages(languages)
                .certificates(certificates)
                .disabilities(disabilities)
                .build();
    }
}

