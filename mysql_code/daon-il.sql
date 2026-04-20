CREATE DATABASE IF NOT EXISTS daonil
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

USE daonil;

SELECT * FROM member;
SELECT * FROM company;

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