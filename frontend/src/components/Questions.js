import React from 'react';

function Questions({ questions, questionType }) {
  if (!questions || questions.length === 0) {
    return null;
  }

  const questionTypeLabels = {
    'general': '🎯 General Questions',
    'technical': '💻 Technical Questions',
    'competency': '🎪 Competency-Based Questions',
    'leadership': '👑 Leadership Questions',
    'situational': '🎭 Situational Questions',
    'culture_fit': '🤝 Culture Fit Questions'
  };

  const questionTypeLabel = questionTypeLabels[questionType] || '🎯 Interview Questions';

  // Handle both old format (array of strings) and new format (array of objects)
  const formatQuestions = (questions) => {
    return questions.map((item, index) => {
      if (typeof item === 'string') {
        // Old format - just strings
        return {
          question: item,
          bullet_points: []
        };
      } else if (typeof item === 'object' && item.question) {
        // New format - objects with question and bullet_points
        return {
          question: item.question,
          bullet_points: item.bullet_points || []
        };
      }
      return null;
    }).filter(Boolean);
  };

  const formattedQuestions = formatQuestions(questions);

  if (formattedQuestions.length === 0) {
    return null;
  }

  return (
    <div className="questions">
      <div className="questions-header">
        <h2>{questionTypeLabel}</h2>
        <p className="questions-subtitle">
          {formattedQuestions.length} tailored questions with personalized talking points
        </p>
      </div>
      <div className="questions-container">
        {formattedQuestions.map((item, index) => (
          <div key={index} className="question-card">
            <div className="question-header">
              <span className="question-number">{index + 1}</span>
              <h3 className="question-text">{item.question}</h3>
            </div>
            
            {item.bullet_points && item.bullet_points.length > 0 && (
              <div className="bullet-points-section">
                <h4 className="bullet-points-title">💡 Suggested Talking Points:</h4>
                <ul className="bullet-points-list">
                  {item.bullet_points.map((point, pointIndex) => (
                    <li key={pointIndex} className="bullet-point">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Questions;
