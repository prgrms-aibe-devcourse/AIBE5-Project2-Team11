package com.sprint.daonil.domain.report.service;

import com.sprint.daonil.domain.alarm.service.AlarmService;
import com.sprint.daonil.domain.community.entity.Post;
import com.sprint.daonil.domain.community.entity.PostComment;
import com.sprint.daonil.domain.community.repository.CommentRepository;
import com.sprint.daonil.domain.community.repository.PostRepository;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import com.sprint.daonil.domain.report.entity.Report;
import com.sprint.daonil.domain.report.enumtype.TargetType;
import com.sprint.daonil.domain.report.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.xml.stream.events.Comment;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportService {
    private final AlarmService alarmService;

    private final ReportRepository reportRepository;
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;


    // 게시글 신고
    @Transactional
    public Long reportPost(String loginId, Long postId, String reason) {
        // 회원 조회
        Member member = memberRepository.findByLoginId(loginId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));
        Long memberId = member.getMemberId();

        // 게시글 조회
        Post post =  postRepository.findById(postId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 게시글입니다."));


        // 신고 생성
        Report report = new Report();

        report.setReporterMemberId(memberId);
        report.setTargetType(TargetType.POST);
        report.setTargetId(postId);
        report.setReason(reason);

        // 저장
        reportRepository.save(report);

        // 알림
        alarmService.createAlarm( // To: 게시글 작성자
                post.getMember().getMemberId(),
                "회원님의 게시글이 다른 사용자에 의해 신고되었습니다. [" + post.getTitle() + "]"
        );
        alarmService.createAlarm( // To: 신고자
                memberId,
                "게시글 신고가 접수되었습니다. [" + post.getTitle() + "]"
        );

        return report.getReportId();
    }


    // 댓글 신고
    @Transactional
    public Long reportComment(String loginId, Long commentId, String reason) {
        // 회원 조회
        Member member = memberRepository.findByLoginId(loginId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));
        Long memberId = member.getMemberId();

        // 댓글 조회
        PostComment comment = commentRepository.findById(commentId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 댓글입니다."));

        // 신고 생성
        Report report = new Report();

        report.setReporterMemberId(memberId);
        report.setTargetType(TargetType.COMMENT);
        report.setTargetId(commentId);
        report.setReason(reason);

        // 저장
        reportRepository.save(report);

        // 알림
        alarmService.createAlarm( // To: 게시글 작성자
                comment.getMember().getMemberId(),
                "회원님의 댓글이 다른 사용자에 의해 신고되었습니다."
        );
        alarmService.createAlarm( // To: 신고자
                memberId,
                "댓글 신고가 접수되었습니다."
        );


        return report.getReportId();
    }
}