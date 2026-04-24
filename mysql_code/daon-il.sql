CREATE DATABASE IF NOT EXISTS daonil
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

USE daonil;

CREATE TABLE member (
    member_id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    login_id VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(30) NOT NULL,
    phone_number VARCHAR(30) NULL,
    address VARCHAR(255) NULL,
    role ENUM('JOB_SEEKER', 'COMPANY', 'ADMIN') NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (member_id)
) ENGINE=InnoDB;

CREATE TABLE disability (
    disability_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    PRIMARY KEY (disability_id)
) ENGINE=InnoDB;

CREATE TABLE notice (
    notice_id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(150) NULL,
    content TEXT NULL,
    PRIMARY KEY (notice_id)
) ENGINE=InnoDB;

CREATE TABLE keyword_master (
    keyword_id BIGINT NOT NULL AUTO_INCREMENT,
    keyword_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (keyword_id)
) ENGINE=InnoDB;

CREATE TABLE certificate (
    certificate_id BIGINT NOT NULL AUTO_INCREMENT,
    certificate_name VARCHAR(150) NOT NULL,
    issuing_organization VARCHAR(150) NULL,
    description VARCHAR(255) NULL,
    PRIMARY KEY (certificate_id)
) ENGINE=InnoDB;


CREATE TABLE industry_type (
    industry_type_id BIGINT NOT NULL AUTO_INCREMENT,
    industry_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (industry_type_id)
) ENGINE=InnoDB;

CREATE TABLE recruitment_step_category (
    recruitment_step_category_id BIGINT NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (recruitment_step_category_id)
) ENGINE=InnoDB;

CREATE TABLE detail_industry_type (
    detail_industry_type_id BIGINT NOT NULL AUTO_INCREMENT,
    industry_type_id BIGINT NOT NULL,
    detail_industry_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (detail_industry_type_id),
    CONSTRAINT FK_detail_industry_type_industry_type
        FOREIGN KEY (industry_type_id) REFERENCES industry_type (industry_type_id)
) ENGINE=InnoDB;

CREATE TABLE industry_keyword (
    industry_keyword_id BIGINT NOT NULL AUTO_INCREMENT,
    industry_type_id BIGINT NOT NULL,
    keyword_id BIGINT NOT NULL,
    PRIMARY KEY (industry_keyword_id),
    CONSTRAINT FK_industry_keyword_industry_type
        FOREIGN KEY (industry_type_id) REFERENCES industry_type (industry_type_id),
    CONSTRAINT FK_industry_keyword_keyword_master
        FOREIGN KEY (keyword_id) REFERENCES keyword_master (keyword_id)
) ENGINE=InnoDB;

CREATE TABLE post (
    post_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255) NULL,
    attachment_url VARCHAR(255) NULL,
    view_count INT NOT NULL DEFAULT 0,
    like_count INT NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    category VARCHAR(255) NULL,
    PRIMARY KEY (post_id),
    CONSTRAINT FK_post_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
) ENGINE=InnoDB;

CREATE TABLE report (
    report_id BIGINT NOT NULL AUTO_INCREMENT,
    reporter_member_id BIGINT NOT NULL,
    target_type ENUM('POST', 'COMMENT', 'MEMBER', 'JOB_POSTING') NOT NULL,
    target_id BIGINT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (report_id),
    CONSTRAINT FK_report_member
        FOREIGN KEY (reporter_member_id) REFERENCES member (member_id)
) ENGINE=InnoDB;

CREATE TABLE profile (
    profile_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    birth_date DATE NULL,
    preferred_job VARCHAR(100) NULL,
    preferred_region VARCHAR(100) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    env_both_hands VARCHAR(50) NULL,
    env_eyesight VARCHAR(50) NULL,   
    env_hand_work VARCHAR(50) NULL,    
    env_lift_power VARCHAR(50) NULL,
    env_lstn_talk VARCHAR(50) NULL,   
    env_stnd_walk VARCHAR(50) NULL,   
    PRIMARY KEY (profile_id),
    CONSTRAINT FK_profile_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
) ENGINE=InnoDB;

