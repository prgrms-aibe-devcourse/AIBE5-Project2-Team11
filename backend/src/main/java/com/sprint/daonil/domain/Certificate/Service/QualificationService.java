package com.sprint.daonil.domain.Certificate.Service;

import com.sprint.daonil.domain.Certificate.Entity.ExamDate;
import com.sprint.daonil.domain.Certificate.Entity.Qualification;
import com.sprint.daonil.domain.Certificate.Repository.ExamDateRepository;
import com.sprint.daonil.domain.Certificate.Repository.QualificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class QualificationService {

    private final QualificationRepository qualificationRepository;
    private final ExamDateRepository examDateRepository;

    /**
     * 직무 카테고리(depth2)로 자격증 조회
     * @param category 직무 카테고리 (Field 테이블의 depth2)
     * @return 해당 카테고리의 자격증 리스트
     */
    public List<String> getQualificationNamesByCategory(String category) {
        log.info("🔍 자격증 조회 시작: category={}", category);
        
        // 먼저 JPQL로 시도
        List<Qualification> qualifications = qualificationRepository.findByFieldDepth2(category);
        
        log.info("✓ JPQL 조회 결과: {}개", qualifications.size());
        
        // JPQL이 결과가 없으면 Native SQL 시도
        if (qualifications.isEmpty()) {
            log.warn("⚠️ JPQL 결과가 없습니다. Native SQL로 재시도...");
            qualifications = qualificationRepository.findByFieldDepth2Native(category);
            log.info("✓ Native SQL 조회 결과: {}개", qualifications.size());
        }
        
        if (!qualifications.isEmpty()) {
            qualifications.forEach(q -> 
                log.info("  - 자격증: {} (fieldId: {})", q.getName(), 
                    q.getField() != null ? q.getField().getId() : "NULL")
            );
        } else {
            log.warn("⚠️ 카테고리 '{}' 에 매칭되는 자격증이 없습니다", category);
            log.warn("💡 DB 상태 확인:");
            log.warn("   SELECT * FROM field WHERE depth2='{}';", category);
            log.warn("   SELECT q.id, q.name, q.fieldId FROM qualification q WHERE q.fieldId IS NOT NULL LIMIT 10;");
        }
        
        return qualifications.stream()
                .map(Qualification::getName)
                .collect(Collectors.toList());
    }

    /**
     * 직무 카테고리(depth2)로 자격증 상세 정보 조회
     * @param category 직무 카테고리
     * @return 자격증 객체 리스트
     */
    public List<Qualification> getQualificationsByCategory(String category) {
        log.info("자격증 상세 조회: category={}", category);
        return qualificationRepository.findByFieldDepth2(category);
    }

    /**
     * 자격증명으로 자격증 조회
     * @param name 자격증명
     * @return 자격증 객체
     */
    public Qualification getQualificationByName(String name) {
        log.info("자격증 조회: name={}", name);
        return qualificationRepository.findByName(name);
    }

    /**
     * 자격증명으로 자격증 상세 정보 조회 (시험 일정 포함)
     * @param name 자격증명
     * @return 자격증 객체와 시험 일정
     */
    public Qualification getQualificationDetailWithExamDates(String name) {
        log.info("자격증 상세 조회 (시험 일정 포함): name={}", name);
        Qualification qualification = qualificationRepository.findByName(name);
        
        if (qualification != null) {
            log.info("✓ 자격증 조회 성공: {} (JMCD: {})", qualification.getName(), qualification.getJMCD());
            
            // JPQL 기반 조회로 컬럼명 대소문자/예약어 이슈를 피한다.
            List<ExamDate> examDates = examDateRepository.findByJmCd(qualification.getJMCD());
            log.info("✓ 시험 일정 조회: {}개 회차", examDates.size());
            
            if (!examDates.isEmpty()) {
                log.info("✓ 조회된 시험 일정:");
                examDates.forEach(ed -> 
                    log.info("  - {}년 {}회: docRegStart={}, pracRegStart={}", 
                        ed.getId().getYear(), ed.getId().getPeriod(),
                        ed.getDocRegStart(), ed.getPracRegStart())
                );
            }
            
            // Qualification의 examDates에 할당 (응답용)
            qualification = new Qualification(
                qualification.getId(),
                qualification.getName(),
                qualification.getCourse(),
                qualification.getJMCD(),
                qualification.getField(),
                examDates
            );
        } else {
            log.warn("⚠️ 자격증 '{}' 을 찾을 수 없습니다", name);
        }
        
        return qualification;
    }

    /**
     * 자격증명으로 검색
     * @param keyword 검색 키워드
     * @return 검색 결과 자격증 리스트
     */
    public List<Qualification> searchQualifications(String keyword) {
        log.info("자격증 검색: keyword={}", keyword);
        return qualificationRepository.searchByKeyword(keyword);
    }

    /**
     * 모든 자격증 조회
     * @return 모든 자격증 리스트
     */
    public List<Qualification> getAllQualifications() {
        log.info("모든 자격증 조회");
        return qualificationRepository.findAll();
    }
}



