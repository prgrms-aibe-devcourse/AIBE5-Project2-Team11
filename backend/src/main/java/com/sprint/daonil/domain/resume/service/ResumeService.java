package com.sprint.daonil.domain.resume.service;

import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import com.sprint.daonil.domain.resume.dto.ResumeListResponseDto;
import com.sprint.daonil.domain.resume.repository.ResumeRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final MemberRepository memberRepository;

    // 이력서 목록 조회
    @Transactional(readOnly = true)
    public List<ResumeListResponseDto> getResumeList(Long userId) {
        Member member = memberRepository.findById(userId).orElse(null);
        if (member == null) {
            return null;
        }

        return resumeRepository.findByMember_MemberIdAndIsDeletedFalse(userId)
                .stream()
                .map(ResumeListResponseDto::from)
                .toList();
    }
}