CREATE TABLE resume (
    resume_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    user_photo VARCHAR(255) NULL,
    portfolio_url VARCHAR(255) NULL,
    self_introduction TEXT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (resume_id),
    CONSTRAINT FK_resume_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
) ENGINE=InnoDB;

CREATE TABLE resume_career (
    career_id BIGINT NOT NULL AUTO_INCREMENT,
    resume_id BIGINT NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    position VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    content TEXT NULL,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (career_id),
    CONSTRAINT FK_resume_career_resume
        FOREIGN KEY (resume_id) REFERENCES resume (resume_id)
) ENGINE=InnoDB;

CREATE TABLE resume_education (
    education_id BIGINT NOT NULL AUTO_INCREMENT,
    resume_id BIGINT NOT NULL,
    school_name VARCHAR(150) NOT NULL,
    major VARCHAR(100) NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    degree VARCHAR(100) NULL,
    PRIMARY KEY (education_id),
    CONSTRAINT FK_resume_education_resume
        FOREIGN KEY (resume_id) REFERENCES resume (resume_id)
) ENGINE=InnoDB;

CREATE TABLE resume_skill (
    skill_id BIGINT NOT NULL AUTO_INCREMENT,
    resume_id BIGINT NOT NULL,
    skill_keyword VARCHAR(100) NOT NULL,
    PRIMARY KEY (skill_id),
    CONSTRAINT FK_resume_skill_resume
        FOREIGN KEY (resume_id) REFERENCES resume (resume_id)
) ENGINE=InnoDB;

CREATE TABLE resume_certificate (
    resume_certificate_id BIGINT NOT NULL AUTO_INCREMENT,
    resume_id BIGINT NOT NULL,
    certificate_id BIGINT NOT NULL,
    acquired_date DATE NOT NULL,
    PRIMARY KEY (resume_certificate_id),
    CONSTRAINT FK_resume_certificate_resume
        FOREIGN KEY (resume_id) REFERENCES resume (resume_id),
    CONSTRAINT FK_resume_certificate_certificate
        FOREIGN KEY (certificate_id) REFERENCES certificate (certificate_id)
) ENGINE=InnoDB;

CREATE TABLE resume_lang_qualification (
    resume_lang_qualification_id BIGINT NOT NULL AUTO_INCREMENT,
    resume_id BIGINT NOT NULL,
    language_name VARCHAR(50) NOT NULL,
    test_name VARCHAR(100) NULL,
    score VARCHAR(50) NULL,
    acquired_date DATE NULL,
    expiration_date DATE NULL,
    PRIMARY KEY (resume_lang_qualification_id),
    CONSTRAINT FK_resume_lang_qualification_resume
        FOREIGN KEY (resume_id) REFERENCES resume (resume_id)
) ENGINE=InnoDB;

CREATE TABLE resume_disability (
    resume_disability_id BIGINT NOT NULL AUTO_INCREMENT,
    resume_id BIGINT NOT NULL,
    disability_id BIGINT NOT NULL,
    description VARCHAR(255) NULL,
    PRIMARY KEY (resume_disability_id),
    CONSTRAINT FK_resume_disability_resume
        FOREIGN KEY (resume_id) REFERENCES resume (resume_id),
    CONSTRAINT FK_resume_disability_disability
        FOREIGN KEY (disability_id) REFERENCES disability (disability_id)
) ENGINE=InnoDB;

select * from member;

CREATE TABLE alarm (
    alarm_id BIGINT NOT NULL AUTO_INCREMENT,
    receiver_id BIGINT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (alarm_id),
    CONSTRAINT FK_alarm_member
        FOREIGN KEY (receiver_id) REFERENCES member (member_id)
) ENGINE=InnoDB;

