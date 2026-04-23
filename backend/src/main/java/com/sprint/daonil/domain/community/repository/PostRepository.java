package com.sprint.daonil.domain.community.repository;

import com.sprint.daonil.domain.community.entity.Post;
import com.sprint.daonil.domain.community.entity.PostLike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    // ===========================
    //   인기순 정렬
    // ===========================

    // 전체 게시글 리스트 조회 (댓글 수 포함)
    @Query("""
    SELECT p, COUNT(DISTINCT c), COUNT(DISTINCT l)
    FROM Post p
    LEFT JOIN PostComment c ON c.post = p
    LEFT JOIN PostLike l ON l.post = p AND l.isActive = true
    WHERE p.isDeleted = false
    GROUP BY p
    ORDER BY COUNT(DISTINCT l) DESC
    """)
    Page<Object[]> findAllOrderByLike(Pageable pageable);

    // 게시글 리스트 조회 (카테고리 필터링 + 댓글 수 포함)
    @Query("""
    SELECT p, COUNT(DISTINCT c), COUNT(DISTINCT l)
    FROM Post p
    LEFT JOIN PostComment c ON c.post = p
    LEFT JOIN PostLike l ON l.post = p AND l.isActive = true
    WHERE p.isDeleted = false
    AND p.category = :category
    GROUP BY p
    ORDER BY COUNT(DISTINCT l) DESC
    """)
    Page<Object[]> findByCategoryOrderByLike( @Param("category") String category, Pageable pageable);

    // 게시글 리스트 조회 (검색어 필터링 + 댓글 수 포함)
    @Query("""
    SELECT p, COUNT(DISTINCT c), COUNT(DISTINCT l)
    FROM Post p
    LEFT JOIN PostComment c ON c.post = p
    LEFT JOIN PostLike l ON l.post = p AND l.isActive = true
    WHERE p.isDeleted = false
    AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%)
    GROUP BY p
    ORDER BY COUNT(DISTINCT l) DESC
    """)
    Page<Object[]> findByKeywordOrderByLike(@Param("keyword") String keyword, Pageable pageable);

    // 게시글 리스트 조회 (검색어 필터링 + 카테고리 필터링 + 댓글 수 포함)
    @Query("""
    SELECT p, COUNT(DISTINCT c), COUNT(DISTINCT l)
    FROM Post p
    LEFT JOIN PostComment c ON c.post = p
    LEFT JOIN PostLike l ON l.post = p AND l.isActive = true
    WHERE p.isDeleted = false
    AND p.category = :category
    AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%)
    GROUP BY p
    ORDER BY COUNT(DISTINCT l) DESC
    """)
    Page<Object[]> findByCategoryAndKeywordOrderByLike( @Param("category") String category, @Param("keyword") String keyword, Pageable pageable);



    // ===========================
    //   최신순 정렬
    // ===========================
    // 전체 게시글 리스트 조회 (댓글 수 포함)
    @Query("""
    SELECT p,
           COUNT(c)
    FROM Post p
    LEFT JOIN PostComment c ON c.post = p
    WHERE p.isDeleted = false
    GROUP BY p
    """)
    Page<Object[]> findPostsWithCommentCount(Pageable pageable);

    // 게시글 리스트 조회 (카테고리 필터링 + 댓글 수 포함)
    @Query("""
    SELECT p, COUNT(c)
    FROM Post p
    LEFT JOIN PostComment c ON c.post = p
    WHERE p.isDeleted = false AND p.category = :category
    GROUP BY p
    ORDER BY p.createdAt DESC
    """)
    Page<Object[]> findByCategoryWithCommentCount(@Param("category") String category, Pageable pageable);


    // 게시글 리스트 조회 (검색어 필터링 + 댓글 수 포함)
    @Query("""
    SELECT p, COUNT(c)
    FROM Post p
    LEFT JOIN PostComment c ON c.post = p
    WHERE p.isDeleted = false
    AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%)
    GROUP BY p
    ORDER BY p.createdAt DESC
    """)
    Page<Object[]> findByKeyword(@Param("keyword") String keyword, Pageable pageable);


    // 게시글 리스트 조회 (검색어 필터링 + 카테고리 필터링 + 댓글 수 포함)
    @Query("""
    SELECT p, COUNT(c)
    FROM Post p
    LEFT JOIN PostComment c ON c.post = p
    WHERE p.isDeleted = false
    AND p.category = :category
    AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%)
    GROUP BY p
    ORDER BY p.createdAt DESC
    """)
    Page<Object[]> findByCategoryAndKeyword(
            @Param("category") String category, @Param("keyword") String keyword, Pageable pageable);
}