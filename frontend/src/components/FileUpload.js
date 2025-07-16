import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ onQuestionsReceived }) {
  const [cv, setCV] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit called');
    console.log('CV:', cv);
    console.log('Job Description:', jobDescription);
    
    if (!cv || !jobDescription) {
      setError('Please select both CV and job description files');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('cv', cv);
    formData.append('jobDescription', jobDescription);
    
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
      onQuestionsReceived(response.data.questions);
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

  return (
    <div className="file-upload">
      <h2>📄 Upload Your Documents</h2>
      <form onSubmit={handleSubmit}>
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
          {loading ? 'Analyzing Documents...' : '🚀 Generate Interview Questions'}
        </button>
      </form>
    </div>
  );
}

export default FileUpload;
