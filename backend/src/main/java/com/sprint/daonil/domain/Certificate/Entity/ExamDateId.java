package com.sprint.daonil.domain.Certificate.Entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable // 다른 엔티티의 PK로 “포함”될 수 있음
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ExamDateId implements Serializable { // 복합키 클래스

    @Column(name = "jm_cd")
    private String jmCd;

    @Column(name = "year")
    private Integer year;

    @Column(name = "period")
    private Integer period;


    // 객체가 같은 PK인지 판단
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ExamDateId that = (ExamDateId) o;
        return Objects.equals(jmCd, that.jmCd) &&
                Objects.equals(year, that.year) &&
                Objects.equals(period, that.period);
    }

    @Override
    public int hashCode() {
        return Objects.hash(jmCd, year, period);
    }
}