package com.orion.quizapp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.orion.quizapp.dao.QuestionDao;
import com.orion.quizapp.model.Question;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@Service
public class QuestionService {

    @Autowired
    QuestionDao questionDao;

    public ResponseEntity<List<Question>> getAllQuestions() {
        try {
            return new ResponseEntity<>(questionDao.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<List<Question>> getQuestionByCategory(String category) {
        try {
            return new ResponseEntity<>(questionDao.findByCategory(category), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> addQuestion(Question question) {
        try {
            questionDao.save(question);
            return new ResponseEntity<String>("Question added successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<String>("Question not added", HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> deleteQuestion(int id) {
        try{
        questionDao.deleteById(id);
        return new ResponseEntity<String>("Question Deleted Successfully", HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<String>(" Question not deleted Successfully", HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> updateQuestion(int id, Question question) {
        try{
        question.setId(id);
        questionDao.save(question);
        return new ResponseEntity<String>("Question updated successfully", HttpStatus.OK);
        }catch(Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<String>("Question not updated", HttpStatus.BAD_REQUEST);
        }
}