CREATE TABLE company (
    company_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    business_number VARCHAR(30) NOT NULL,
    industry_type_id BIGINT NULL,
    detail_industry_type_id BIGINT NULL,
    address VARCHAR(255) NULL,
    company_name VARCHAR(30) NULL,
    company_email VARCHAR(100) NULL,
    company_description TEXT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (company_id),
    CONSTRAINT FK_company_member
        FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT FK_company_industry_type
        FOREIGN KEY (industry_type_id) REFERENCES industry_type (industry_type_id),
    CONSTRAINT FK_company_detail_industry_type
        FOREIGN KEY (detail_industry_type_id) REFERENCES detail_industry_type (detail_industry_type_id)
) ENGINE=InnoDB;

CREATE TABLE profile_certificate (
    profile_certificate_id BIGINT NOT NULL AUTO_INCREMENT,
    profile_id BIGINT NOT NULL,
    certificate_id BIGINT NOT NULL,
    acquired_date DATE NULL,
    score_or_grade VARCHAR(50) NULL,
    status VARCHAR(50) NULL,
    PRIMARY KEY (profile_certificate_id),
    CONSTRAINT FK_profile_certificate_profile
        FOREIGN KEY (profile_id) REFERENCES profile (profile_id),
    CONSTRAINT FK_profile_certificate_certificate
        FOREIGN KEY (certificate_id) REFERENCES certificate (certificate_id)
) ENGINE=InnoDB;

CREATE TABLE field (
    id VARCHAR(50) NOT NULL,
    depth1 VARCHAR(255),
    depth2 VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE profile_lang_qualification (
    profile_lang_qualification_id BIGINT NOT NULL AUTO_INCREMENT,
    profile_id BIGINT NOT NULL,
    language_name VARCHAR(50) NULL,
    test_name VARCHAR(100) NULL,
    score VARCHAR(50) NULL,
    acquired_date DATE NULL,
    expiration_date DATE NULL,
    PRIMARY KEY (profile_lang_qualification_id),
    CONSTRAINT FK_profile_lang_qualification_profile
        FOREIGN KEY (profile_id) REFERENCES profile (profile_id)
) ENGINE=InnoDB;

CREATE TABLE profile_disability (
    profile_disability_id BIGINT NOT NULL AUTO_INCREMENT,
    profile_id BIGINT NOT NULL,
    disability_id BIGINT NOT NULL,
    severity VARCHAR(50) NULL,
    note VARCHAR(255) NULL,
    PRIMARY KEY (profile_disability_id),
    CONSTRAINT FK_profile_disability_profile
        FOREIGN KEY (profile_id) REFERENCES profile (profile_id),
    CONSTRAINT FK_profile_disability_disability
        FOREIGN KEY (disability_id) REFERENCES disability (disability_id)
) ENGINE=InnoDB;


CREATE TABLE job_posting (
    job_posting_id BIGINT NOT NULL AUTO_INCREMENT,
    company_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    job_category VARCHAR(100) NULL,
    employment_type VARCHAR(50) NULL,
    work_region VARCHAR(100) NULL,
    salary INT NULL,
    salary_type VARCHAR(50) NULL,
    recruit_count INT NULL,
    qualification TEXT NULL,
    application_start_date DATE NULL,
    application_end_date DATE NULL,
    is_closed BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    content VARCHAR(225) NULL,
    work_hours VARCHAR(100) NULL,
    env_both_hands VARCHAR(50) NULL,
    env_eyesight VARCHAR(50) NULL,   
    env_hand_work VARCHAR(50) NULL,    
    env_lift_power VARCHAR(50) NULL,
    env_lstn_talk VARCHAR(50) NULL,   
    env_stnd_walk VARCHAR(50) NULL,   
    PRIMARY KEY (job_posting_id),
    CONSTRAINT FK_job_posting_company
        FOREIGN KEY (company_id) REFERENCES company (company_id)
) ENGINE=InnoDB;

CREATE TABLE bookmark (
    bookmark_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    job_posting_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bookmark_id),
    CONSTRAINT FK_bookmark_member
        FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT FK_bookmark_job_posting
        FOREIGN KEY (job_posting_id) REFERENCES job_posting (job_posting_id)
) ENGINE=InnoDB;

