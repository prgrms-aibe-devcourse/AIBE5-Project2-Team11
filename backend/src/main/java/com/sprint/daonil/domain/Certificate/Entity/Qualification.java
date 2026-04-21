package com.sprint.daonil.domain.Certificate.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "qualification")
@Getter
@NoArgsConstructor
public class Qualification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String course;

    @Column(unique = true)
    private String JMCD;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fieldId")
    private Field field;

    @OneToMany(mappedBy = "qualification", fetch = FetchType.LAZY)
    @JsonIgnore  // 순환 참조 방지
    private List<ExamDate> examDates = new ArrayList<>();

    // 모든 필드를 포함하는 생성자
    public Qualification(Integer id, String name, String course, String JMCD, Field field, List<ExamDate> examDates) {
        this.id = id;
        this.name = name;
        this.course = course;
        this.JMCD = JMCD;
        this.field = field;
        this.examDates = examDates;
    }
}