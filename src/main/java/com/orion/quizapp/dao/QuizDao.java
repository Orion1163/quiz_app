package com.orion.quizapp.dao;

import org.springframework.stereotype.Repository;

import com.orion.quizapp.model.Quiz;

import org.springframework.data.jpa.repository.JpaRepository;
@Repository
public interface QuizDao extends JpaRepository<Quiz, Integer> {
    
}
