import React from 'react';

function Questions({ questions }) {
  if (!questions || questions.length === 0) {
    return null;
  }

  // Filter out empty questions
  const validQuestions = questions.filter(q => q && q.trim().length > 0);

  if (validQuestions.length === 0) {
    return null;
  }

  return (
    <div className="questions">
      <h2>Generated Interview Questions</h2>
      <ul className="questions-list">
        {validQuestions.map((question, index) => (
          <li key={index} className="question-item">
            {question.trim()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Questions;
