package com.sprint.daonil.domain.community.repository;

import com.sprint.daonil.domain.community.entity.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<PostComment, Long> {
}
