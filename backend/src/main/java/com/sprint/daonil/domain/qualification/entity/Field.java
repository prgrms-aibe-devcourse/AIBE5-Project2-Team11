package com.sprint.daonil.domain.qualification.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "field")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Field {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "depth1", length = 255)
    private String depth1;

    @Column(name = "depth2", length = 255)
    private String depth2;
}

