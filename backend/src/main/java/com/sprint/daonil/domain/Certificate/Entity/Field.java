package com.sprint.daonil.domain.Certificate.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "field")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Field {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    private String depth1;
    private String depth2;

    @OneToMany(mappedBy = "field")
    @JsonIgnore  // 순환 참조 방지
    private List<Qualification> qualifications = new ArrayList<>();
}