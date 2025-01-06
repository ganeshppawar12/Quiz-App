// Import necessary libraries
import React, { useState, useEffect } from 'react';
// import './App.css';
import 'tailwindcss/tailwind.css';

// API endpoint for quiz questions
const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const formattedQuestions = data.results.map((q) => ({
          question: q.question,
          options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          correctAnswer: q.correct_answer,
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  // Countdown timer for each question
  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Handle answer selection
  const handleAnswer = (selectedOption) => {
    if (questions[currentQuestionIndex].correctAnswer === selectedOption) {
      setScore((prev) => prev + 1);
    }
    handleNextQuestion();
  };

  // Move to the next question or finish the quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(5);
    } else {
      setIsQuizFinished(true);
    }
  };

  // Restart the quiz
  const handleRestart = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(5);
    setIsQuizFinished(false);

    // Fetch questions again
    const fetchQuestions = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const formattedQuestions = data.results.map((q) => ({
          question: q.question,
          options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          correctAnswer: q.correct_answer,
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
      }
    };

    fetchQuestions();
  };

  // Render the quiz
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Quiz App</h1>
      {isQuizFinished ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Your Score: {score}/{questions.length}</h2>
          <button
            onClick={handleRestart}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Restart Quiz
          </button>
        </div>
      ) : questions.length > 0 ? (
        <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
          <h2 className="text-lg font-medium mb-4">
            Question {currentQuestionIndex + 1}/{questions.length}
          </h2>
          <p
            className="mb-4 text-gray-800"
            dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex].question }}
          />
          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 text-right text-sm text-gray-600">Time Left: {timeLeft}s</div>
        </div>
      ) : (
        <p className="text-gray-600">Loading questions...</p>
      )}
    </div>
  );
};

export default App;
