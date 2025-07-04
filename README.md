# 🎯 Interview Preparation Helper

A full-stack web application that helps job seekers prepare for interviews by analyzing their CV and job descriptions using AI, and providing an interactive chat interface with an interview coach.

![Interview Helper](https://img.shields.io/badge/Python-Flask-blue)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![OpenAI](https://img.shields.io/badge/AI-OpenAI%20GPT--4-412991)

## ✨ Features

### 📄 Document Analysis
- Upload your CV and job description files
- AI-powered analysis using GPT-4
- Generate tailored interview questions based on your experience
- Beautiful, modern UI with drag-and-drop file upload

### 💬 Interactive Interview Coach
- Real-time chat with an AI interview coach
- Get personalized advice and feedback
- Practice answers and receive constructive guidance
- Conversation history maintained during session

### 🎨 Modern Design
- Colorful, minimalistic interface
- Responsive design for all devices
- Glass morphism effects and smooth animations
- Professional gradient themes

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ 
- Node.js 14+
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/btate638/interview_helper.git
   cd interview_helper
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On macOS/Linux
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**
   ```bash
   # Create .env file in backend directory
   echo "OPENAI_API_KEY=your_api_key_here" > .env
   ```
   Replace `your_api_key_here` with your actual OpenAI API key.

4. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   venv\Scripts\activate  # Activate virtual environment
   python run.py
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
interview_helper/
├── backend/                 # Flask backend
│   ├── app/
│   │   ├── __init__.py     # Flask app factory
│   │   ├── config.py       # Configuration settings
│   │   ├── routes.py       # API routes
│   │   ├── instructions.json # AI prompting instructions
│   │   └── services/
│   │       └── gpt_service.py # OpenAI integration
│   ├── venv/               # Virtual environment
│   ├── requirements.txt    # Python dependencies
│   ├── run.py             # Application entry point
│   └── .env               # Environment variables
├── frontend/               # React frontend
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.js  # File upload component
│   │   │   ├── Questions.js   # Questions display
│   │   │   └── Chat.js        # Chat interface
│   │   ├── App.js         # Main application
│   │   ├── App.css        # Styling
│   │   └── index.js       # React entry point
│   └── package.json       # Node.js dependencies
└── .gitignore             # Git ignore rules
```

## 🔧 API Endpoints

### Document Analysis
- **POST** `/api/analyze`
  - Upload CV and job description files
  - Returns generated interview questions

### Chat Interface  
- **POST** `/api/chat`
  - Send messages to AI interview coach
  - Maintains conversation history
  - Returns AI responses

## 🎨 Tech Stack

### Backend
- **Flask** - Python web framework
- **OpenAI GPT-4** - AI language model
- **Flask-CORS** - Cross-origin resource sharing
- **python-dotenv** - Environment variable management

### Frontend
- **React** - JavaScript UI library
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

## 🔒 Security

- Environment variables for API keys
- CORS configuration for secure cross-origin requests
- Input validation and error handling
- `.gitignore` configured to protect sensitive files

## 🚀 Deployment

### Backend Deployment
The Flask backend can be deployed to platforms like:
- Heroku
- Railway
- PythonAnywhere
- AWS EC2

### Frontend Deployment
The React frontend can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4 API
- Flask and React communities for excellent documentation
- Contributors and testers

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/btate638/interview_helper/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer

---

Made with ❤️ for job seekers everywhere. Good luck with your interviews! 🍀
