import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Questions from './components/Questions';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState('general');
  const [activeTab, setActiveTab] = useState('upload');

  const handleQuestionsReceived = (newQuestions, type) => {
    setQuestions(newQuestions);
    if (type) {
      setQuestionType(type);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 Interview Preparation Helper</h1>
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📄 Document Analysis
          </button>
          <button 
            className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Interview Coach
          </button>
        </div>
      </header>
      <main>
        {activeTab === 'upload' ? (
          <>
            <FileUpload onQuestionsReceived={handleQuestionsReceived} />
            <Questions questions={questions} questionType={questionType} />
          </>
        ) : (
          <Chat />
        )}
      </main>
    </div>
  );
}

export default App;
