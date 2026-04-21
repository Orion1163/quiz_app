package com.orion.quizapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.orion.quizapp.dao.QuestionDao;


import com.orion.quizapp.Question;

@Service
public class QuestionService {

    @Autowired
    QuestionDao questionDao;

    public List<Question> getAllQuestions() {
        return questionDao.findAll();
    }

    public List<Question> getQuestionByCategory(String category) {
        return questionDao.findByCategory(category);
    }

    public String addQuestion(Question question) {
        questionDao.save(question);
        return "Success";
    }

    public String deleteQuestion(int id) {
        questionDao.deleteById(id);
        return "Success";
    }

    public String updateQuestion(Question question) {
        questionDao.save(question);
        return "Question updated successfully";
    }
}