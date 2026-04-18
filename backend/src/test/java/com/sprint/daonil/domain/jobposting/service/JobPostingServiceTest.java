package com.sprint.daonil.domain.jobposting.service;

import com.sprint.daonil.domain.company.entity.Company;
import com.sprint.daonil.domain.company.repository.CompanyRepository;
import com.sprint.daonil.domain.jobposting.dto.JobPostingRequestDto;
import com.sprint.daonil.domain.jobposting.dto.JobPostingResponseDto;
import com.sprint.daonil.domain.jobposting.entity.JobPosting;
import com.sprint.daonil.domain.jobposting.repository.JobPostingRepository;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.enumtype.Role;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class JobPostingServiceTest {

    @Autowired
    private JobPostingService jobPostingService;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private MemberRepository memberRepository;

    private Long companyId;
    private Long jobPostingId;

    @BeforeEach
    void setUp() {
        // 1. 테스트용 멤버 생성
        Member member = Member.builder()
                .loginId("testcompany")
                .password("password123")
                .email("company@test.com")
                .name("테스트 회사")
                .phoneNumber("010-1234-5678")
                .role(Role.COMPANY)
                .isDeleted(false)
                .build();
        memberRepository.save(member);

        // 2. 테스트용 회사 생성
        Company company = Company.builder()
                .member(member)
                .businessNumber("1234567890")
                .companyName("테스트 회사")
                .companyEmail("company@test.com")
                .isDeleted(false)
                .build();
        companyRepository.save(company);
        companyId = company.getCompanyId();

        // 3. 테스트용 채용공고 생성
        JobPosting jobPosting = JobPosting.builder()
                .company(company)
                .title("개발자 모집")
                .jobCategory("IT")
                .employmentType("정규직")
                .workRegion("서울")
                .salary(4000)
                .salaryType("만원")
                .recruitCount(5)
                .qualification("학력 무관")
                .applicationStartDate(LocalDate.now())
                .applicationEndDate(LocalDate.now().plusMonths(1))
                .content("우리 회사에서 개발자를 모집합니다.")
                .workHours("09:00 ~ 18:00")
                .createdAt(LocalDateTime.now())
                .build();

        jobPostingRepository.save(jobPosting);
        jobPostingId = jobPosting.getJobPostingId();
    }

    @Test
    @DisplayName("채용공고 목록 조회 - 필터링 및 페이징 확인")
    void testGetJobPostings() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<JobPostingResponseDto> result = jobPostingService.getJobPostings(null, null, null, pageable);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals("개발자 모집", result.getContent().get(0).getTitle());
    }

    @Test
    @DisplayName("채용공고 상세 조회 - 조회수 증가 검증")
    void testGetJobPostingDetail() {
        // 서비스 내부에서 incrementViewCount가 호출됨을 확인
        JobPostingResponseDto response1 = jobPostingService.getJobPostingDetail(jobPostingId);
        assertEquals(1, response1.getViewCount());

        JobPostingResponseDto response2 = jobPostingService.getJobPostingDetail(jobPostingId);
        assertEquals(2, response2.getViewCount());
    }

    @Test
    @DisplayName("채용공고 등록")
    void testCreateJobPosting() {
        JobPostingRequestDto requestDto = JobPostingRequestDto.builder()
                .title("백엔드 개발자 모집")
                .jobCategory("IT")
                .employmentType("정규직")
                .workRegion("경기도")
                .salary(5000)
                .salaryType("만원")
                .recruitCount(3)
                .qualification("경력 3년 이상")
                .applicationStartDate(LocalDate.now())
                .applicationEndDate(LocalDate.now().plusMonths(1))
                .content("백엔드 개발자를 모집합니다.")
                .workHours("10:00 ~ 19:00")
                .build();

        JobPostingResponseDto response = jobPostingService.createJobPosting(companyId, requestDto);

        assertNotNull(response);
        assertEquals("백엔드 개발자 모집", response.getTitle());
        assertEquals(companyId, response.getCompanyId());
    }

    @Test
    @DisplayName("채용공고 수정 - 권한 및 데이터 변경 확인")
    void testUpdateJobPosting() {
        JobPostingRequestDto requestDto = JobPostingRequestDto.builder()
                .title("수정된 제목")
                .jobCategory("IT")
                .employmentType("계약직")
                .workRegion("부산")
                .salary(4500)
                .salaryType("만원")
                .recruitCount(2)
                .qualification("경력 무관")
                .applicationStartDate(LocalDate.now())
                .applicationEndDate(LocalDate.now().plusMonths(2))
                .content("수정된 내용")
                .workHours("09:30 ~ 18:30")
                .build();

        // 서비스 코드 순서에 맞춰 (companyId, jobPostingId, requestDto) 순으로 호출
        JobPostingResponseDto response = jobPostingService.updateJobPosting(companyId, jobPostingId, requestDto);

        assertNotNull(response);
        assertEquals("수정된 제목", response.getTitle());
        assertEquals("부산", response.getWorkRegion());
    }

    @Test
    @DisplayName("채용공고 마감 처리")
    void testCloseJobPosting() {
        JobPostingResponseDto response = jobPostingService.closeJobPosting(companyId, jobPostingId);

        assertTrue(response.getIsClosed());

        // 영속성 컨텍스트 초기화 후 DB 값 재조회 확인 (Dirty Checking 검증)
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId).orElseThrow();
        assertTrue(jobPosting.getIsClosed());
    }

    @Test
    @DisplayName("권한 없는 기업이 수정 시도 시 예외 발생")
    void testUpdateJobPostingUnauthorized() {
        JobPostingRequestDto requestDto = JobPostingRequestDto.builder().title("불법 수정").build();
        Long wrongCompanyId = 9999L;

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> jobPostingService.updateJobPosting(wrongCompanyId, jobPostingId, requestDto)
        );
        assertEquals("해당 채용공고에 대한 권한이 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("존재하지 않는 채용공고 조회 시 예외 발생")
    void testGetJobPostingDetailNotFound() {
        assertThrows(IllegalArgumentException.class,
                () -> jobPostingService.getJobPostingDetail(0L));
    }
}