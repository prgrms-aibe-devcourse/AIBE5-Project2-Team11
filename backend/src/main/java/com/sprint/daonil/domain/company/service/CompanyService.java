package com.sprint.daonil.domain.company.service;

import com.sprint.daonil.domain.company.dto.CompanyInfoResponseDto;
import com.sprint.daonil.domain.company.dto.CompanyUpdateRequestDto;
import com.sprint.daonil.domain.company.entity.Company;
import com.sprint.daonil.domain.company.entity.IndustryType;
import com.sprint.daonil.domain.company.repository.CompanyRepository;
import com.sprint.daonil.domain.company.repository.DetailIndustryTypeRepository;
import com.sprint.daonil.domain.company.repository.IndustryTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;


@Service
@RequiredArgsConstructor
@Transactional
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final IndustryTypeRepository industryTypeRepository;
    private final DetailIndustryTypeRepository detailIndustryTypeRepository;

    // 기업 정보 조회
    @Transactional(readOnly = true)
    public CompanyInfoResponseDto getMyCompany(String loginId) {
        // 로그인한 회원의 기업 정보 조회
        Company company = companyRepository.findByMember_LoginId(loginId)
                .orElseThrow(() -> new ResponseStatusException( HttpStatus.NOT_FOUND, "존재하지 않는 기업 회원입니다."));

        // 업종(대분류) 조회
        String industryName = null;
        if (company.getIndustryTypeId() != null) {
            industryName = industryTypeRepository
                    .findById(company.getIndustryTypeId())
                    .map(industry -> industry.getIndustryName())
                    .orElse(null);
        }
        // 상세 업종 조회
        String detailIndustryName = null;
        if (company.getDetailIndustryTypeId() != null) {
            detailIndustryName = detailIndustryTypeRepository
                    .findById(company.getDetailIndustryTypeId())
                    .map(detial -> detial.getDetailIndustryName())
                    .orElse(null);
        }

        return CompanyInfoResponseDto.fromEntity(company, industryName, detailIndustryName);
    }



    @Transactional
    public Long updateMyCompany(String loginId, CompanyUpdateRequestDto dto) {
        if (dto.getCompanyName() == null &&
                dto.getCompanyEmail() == null &&
                dto.getAddress() == null &&
                dto.getCompanyDescription() == null &&
                dto.getIndustryTypeId() == null &&
                dto.getDetailIndustryTypeId() == null
        ) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정할 데이터가 없습니다."); }

        // 로그인한 회원의 기업 정보 조회
        Company company = companyRepository.findByMember_LoginId(loginId)
                .orElseThrow(() -> new ResponseStatusException( HttpStatus.NOT_FOUND, "존재하지 않는 기업 회원입니다."));

        // 회사 정보 업데이트
        if (dto.getCompanyName() != null) { // 회사명
            company.setCompanyName(dto.getCompanyName());
        }
        if (dto.getCompanyEmail() != null) { // 이메일
            company.setCompanyEmail(dto.getCompanyEmail());
        }
        if (dto.getAddress() != null) { // 주소
            company.setAddress(dto.getAddress());
        }
        if (dto.getCompanyDescription() != null) { // 기업 소개
            company.setCompanyDescription(dto.getCompanyDescription());
        }
        if (dto.getIndustryTypeId() != null) { // 업종
            company.setIndustryTypeId(dto.getIndustryTypeId());
        }
        if (dto.getDetailIndustryTypeId() != null) { // 상세 업종
            company.setDetailIndustryTypeId(dto.getDetailIndustryTypeId());
        }

        // updatedAt 갱신
        company.setUpdatedAt(java.time.LocalDateTime.now());

        return company.getCompanyId();
    }
}
