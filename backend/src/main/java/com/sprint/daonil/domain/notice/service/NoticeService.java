package com.sprint.daonil.domain.notice.service;

import com.sprint.daonil.domain.notice.dto.NoticeDTO;
import com.sprint.daonil.domain.notice.entity.Notice;
import com.sprint.daonil.domain.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;

    /**
     * 모든 공지사항 조회 (최신순)
     */
    public Page<NoticeDTO> getAllNotices(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Notice> notices = noticeRepository.findAll(pageable);
        return notices.map(this::convertToDTO);
    }

    /**
     * 공지사항 검색 (제목으로 검색)
     */
    public Page<NoticeDTO> searchNotices(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Notice> notices = noticeRepository.findByTitleContainingIgnoreCase(keyword, pageable);
        return notices.map(this::convertToDTO);
    }

    /**
     * 특정 공지사항 조회
     */
    public NoticeDTO getNoticeById(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다. ID: " + noticeId));
        return convertToDTO(notice);
    }

    /**
     * 공지사항 생성 (관리자용)
     */
    @Transactional
    public NoticeDTO createNotice(NoticeDTO noticeDTO) {
        Notice notice = Notice.builder()
                .title(noticeDTO.getTitle())
                .content(noticeDTO.getContent())
                .build();
        Notice savedNotice = noticeRepository.save(notice);
        return convertToDTO(savedNotice);
    }

    /**
     * 공지사항 수정 (관리자용)
     */
    @Transactional
    public NoticeDTO updateNotice(Long noticeId, NoticeDTO noticeDTO) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다. ID: " + noticeId));

        if (noticeDTO.getTitle() != null) {
            notice.setTitle(noticeDTO.getTitle());
        }
        if (noticeDTO.getContent() != null) {
            notice.setContent(noticeDTO.getContent());
        }

        Notice updatedNotice = noticeRepository.save(notice);
        return convertToDTO(updatedNotice);
    }

    /**
     * 공지사항 삭제 (관리자용)
     */
    @Transactional
    public void deleteNotice(Long noticeId) {
        if (!noticeRepository.existsById(noticeId)) {
            throw new RuntimeException("공지사항을 찾을 수 없습니다. ID: " + noticeId);
        }
        noticeRepository.deleteById(noticeId);
    }

    /**
     * Entity to DTO 변환
     */
    private NoticeDTO convertToDTO(Notice notice) {
        return NoticeDTO.builder()
                .noticeId(notice.getNoticeId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .createdAt(notice.getCreatedAt())
                .build();
    }
}

