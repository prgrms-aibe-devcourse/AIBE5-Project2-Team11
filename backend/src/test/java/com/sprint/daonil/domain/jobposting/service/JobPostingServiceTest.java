package com.sprint.daonil.domain.jobposting.service;

import com.sprint.daonil.domain.company.entity.Company;
import com.sprint.daonil.domain.company.repository.CompanyRepository;
import com.sprint.daonil.domain.jobposting.dto.JobPostingRequestDto;
import com.sprint.daonil.domain.jobposting.dto.JobPostingResponseDto;
import com.sprint.daonil.domain.jobposting.entity.JobPosting;
import com.sprint.daonil.domain.jobposting.repository.JobPostingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class JobPostingServiceTest {

    @Mock
    private JobPostingRepository jobPostingRepository;

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private JobPostingService jobPostingService;

    private Company company;
    private JobPosting jobPosting;
    private final Long companyId = 1L;
    private final Long jobPostingId = 100L;

    @BeforeEach
    void setUp() {
        // 테스트용 기본 엔티티 초기화 (DB 저장 X)
        company = Company.builder()
                .companyId(companyId)
                .companyName("테스트 회사")
                .build();

        jobPosting = JobPosting.builder()
                .jobPostingId(jobPostingId)
                .company(company)
                .title("기존 채용공고")
                .isClosed(false)
                .viewCount(0)
                .build();
    }

    @Test
    @DisplayName("채용공고 목록 조회 - 필터링 및 페이징 확인")
    void getJobPostings() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<JobPosting> mockPage = new PageImpl<>(List.of(jobPosting));

        given(jobPostingRepository.findByFilters(null, null, null, false, pageable))
                .willReturn(mockPage);

        // When
        Page<JobPostingResponseDto> result = jobPostingService.getJobPostings(null, null, null, pageable);

        // Then
        assertThat(result.getContent()).isNotEmpty();
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("기존 채용공고");
    }

    @Test
    @DisplayName("채용공고 상세 조회 - 조회수 증가 검증")
    void getJobPostingDetail() {
        // Given
        given(jobPostingRepository.findById(jobPostingId)).willReturn(Optional.of(jobPosting));

        // When
        JobPostingResponseDto result = jobPostingService.getJobPostingDetail(jobPostingId);

        // Then
        assertThat(result.getTitle()).isEqualTo("기존 채용공고");
        // DB 단 조회수 증가 메서드 호출 여부 검증
        verify(jobPostingRepository).incrementViewCount(jobPostingId);
    }

    @Test
    @DisplayName("채용공고 등록")
    void createJobPosting() {
        // Given
        JobPostingRequestDto requestDto = JobPostingRequestDto.builder()
                .title("신규 채용공고")
                .salary(5000)
                .build();

        given(companyRepository.findById(companyId)).willReturn(Optional.of(company));
        given(jobPostingRepository.save(any(JobPosting.class))).willReturn(requestDto.toEntity(company));

        // When
        JobPostingResponseDto result = jobPostingService.createJobPosting(companyId, requestDto);

        // Then
        assertThat(result.getTitle()).isEqualTo("신규 채용공고");
        assertThat(result.getSalary()).isEqualTo(5000);
        verify(jobPostingRepository).save(any(JobPosting.class));
    }

    @Test
    @DisplayName("채용공고 수정 - 권한 및 데이터 변경 확인")
    void updateJobPosting() {
        // Given
        JobPostingRequestDto requestDto = JobPostingRequestDto.builder()
                .title("수정된 제목")
                .salary(6000)
                .build();

        given(jobPostingRepository.findById(jobPostingId)).willReturn(Optional.of(jobPosting));

        // When
        JobPostingResponseDto result = jobPostingService.updateJobPosting(companyId, jobPostingId, requestDto);

        // Then
        assertThat(result.getTitle()).isEqualTo("수정된 제목");
        assertThat(result.getSalary()).isEqualTo(6000);
        // Dirty Checking 동작 확인 (save 호출 안 됨)
    }

    @Test
    @DisplayName("채용공고 마감 처리")
    void closeJobPosting() {
        // Given
        given(jobPostingRepository.findById(jobPostingId)).willReturn(Optional.of(jobPosting));

        // When
        JobPostingResponseDto result = jobPostingService.closeJobPosting(companyId, jobPostingId);

        // Then
        assertThat(result.getIsClosed()).isTrue();
    }

    @Test
    @DisplayName("권한 없는 기업이 수정 시도 시 예외 발생")
    void updateJobPostingUnauthorized() {
        // Given
        JobPostingRequestDto requestDto = JobPostingRequestDto.builder().title("불법 수정").build();
        Long wrongCompanyId = 9999L;

        given(jobPostingRepository.findById(jobPostingId)).willReturn(Optional.of(jobPosting));

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                jobPostingService.updateJobPosting(wrongCompanyId, jobPostingId, requestDto)
        );
        assertThat(exception.getMessage()).isEqualTo("해당 채용공고에 대한 권한이 없습니다.");
    }

    @Test
    @DisplayName("존재하지 않는 채용공고 조회 시 예외 발생")
    void getJobPostingDetailNotFound() {
        // Given
        Long wrongPostingId = 9999L;
        given(jobPostingRepository.findById(wrongPostingId)).willReturn(Optional.empty());

        // When & Then
        assertThrows(IllegalArgumentException.class, () ->
                jobPostingService.getJobPostingDetail(wrongPostingId)
        );
    }
}