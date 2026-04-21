package com.sprint.daonil.domain.qualification.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ExamDateId implements Serializable {

    @Column(name = "jm_cd", length = 20)
    private String jmcd;

    @Column(name = "year")
    private Integer year;

    @Column(name = "period")
    private Integer period;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ExamDateId that = (ExamDateId) o;
        return Objects.equals(jmcd, that.jmcd) &&
                Objects.equals(year, that.year) &&
                Objects.equals(period, that.period);
    }

    @Override
    public int hashCode() {
        return Objects.hash(jmcd, year, period);
    }
}

