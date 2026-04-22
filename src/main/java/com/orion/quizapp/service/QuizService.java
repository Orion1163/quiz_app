package com.orion.quizapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.orion.quizapp.dao.QuestionDao;
import com.orion.quizapp.dao.QuizDao;
import com.orion.quizapp.model.Question;
import com.orion.quizapp.model.Quiz;
import com.orion.quizapp.model.QuizSummary;
import com.orion.quizapp.model.Response;

import org.springframework.http.HttpStatus;
import com.orion.quizapp.model.QuestionWrapper;
import java.util.ArrayList;
import java.util.stream.Collectors;


@Service
public class QuizService {
    
    @Autowired
    QuizDao quizDao;
    @Autowired
    QuestionDao questionDao;

    public ResponseEntity<String> createQuiz(String category, int numQ, String title){

        List<Question> questions = questionDao.findRandomQuestionByCategory(category, numQ);
        try{
        Quiz quiz = new Quiz();
        quiz.setTitle(title);

        quiz.setQuestions(questions);
        quizDao.save(quiz);
        return new ResponseEntity<String>("Quiz created successfully", HttpStatus.CREATED);
    }catch (Exception e){
        e.printStackTrace();
    }
    return new ResponseEntity<String>("Quiz not created", HttpStatus.BAD_REQUEST);
}

public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
    Optional<Quiz> quiz = quizDao.findById(id);
    List<Question> questionsFromDB = quiz.get().getQuestions();
    List<QuestionWrapper> questionsForUser = new ArrayList<>();
    for (Question question : questionsFromDB) {
        QuestionWrapper questionWrapper = new QuestionWrapper(question.getId(), question.getQuestionTitle(), question.getOption1(), question.getOption2(), question.getOption3(), question.getOption4());
        questionsForUser.add(questionWrapper);
    }
    return new ResponseEntity<>(questionsForUser, HttpStatus.OK);
}

public ResponseEntity<Integer> calculateResult(Integer id, List<Response> responses) {
    Quiz quiz = quizDao.findById(id).get();
    List<Question> questions = quiz.getQuestions();
    int right = 0;
    int i = 0;
    for (Response response : responses) {
        if (response.getResponse().equals(questions.get(i).getRightAnswer())) {
            right++;
        }
        i++;
    }
    return new ResponseEntity<>(right, HttpStatus.OK);
}

public ResponseEntity<List<QuizSummary>> getAllQuizzes() {
    List<QuizSummary> quizzes = quizDao.findAll().stream()
            .map(quiz -> new QuizSummary(quiz.getId(), quiz.getTitle()))
            .collect(Collectors.toList());
    return new ResponseEntity<>(quizzes, HttpStatus.OK);
}
}