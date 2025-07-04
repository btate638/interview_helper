import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Questions from './components/Questions';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

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
            <FileUpload onQuestionsReceived={setQuestions} />
            <Questions questions={questions} />
          </>
        ) : (
          <Chat />
        )}
      </main>
    </div>
  );
}

export default App;
