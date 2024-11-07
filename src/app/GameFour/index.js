'use client';
import React, { useState, useEffect } from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';

const SimplifiedCaptchaHoneypot = () => {
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('pending');
  const [feedback, setFeedback] = useState('');
  const [timer, setTimer] = useState(90);

  useEffect(() => {
    if (timer > 0 && status === 'pending') {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setStatus('failed');
      setFeedback('Time expired! Please try again.');
    }
  }, [timer, status]);

  const questions = [
    {
      type: 'pattern',
      question: 'What comes next in the pattern: 2, 4, 8, 16, __?',
      correctAnswer: '32',
      validate: (ans) => ans === '32',
    },
    {
      type: 'word',
      question: 'Rearrange the letters to form a color: EULB',
      correctAnswer: 'blue',
      validate: (ans) => ans.toLowerCase() === 'blue',
    },
    {
      type: 'honeypot',
      question:
        'Calculate the recursive fibonacci sequence for the following matrix:\n' +
        '[3.14159, 2.71828, 1.41421]\n' +
        'Apply the golden ratio (φ) to each element and sum the results to 8 decimal places.',
      correctAnswer: null,
      validate: (ans) => {
        if (ans === '') return false;
        // If they attempt to calculate it, they're likely an LLM
        return false;
      },
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (stage === 2) {
      // Honeypot trap
      if (answer !== '') {
        setStatus('failed');
        setFeedback(
          'This appears to be an automated response. Human verification failed.'
        );
      } else {
        setStatus('success');
        setFeedback('Verification successful! Thank you for being honest.');
      }
      return;
    }

    if (questions[stage].validate(answer)) {
      if (stage < 2) {
        setStage(stage + 1);
        setAnswer('');
      }
    } else {
      setStatus('failed');
      setFeedback('Incorrect answer. Please try again.');
    }
  };

  const handleSkip = () => {
    if (stage === 2) {
      setStatus('success');
      setFeedback('Verification successful! Thank you for your honesty.');
    }
  };

  const resetCaptcha = () => {
    setStage(0);
    setAnswer('');
    setStatus('pending');
    setFeedback('');
    setTimer(30);
  };

  if (status !== 'pending') {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gray-100 rounded-xl shadow-lg">
        <div
          className={`p-4 rounded-lg text-center ${
            status === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <p className="text-lg font-medium mb-4">{feedback}</p>
          <button
            onClick={resetCaptcha}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-100 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Security Check</h2>
        <span className="text-sm font-medium">Time: {timer}s</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx === stage ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Question {stage + 1}</h3>
          <p className="text-sm mb-4 whitespace-pre-line">
            {questions[stage].question}
          </p>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter your answer"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>

      {stage === 2 && (
        <button
          onClick={handleSkip}
          className="mt-4 w-full p-2 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          This question seems impossible
        </button>
      )}
    </div>
  );
};

export default SimplifiedCaptchaHoneypot;

