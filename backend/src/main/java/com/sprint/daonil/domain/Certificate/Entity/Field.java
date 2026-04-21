package com.sprint.daonil.domain.Certificate.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "field")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Field {

    @Id
    @Column(length = 50)
    private String id;

    private String depth1;
    private String depth2;

    @OneToMany(mappedBy = "field")
    private List<Qualification> qualifications = new ArrayList<>();
}