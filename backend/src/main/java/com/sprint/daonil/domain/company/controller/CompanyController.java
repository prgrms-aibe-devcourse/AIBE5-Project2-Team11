package com.sprint.daonil.domain.company.controller;

import com.sprint.daonil.domain.company.dto.CompanyInfoResponseDto;
import com.sprint.daonil.domain.company.dto.CompanyUpdateRequestDto;
import com.sprint.daonil.domain.company.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members/me/company")
public class CompanyController {

    private final CompanyService companyService;

    // 기업 정보 조회
    @GetMapping
    public ResponseEntity<CompanyInfoResponseDto> getMyCompany(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        CompanyInfoResponseDto result = companyService.getMyCompany(userDetails.getUsername());

        return ResponseEntity.ok(result);
    }

    // 기업 정보 수정
    @PatchMapping
    public ResponseEntity<Map<String, Object>> updateMyCompany(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CompanyUpdateRequestDto request) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        Long updatedCompanyId = companyService.updateMyCompany(userDetails.getUsername(), request);

        return ResponseEntity.ok(Map.of("message", "기업 회원 정보 수정 완료", "companyId", updatedCompanyId ));
    }
}