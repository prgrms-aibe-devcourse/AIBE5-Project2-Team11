package com.sprint.daonil.domain.qualification.service;

import com.sprint.daonil.domain.qualification.dto.ExamScheduleDto;
import com.sprint.daonil.domain.qualification.dto.QualificationResponseDto;
import com.sprint.daonil.domain.qualification.entity.ExamDate;
import com.sprint.daonil.domain.qualification.entity.Qualification;
import com.sprint.daonil.domain.qualification.repository.ExamDateRepository;
import com.sprint.daonil.domain.qualification.repository.QualificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class QualificationService {

    private final QualificationRepository qualificationRepository;
    private final ExamDateRepository examDateRepository;

    /**
     * 직무분야(fieldId)로 자격증 조회
     */
    public List<QualificationResponseDto> getQualificationsByField(String fieldId) {
        List<Qualification> qualifications = qualificationRepository.findByFieldId(fieldId);

        return qualifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 직무 카테고리로 자격증 조회
     * field 테이블의 depth2와 일치하는 필드를 찾고
     * 그 필드 id를 가진 자격증들을 반환
     */
    public List<QualificationResponseDto> getQualificationsByCategory(String category) {
        log.info("========== 자격증 검색 시작 ==========");
        log.info("입력받은 카테고리: '{}'", category);

        // 1단계: 입력받은 category와 일치하는 field 찾기
        List<Object[]> fieldResults = qualificationRepository.findFieldsByDepth2(category);
        log.info("Step 1 - field 테이블에서 depth2='{}' 검색 결과: {} 개", category, fieldResults.size());

        List<Qualification> qualifications = null;

        if (!fieldResults.isEmpty()) {
            // field 테이블에 매칭되는 데이터가 있는 경우
            fieldResults.forEach(result ->
                log.info("  found field - id: {}, depth1: {}, depth2: {}",
                    result[0], result[1], result[2])
            );

            // 2단계: 해당 fieldId를 가진 qualification 조회
            qualifications = qualificationRepository.findByFieldDepth2(category);

            log.info("Step 2 - qualification 테이블 조회 결과: {} 개", qualifications.size());
            if (!qualifications.isEmpty()) {
                qualifications.forEach(q ->
                    log.info("  - 자격증명: {}, fieldId: {}, JMCD: {}",
                        q.getName(), q.getFieldId(), q.getJmcd())
                );
            } else {
                log.warn("⚠️ field는 있지만 qualification이 없습니다. fieldId 매칭 문제 가능");
            }
        } else {
            // field 테이블에 매칭되는 데이터가 없는 경우, Fallback 사용
            log.warn("⚠️ field 테이블에서 depth2='{}' 인 데이터가 없습니다!", category);
            log.info("Fallback: fieldId 또는 name으로 검색 시도...");

            qualifications = qualificationRepository.findByFieldIdOrNameContaining(category);
            log.info("Fallback 결과: {} 개", qualifications.size());

            if (!qualifications.isEmpty()) {
                qualifications.forEach(q ->
                    log.info("  [Fallback] 자격증명: {}, fieldId: {}, JMCD: {}",
                        q.getName(), q.getFieldId(), q.getJmcd())
                );
            }
        }

        if (qualifications == null || qualifications.isEmpty()) {
            log.error("❌ 최종 결과: 자격증을 찾을 수 없습니다");
            log.info("디버깅: 전체 qualification 데이터 확인");
            List<Qualification> allQuals = qualificationRepository.findAll();
            log.info("qualification 테이블 총 데이터 수: {}", allQuals.size());
        } else {
            log.info("✅ 최종 결과: {} 개 자격증 조회됨", qualifications.size());
        }
        
        log.info("========== 자격증 검색 종료 ==========");
        
        return qualifications == null ? List.of() : qualifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 모든 자격증 조회
     */
    public List<QualificationResponseDto> getAllQualifications() {
        List<Qualification> qualifications = qualificationRepository.findAll();

        return qualifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 특정 자격증의 시험일정 조회
     */
    public List<ExamScheduleDto> getExamSchedules(String jmcd) {
        List<ExamDate> examDates = examDateRepository.findByIdJmcd(jmcd);

        return examDates.stream()
                .map(this::convertExamDateToDto)
                .collect(Collectors.toList());
    }

    /**
     * Qualification 엔티티를 DTO로 변환
     */
    private QualificationResponseDto convertToDto(Qualification qualification) {
        // 현재 연도의 최신 시험일정 조회
        List<ExamDate> currentExams = examDateRepository.findByIdJmcdAndIdYear(
                qualification.getJmcd(),
                LocalDateTime.now().getYear()
        );

        ExamScheduleDto currentExam = null;
        if (!currentExams.isEmpty()) {
            currentExam = convertExamDateToDto(currentExams.get(0));
        }

        return QualificationResponseDto.builder()
                .id(qualification.getId())
                .name(qualification.getName())
                .fieldId(qualification.getFieldId())
                .course(qualification.getCourse())
                .jmcd(qualification.getJmcd())
                .currentExam(currentExam)
                .build();
    }

    /**
     * ExamDate 엔티티를 DTO로 변환
     */
    private ExamScheduleDto convertExamDateToDto(ExamDate examDate) {
        return ExamScheduleDto.builder()
                .jmcd(examDate.getId().getJmcd())
                .year(examDate.getId().getYear())
                .period(examDate.getId().getPeriod())
                .docRegStart(examDate.getDocRegStart())
                .docRegEnd(examDate.getDocRegEnd())
                .docExamStart(examDate.getDocExamStart())
                .docExamEnd(examDate.getDocExamEnd())
                .docPass(examDate.getDocPass())
                .pracRegStart(examDate.getPracRegStart())
                .pracRegEnd(examDate.getPracRegEnd())
                .pracExamStart(examDate.getPracExamStart())
                .pracExamEnd(examDate.getPracExamEnd())
                .pracPass(examDate.getPracPass())
                .build();
    }
}


