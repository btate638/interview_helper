import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ onQuestionsReceived }) {
  const [cv, setCV] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [questionType, setQuestionType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const questionTypes = [
    { value: 'general', label: '🎯 General Questions', description: 'Mix of background, motivation, and role fit questions' },
    { value: 'technical', label: '💻 Technical Questions', description: 'Programming, system design, and technical problem-solving' },
    { value: 'competency', label: '🎪 Competency-Based Questions', description: 'Behavioral questions using STAR method' },
    { value: 'leadership', label: '👑 Leadership Questions', description: 'Team management, decision-making, and conflict resolution' },
    { value: 'situational', label: '🎭 Situational Questions', description: 'Hypothetical workplace scenarios and challenges' },
    { value: 'culture_fit', label: '🤝 Culture Fit Questions', description: 'Work style, values, and team collaboration' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit called');
    console.log('CV:', cv);
    console.log('Job Description:', jobDescription);
    console.log('Question Type:', questionType);
    
    if (!cv || !jobDescription) {
      setError('Please select both CV and job description files');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('cv', cv);
    formData.append('jobDescription', jobDescription);
    formData.append('questionType', questionType);
    
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      onQuestionsReceived(response.data.questions, questionType);
    } catch (err) {
      console.error('Error details:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        setError(err.response.data.error || 'Error analyzing files. Please try again.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (setter, file) => {
    setter(file);
    setError(null); // Clear error when user selects a file
  };

  const selectedQuestionType = questionTypes.find(type => type.value === questionType);

  return (
    <div className="file-upload">
      <h2>📄 Upload Your Documents</h2>
      <form onSubmit={handleSubmit}>
        <div className="upload-section">
          <label className="upload-label">
            🎯 Interview Question Type
          </label>
          <div className="question-type-wrapper">
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="question-type-select"
            >
              {questionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {selectedQuestionType && (
              <p className="question-type-description">
                {selectedQuestionType.description}
              </p>
            )}
          </div>
        </div>

        <div className="upload-section">
          <label className="upload-label">
            📋 CV / Resume
          </label>
          <div className="file-input-wrapper">
            <input
              type="file"
              className={`file-input ${cv ? 'has-file' : ''}`}
              onChange={(e) => handleFileChange(setCV, e.target.files[0])}
              accept=".txt,.pdf,.doc,.docx"
              placeholder="Choose your CV file..."
            />
            {cv && <div style={{marginTop: '0.5rem', color: '#38a169', fontSize: '0.875rem'}}>✓ {cv.name}</div>}
          </div>
        </div>
        
        <div className="upload-section">
          <label className="upload-label">
            💼 Job Description
          </label>
          <div className="file-input-wrapper">
            <input
              type="file"
              className={`file-input ${jobDescription ? 'has-file' : ''}`}
              onChange={(e) => handleFileChange(setJobDescription, e.target.files[0])}
              accept=".txt,.pdf,.doc,.docx"
            />
            {jobDescription && <div style={{marginTop: '0.5rem', color: '#38a169', fontSize: '0.875rem'}}>✓ {jobDescription.name}</div>}
          </div>
        </div>
        
        {error && <div className="error">⚠️ {error}</div>}
        
        <button type="submit" className="analyze-button" disabled={loading}>
          {loading && <span className="loading-spinner"></span>}
          {loading ? 'Analyzing Documents...' : `🚀 Generate ${selectedQuestionType?.label.split(' ')[1]} Questions`}
        </button>
      </form>
    </div>
  );
}

export default FileUpload;
