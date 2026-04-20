package com.sprint.daonil.domain.resume.service;

import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.repository.MemberRepository;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final MemberRepository memberRepository;

    // 이력서 목록 조회
    @Transactional(readOnly = true)
    public Page<ResumeListResponseDto> getResumeList(Long userId, Pageable pageable) {

        Page<Resume> resumePage =
                resumeRepository.findByMember_MemberIdAndIsDeletedFalse(userId, pageable);

        return resumePage.map(ResumeListResponseDto::from);
    }


    // 이력서 상세 조회
    @Transactional(readOnly = true)
    public ResumeDetailResponseDto getResumeDetail(Long userId, Long resumeId) {
        // 이력서 조회
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "이력서를 찾을 수 없습니다."));

        // 본인 이력서 여부 검증
        if (!resume.getMember().getMemberId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "접근 권한이 없습니다.");
        }

        return ResumeDetailResponseDto.from(resume);
    }



    // 이력서 생성
    public Long createResume(Long userId, ResumeWriteRequestDto dto, MultipartFile image) {
        // 회원 조회
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        // 이미지 저장
        String imagePath = null;
        if (image != null && !image.isEmpty()) { // 이미지 존재하는 경우
            imagePath = saveImage(userId,image);
        }

        // 이력서 생성 (DTO -> Entity 변환)
        Resume resume = dto.toEntity(member, imagePath);

        // 저장
        resumeRepository.save(resume);

        // 생성된 ID 반환
        return resume.getResumeId();
    }


    // 이력서 수정
    public Long updateResume(Long userId, Long resumeId, ResumeWriteRequestDto dto, MultipartFile image) {
        // 회원 조회
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        // 기존 이력서 조회
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("이력서가 존재하지 않습니다."));

        // 권한 체크
        if (!resume.getMember().getMemberId().equals(userId)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        // 이미지 처리 (있으면 교체, 없으면 유지)
        String imagePath = resume.getUserPhoto(); // 기존 이미지 조회

        if (image != null && !image.isEmpty()) {
            imagePath = saveImage(userId, image);
        }
        resume.setUserPhoto(imagePath);

        // 업데이트
        resume.setTitle(dto.getTitle());
        resume.setSelfIntroduction(dto.getSelfIntroduction());
        resume.setPortfolioUrl(dto.getPortfolioUrl());

        // 리스트 필드 전체 교체
        if (dto.getCareers() != null) {
            resume.getCareers().clear(); // 리스트 & DB에서 삭제 (고아객체이므로)
            resume.getCareers().addAll( // DTO 리스트 -> Entity 리스트
                    dto.getCareers().stream()
                            .map(c -> c.toEntity(resume))
                            .toList()
            );
        }

        if (dto.getEducations() != null) {
            resume.getEducations().clear();
            resume.getEducations().addAll(
                    dto.getEducations().stream()
                            .map(e -> e.toEntity(resume))
                            .toList()
            );
        }

        if (dto.getSkills() != null) {
            resume.getSkills().clear();
            resume.getSkills().addAll(
                    dto.getSkills().stream()
                            .map(s -> s.toEntity(resume))
                            .toList()
            );
        }

        if (dto.getLangQualifications() != null) {
            resume.getLangQualifications().clear();
            resume.getLangQualifications().addAll(
                    dto.getLangQualifications().stream()
                            .map(l -> l.toEntity(resume))
                            .toList()
            );
        }

        // 장애 유형도 수정 추가 예정
        // 자격증 유형도 수정 추가 예정


        // 저장
        resumeRepository.save(resume);

        // 반환
        return resume.getResumeId();
    }


    // 이력서 삭제
    @Transactional
    public Long deleteResume(Long userId, Long resumeId) {
        // 이력서 조회
        Resume resume = resumeRepository
                .findByResumeIdAndMember_MemberId(resumeId, userId)
                .orElseThrow(() -> new EntityNotFoundException("이력서를 찾을 수 없습니다."));

        // soft delete 처리
        resume.setIsDeleted(true);

        return resume.getResumeId();
    }


    // 이력서 공개 설정
    @Transactional
    public Long updatePublicStatus(Long userId, Long resumeId) {
        // 사용자의 현재 이력서 가져오기
        Resume target = resumeRepository
                .findByResumeIdAndMember_MemberId(resumeId, userId)
                .orElseThrow(() -> new EntityNotFoundException("이력서를 찾을 수 없습니다."));

        // 이미 공개 설정인 경우
        if(target.getIsPublic() == true){
            return target.getResumeId();
        }

        // 유저의 모든 이력서 조회
        List<Resume> resumes = resumeRepository.findAllByMember_MemberId(userId);

        // 기본 이력서 설정
        for (Resume resume : resumes) { resume.setIsPublic(false); } // 전부 false
        target.setIsPublic(true); // 선택한 것만 true

        return target.getResumeId();
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
            throw new RuntimeException("이미지 저장 실패", e);
        }
    }

}
