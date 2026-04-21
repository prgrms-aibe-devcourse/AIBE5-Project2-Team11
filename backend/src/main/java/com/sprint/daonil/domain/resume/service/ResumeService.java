package com.sprint.daonil.domain.resume.service;

import com.sprint.daonil.domain.Certificate.Entity.Qualification;
import com.sprint.daonil.domain.Certificate.Repository.QualificationRepository;
import com.sprint.daonil.domain.disability.entity.Disability;
import com.sprint.daonil.domain.disability.repository.DisabilityRepository;
import com.sprint.daonil.domain.member.entity.*;
import com.sprint.daonil.domain.member.repository.*;
import com.sprint.daonil.domain.resume.dto.*;
import com.sprint.daonil.domain.resume.entity.*;
import com.sprint.daonil.domain.resume.repository.ResumeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final MemberRepository memberRepository;
    private final DisabilityRepository disabilityRepository;
    private final QualificationRepository qualificationRepository;
    private final ProfileRepository profileRepository;

    // 이력서 목록 조회
    @Transactional(readOnly = true)
    public Page<ResumeListResponseDto> getResumeList(Long userId, Pageable pageable) {
        // 페이지네이션 적용한 리스트 조회
        Page<Resume> resumePage =
                resumeRepository.findByMember_MemberIdAndIsDeletedFalse(userId, pageable);

        return resumePage.map(ResumeListResponseDto::from);
    }


    // 이력서 상세 조회
    @Transactional(readOnly = true)
    public ResumeDetailResponseDto getResumeDetail(Long userId, Long resumeId) {
        // 이력서 조회
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 이력서입니다."));

        // 권한 체크
        if (!resume.getMember().getMemberId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "접근 권한이 없습니다.");
        }

        // 회원 프로필 정보 조회
         Profile profile = profileRepository.findByMemberId(resume.getMember().getMemberId()).orElse(null);

         return ResumeDetailResponseDto.from(resume, profile);

    }



    // 이력서 생성
    public Long createResume(Long userId, ResumeWriteRequestDto dto, MultipartFile image) {
        // 회원 조회
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));

        // 이미지 저장
        String imagePath = null;
        if (image != null && !image.isEmpty()) { // 이미지 존재하는 경우
            imagePath = saveImage(userId,image);
        }

        // 장애 유형 조회
        List<String> disabilityNames = dto.getResumeDisabilities().stream()
                .map(ResumeDisabilityDto::getDisabilityName).toList();
        List<Disability> disabilities = disabilityRepository.findByNameIn(disabilityNames);

        Map<String, Disability> disabilityMap = disabilities.stream()
                .collect(Collectors.toMap( Disability::getName, d -> d));

        // 자격증 이름 리스트 추출
        List<String> CertificateNames = dto.getCertificates().stream()
                .map(ResumeCertificateDto::getCertificateName).toList();
        List<Qualification> qualifications = qualificationRepository.findByNameIn(CertificateNames);

        Map<String, Qualification> CertificateNamesMap = qualifications.stream()
                .collect(Collectors.toMap(Qualification::getName, q -> q));


        // 이력서 생성 (DTO -> Entity 변환)
        Resume resume = dto.toEntity(member, imagePath);

        List<ResumeDisability> resumeDisabilityList = dto.getResumeDisabilities().stream()
                        .map(d -> { 
                            Disability disability = disabilityMap.get(d.getDisabilityName());

                            if (disability == null) {
                                throw new IllegalArgumentException(
                                        "존재하지 않는 장애 유형: " + d.getDisabilityName()
                                );
                            }
                            
                            return d.toEntity(resume, disability);
                        }).toList();
        resume.setDisabilities(resumeDisabilityList);

        List<ResumeCertificate> resumeCertificateList = dto.getCertificates().stream()
                .map(c -> {
                    Qualification qualification = CertificateNamesMap.get(c.getCertificateName());

                    if (qualification == null) {
                        throw new IllegalArgumentException(
                                "존재하지 않는 자격증: " + c.getCertificateName()
                        );
                    }

                    return c.toEntity(resume, qualification);
                }).toList();
        resume.setCertificates(resumeCertificateList);
        
        // 저장
        resumeRepository.save(resume);

        // 생성된 ID 반환
        return resume.getResumeId();
    }


    // 이력서 수정
    public Long updateResume(Long userId, Long resumeId, ResumeWriteRequestDto dto, MultipartFile image) {
        // 회원 조회
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));

        // 기존 이력서 조회
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 이력서입니다."));

        // 권한 체크
        if (!resume.getMember().getMemberId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }


        // 이미지 처리 (있으면 교체, 없으면 유지)
        String imagePath = resume.getUserPhoto(); // 기존 이미지 조회

        if (image != null && !image.isEmpty()) {
            imagePath = saveImage(userId, image);
        }
        resume.setUserPhoto(imagePath);

        // 기본 정보 업데이트
        if (dto.getTitle() != null) { resume.setTitle(dto.getTitle()); }
        if (dto.getSelfIntroduction() != null) { resume.setSelfIntroduction(dto.getSelfIntroduction()); }
        if (dto.getPortfolioUrl() != null) { resume.setPortfolioUrl(dto.getPortfolioUrl()); }

        // 리스트 필드 전체 교체
        if (dto.getCareers() != null) { // 경력 관련 정보 수정
            resume.getCareers().clear(); // 리스트&DB 삭제 (고아객체이므로)
            resume.getCareers().addAll( // DTO 리스트 -> Entity 리스트
                    dto.getCareers().stream()
                            .map(c -> c.toEntity(resume)).toList()
            );
        }

        if (dto.getEducations() != null) { // 학력 관련 정보 수정
            resume.getEducations().clear();
            resume.getEducations().addAll(
                    dto.getEducations().stream()
                            .map(e -> e.toEntity(resume)).toList()
            );
        }

        if (dto.getSkills() != null) { // 스킬 관련 정보 수정
            resume.getSkills().clear();
            resume.getSkills().addAll(
                    dto.getSkills().stream()
                            .map(s -> s.toEntity(resume)).toList()
            );
        }

        if (dto.getLangQualifications() != null) { // 어학 관련 정보 수정
            resume.getLangQualifications().clear();
            resume.getLangQualifications().addAll(
                    dto.getLangQualifications().stream()
                            .map(l -> l.toEntity(resume)).toList()
            );
        }

        if (dto.getResumeDisabilities() != null) {
            resume.getDisabilities().clear();

            List<String> names = dto.getResumeDisabilities().stream()
                    .map(ResumeDisabilityDto::getDisabilityName).toList();

            List<Disability> disabilities = disabilityRepository.findByNameIn(names);

            Map<String, Disability> map = disabilities.stream()
                    .collect(Collectors.toMap( Disability::getName, d -> d));

            resume.getDisabilities().addAll(
                    dto.getResumeDisabilities().stream()
                            .map(d -> {
                                Disability disability = map.get(d.getDisabilityName());

                                if (disability == null) {
                                    throw new IllegalArgumentException(
                                            "존재하지 않는 장애 유형: " + d.getDisabilityName()
                                    );
                                }

                                return d.toEntity(resume, disability);
                            })
                            .toList()
            );
        }

        if (dto.getCertificates() != null) {

            resume.getCertificates().clear();

            List<String> names = dto.getCertificates().stream()
                    .map(ResumeCertificateDto::getCertificateName)
                    .toList();

            List<Qualification> qualifications = qualificationRepository.findByNameIn(names);

            Map<String, Qualification> map = qualifications.stream()
                    .collect(Collectors.toMap(Qualification::getName, q -> q));

            resume.getCertificates().addAll(
                    dto.getCertificates().stream()
                            .map(c -> {
                                Qualification qualification = map.get(c.getCertificateName());

                                if (qualification == null) {
                                    throw new IllegalArgumentException(
                                            "존재하지 않는 자격증: " + c.getCertificateName()
                                    );
                                }

                                return c.toEntity(resume, qualification);
                            })
                            .toList()
            );
        }


        // 저장
        resumeRepository.save(resume);

        // 반환
        return resume.getResumeId();
    }


    // 이력서 삭제
    @Transactional
    public Long deleteResume(Long userId, Long resumeId) {
        // 회원 조회
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));

        // 회원 소유 이력서 조회
        Resume resume = resumeRepository.findByResumeIdAndMember_MemberId(resumeId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 이력서입니다."));

        // soft delete 처리
        resume.setIsDeleted(true);

        return resume.getResumeId();
    }


    // 이력서 공개 설정
    @Transactional
    public Long updatePublicStatus(Long userId, Long resumeId) {
        // 회원 조회
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));

        // 사용자 소유의 이력서 가져오기
        Resume targetResume = resumeRepository.findByResumeIdAndMember_MemberId(resumeId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 이력서입니다."));

        // 이미 공개 설정인 경우
        if(targetResume.getIsPublic() == true){
            return targetResume.getResumeId();
        }

        // 유저의 모든 이력서 조회
        List<Resume> resumes = resumeRepository.findAllByMember_MemberId(userId);

        // 기본 이력서 설정
        for (Resume resume : resumes) { resume.setIsPublic(false); } // 전부 false
        targetResume.setIsPublic(true); // 선택한 것만 true

        return targetResume.getResumeId();
    }




    // =========== 로컬 파일 저장 메서드 =============
    private String saveImage(Long userId, MultipartFile file) {
        try {
            // 저장 경로
            String baseDir = "C:/daonil/userPhoto/"; // 기본 저장 루트
            String userDirPath = baseDir + userId + "/"; // // 유저별 폴더
            File userDir = new File(userDirPath);

            if (!userDir.exists()) { // 폴더 없으면 생성
                userDir.mkdirs();
            }

            // 최종 저장 경로
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename(); // 파일명 UUID + 원본명
            String filePath = userDirPath + fileName;
            file.transferTo(new File(filePath));

            // DB에 웹 접근 경로 저장
            return "/uploads/userPhoto/" + userId + "/" + fileName;
        } catch (IOException e) {
            throw new ResponseStatusException( HttpStatus.INTERNAL_SERVER_ERROR, "이미지 저장 실패" );
        }
    }

}