CREATE TABLE recruitment_step (
    recruitment_step_id BIGINT NOT NULL AUTO_INCREMENT,
    job_posting_id BIGINT NOT NULL,
    recruitment_step_category_id BIGINT NOT NULL,
    step_order INT NOT NULL,
    step_name VARCHAR(100) NULL,
    description VARCHAR(255) NULL,
    step_start_date DATE NULL,
    step_end_date DATE NULL,
    PRIMARY KEY (recruitment_step_id),
    CONSTRAINT FK_recruitment_step_job_posting
        FOREIGN KEY (job_posting_id) REFERENCES job_posting (job_posting_id),
    CONSTRAINT FK_recruitment_step_category
        FOREIGN KEY (recruitment_step_category_id) REFERENCES recruitment_step_category (recruitment_step_category_id)
) ENGINE=InnoDB;

CREATE TABLE application (
    application_id BIGINT NOT NULL AUTO_INCREMENT,
    job_posting_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    resume_id BIGINT NOT NULL,
    status ENUM('SUBMITTED', 'DOCUMENT_PASSED', 'DOCUMENT_FAILED', 'INTERVIEW_PASSED', 'INTERVIEW_FAILED', 'FINAL_ACCEPTED', 'FINAL_REJECTED') NOT NULL DEFAULT 'SUBMITTED',
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (application_id),
    CONSTRAINT FK_application_job_posting
        FOREIGN KEY (job_posting_id) REFERENCES job_posting (job_posting_id),
    CONSTRAINT FK_application_member
        FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT FK_application_resume
        FOREIGN KEY (resume_id) REFERENCES resume (resume_id)
) ENGINE=InnoDB;

CREATE TABLE post_comment (
    comment_id BIGINT NOT NULL AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id),
    CONSTRAINT FK_post_comment_post
        FOREIGN KEY (post_id) REFERENCES post (post_id),
    CONSTRAINT FK_post_comment_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
) ENGINE=InnoDB;

CREATE TABLE post_like (
    post_like_id BIGINT NOT NULL AUTO_INCREMENT,
    post_id BIGINT NULL,
    comment_id BIGINT NULL,
    member_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_like_id),
    CONSTRAINT FK_post_like_post
        FOREIGN KEY (post_id) REFERENCES post (post_id),
    CONSTRAINT FK_post_like_comment
        FOREIGN KEY (comment_id) REFERENCES post_comment (comment_id),
    CONSTRAINT FK_post_like_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
) ENGINE=InnoDB;

/////////여기부터 실행

CREATE TABLE field (
    id VARCHAR(50) NOT NULL,
    depth1 VARCHAR(255),
    depth2 VARCHAR(255),
    PRIMARY KEY (id)
);
select * from member;
CREATE TABLE qualification (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    fieldId VARCHAR(50),
    course TEXT,
    JMCD VARCHAR(20) UNIQUE,

    PRIMARY KEY (id),

    CONSTRAINT FK_qualification_field
        FOREIGN KEY (fieldId) REFERENCES field(id)
);

CREATE TABLE `date` (
    jmCd VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    period INT NOT NULL,

    docRegStart DATETIME NULL,
    docRegEnd DATETIME NULL,
    docVacancyStart DATETIME NULL,
    docVacancyEnd DATETIME NULL,
    docExamStart DATETIME NULL,
    docExamEnd DATETIME NULL,
    docPass DATETIME NULL,

    pracRegStart DATETIME NULL,
    pracRegEnd DATETIME NULL,
    pracVacancyStart DATETIME NULL,
    pracVacancyEnd DATETIME NULL,
    pracExamStart DATETIME NULL,
    pracExamEnd DATETIME NULL,
    pracPass DATETIME NULL,

    PRIMARY KEY (jmCd, year, period),

    CONSTRAINT FK_date_qualification
        FOREIGN KEY (jmCd) REFERENCES qualification(JMCD)
);


ALTER TABLE profile_certificate
DROP FOREIGN KEY FK_profile_certificate_certificate;

ALTER TABLE profile_certificate
CHANGE certificate_id field_id VARCHAR(50) NOT NULL;

