package com.sprint.daonil.domain.resume.entity;

import com.sprint.daonil.domain.Certificate.Entity.Qualification;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "resume_certificate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resume_certificate_id")
    private Long resumeCertificateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "qualification_id", nullable = false)
    private Qualification qualification;

    @Column(name = "acquired_date", nullable = false)
    private LocalDate acquiredDate;
}