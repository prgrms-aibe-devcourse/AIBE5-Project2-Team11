package com.sprint.daonil;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class DaonilApplication {

	public static void main(String[] args) {
		SpringApplication.run(DaonilApplication.class, args);
	}

}