ALTER TABLE profile_certificate
ADD CONSTRAINT FK_profile_certificate_field
FOREIGN KEY (field_id) REFERENCES field (id);

ALTER TABLE profile
    ADD COLUMN career VARCHAR(100) NULL,
ADD COLUMN introduction TEXT NULL,
ADD COLUMN desired_salary VARCHAR(100) NULL;

ALTER TABLE profile_certificate
MODIFY COLUMN field_id VARCHAR(50) NULL;

select * from member;
select * from field;
select * from qualification;
select * from profile_lang_qualification;
select * from profile_disability;
select * from disability;
select * from profile_certificate;
select * from date;
select * from company;
select * from job_posting;
INSERT INTO disability (name, description) VALUES
('지체장애', '절단, 관절, 근육 등의 손상으로 이동이나 신체 활동에 제약이 있는 장애'),
('시각장애', '시력 저하 또는 실명으로 인해 시각적 정보 인식에 어려움이 있는 장애'),
('청각장애', '청력 손실로 인해 소리를 듣는 데 어려움이 있는 장애'),
('언어장애', '발음, 발성, 언어 이해 및 표현에 어려움이 있는 장애'),
('지적장애', '지적 기능과 적응 행동에 제한이 있는 장애');

CREATE TABLE IF NOT EXISTS job_embedding (
    job_embedding_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '임베딩 ID',
    job_id BIGINT NOT NULL UNIQUE COMMENT '공고 ID (job_posting.job_posting_id 참조)',
    embedding JSON NOT NULL COMMENT '임베딩 벡터 (1536개 숫자를 JSON으로 저장)',
    embedding_dimension INT DEFAULT 1536 COMMENT '임베딩 차원 수',
    job_title VARCHAR(150) COMMENT '공고 제목 (검색용)',
    job_content TEXT COMMENT '공고 내용 (검색용)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '수정 시간',

    INDEX idx_job_id (job_id) COMMENT '공고 조회 인덱스',
    FOREIGN KEY (job_id) REFERENCES job_posting(job_posting_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='채용공고 임베딩 저장소';


-- OAuth2/소셜 로그인 지원을 위한 social_account 테이블
CREATE TABLE IF NOT EXISTS social_account (
    social_account_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    provider VARCHAR(20) NOT NULL COMMENT 'GOOGLE, NAVER',
    provider_user_id VARCHAR(100) NOT NULL COMMENT '소셜 제공자의 사용자 고유 식별자',
    email VARCHAR(255) NULL,
    name VARCHAR(100) NULL,
    profile_image_url VARCHAR(500) NULL,
    linked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (social_account_id),
    UNIQUE KEY uk_provider_user (provider, provider_user_id),
    CONSTRAINT fk_social_account_member
        FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='소셜 로그인 계정 연결 정보';

-- member 테이블의 password 컬럼을 NULL 허용으로 변경 (소셜 로그인 계정을 위해)
ALTER TABLE member MODIFY password VARCHAR(255) NULL;

ALTER TABLE member 
MODIFY role ENUM(
  'PENDING',
  'JOB_SEEKER',
  'COMPANY',
  'ADMIN'
) NOT NULL;

-- Bookmark DB 구조 변경 26.04.22
    -- 1. 기존에 설정되어 있던 외래키(제약조건)를 먼저 삭제합니다.
    -- (CASCADE 옵션을 넣어서 새로 만들기 위해 기존 것을 삭제)
ALTER TABLE bookmark DROP FOREIGN KEY FK_bookmark_member;
ALTER TABLE bookmark DROP FOREIGN KEY FK_bookmark_job_posting;

    -- 2. 필요한 인덱스와 CASCADE 옵션이 적용된 외래키를 한 번에 추가합니다.
ALTER TABLE bookmark
        -- 중복 북마크 방지 및 회원 기준 조회를 위한 복합 유니크 인덱스
    ADD UNIQUE INDEX uk_member_job (member_id, job_posting_id),
        -- 특정 공고 기준 조회를 위한 단일 인덱스
    ADD INDEX idx_job_posting (job_posting_id),
        -- 회원이 탈퇴하면 북마크도 자동 삭제되도록 설정
    ADD CONSTRAINT FK_bookmark_member 
        FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
        -- 공고가 삭제되면 북마크도 자동 삭제되도록 설정
    ADD CONSTRAINT FK_bookmark_job_posting 
        FOREIGN KEY (job_posting_id) REFERENCES job_posting (job_posting_id) ON DELETE CASCADE;

select * from industry_type;
select * from detail_industry_type;

use daonil;
-- JobPosting 테이블 컬럼 수정 (대/소분류) 26.04.23
    -- 1. 기존 job_category 컬럼의 이름을 소분류를 의미하는 직관적인 이름으로 변경 (선택 사항)
ALTER TABLE job_posting CHANGE job_category sub_category varchar(100);


    -- 2. 대분류를 저장할 새로운 컬럼 추가
    -- 기존 컬럼(예: sub_category) 앞에 위치하도록 지정하여 구조를 깔끔하게 유지합니다.
ALTER TABLE job_posting ADD COLUMN main_category varchar(100) AFTER title;

    -- 3. 안전 업데이트 모드 해제 (전체 업데이트 허용)
SET SQL_SAFE_UPDATES = 0;

    -- 4. 기존 소분류(sub_category)를 기준으로 대분류(main_category) 일괄 업데이트
UPDATE job_posting
SET main_category = CASE 
        /* 1. 관리자 (1개) */
    WHEN sub_category IN ('관리직(임원·부서장)') 
        THEN '관리자'
        /* 2. 사무 종사자 (1개) */
    WHEN sub_category IN ('경영·행정·사무직') 
        THEN '사무 종사자'
        /* 3. 서비스 종사자 (7개) */
    WHEN sub_category IN (
        '돌봄 서비스직(간병·육아)', '미용·예식 서비스직', '스포츠·레크리에이션직', 
        '여행·숙박·오락 서비스직', '음식 서비스직', '경호·경비직', '청소 및 기타 개인서비스직'
    ) THEN '서비스 종사자'
        /* 4. 판매 종사자 (1개) */
    WHEN sub_category IN ('영업·판매직') 
        THEN '판매 종사자'
        /* 5. 전문가 및 관련 종사자 (11개) */
    WHEN sub_category IN (
        '정보통신 연구개발직 및 공학기술직', '제조 연구개발직 및 공학기술직', 
        '건설·채굴 연구개발직 및 공학기술직', '자연·생명과학 연구직', '인문·사회과학 연구직', 
        '법률직', '사회복지·종교직', '교육직', '금융·보험직', '보건·의료직', '예술·디자인·방송직'
    ) THEN '전문가 및 관련 종사자'
        /* 6. 기능원 및 관련 기능 종사자 (7개) */
    WHEN sub_category IN (
        '건설·채굴직', '기계 설치·정비·생산직', '금속·재료 설치·정비·생산직(판금·단조·주조·용접·도장 등)', 
        '전기·전자 설치·정비·생산직', '정보통신 설치·정비직', '화학·환경 설치·정비·생산직', 
        '인쇄·목재·공예 및 기타 설치·정비·생산직'
    ) THEN '기능원 및 관련 기능 종사자'
        /* 7. 장치·기계조작 및 조립 종사자 (3개) */
    WHEN sub_category IN ('식품 가공·생산직', '섬유·의복 생산직', '운전·운송직') 
        THEN '장치·기계조작 및 조립 종사자'
        /* 8. 농림어업 숙련 종사자 (1개) */
    WHEN sub_category IN ('농림어업직') 
        THEN '농림어업 숙련 종사자'
        /* 9. 단순노무 종사자 (1개) */
    WHEN sub_category IN ('제조 단순직') 
        THEN '단순노무 종사자'
        /* 예외 처리 (혹시 모를 빈 값 방지) */
    ELSE main_category 
END;

    -- 3. 안전 업데이트 모드 원상복구
SET SQL_SAFE_UPDATES = 1;

select * from post;

-- post_like 테이블 DB 구조 변경 26.04.23
ALTER TABLE post_like ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;


