package com.sprint.daonil.domain.member.controller;

import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class MemberController {

    private final MemberRepository memberRepository;

    @GetMapping("/members")
    public List<Member> getMembers() {
        return memberRepository.findAll();
    }
}