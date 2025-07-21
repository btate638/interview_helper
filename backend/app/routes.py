from flask import Blueprint, request, jsonify
from app.services.gpt_service import analyze_documents, chat_with_gpt
from werkzeug.utils import secure_filename
import os
import PyPDF2
from docx import Document
import io

main = Blueprint('main', __name__)

def extract_text_from_file(file):
    """Extract text from uploaded file based on its type"""
    filename = file.filename.lower()
    
    try:
        if filename.endswith('.txt'):
            return file.read().decode('utf-8')
        
        elif filename.endswith('.pdf'):
            # Read PDF content
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        
        elif filename.endswith(('.doc', '.docx')):
            # Read Word document content
            doc = Document(io.BytesIO(file.read()))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        
        else:
            # Try to decode as UTF-8 for other text files
            file.seek(0)  # Reset file pointer
            return file.read().decode('utf-8')
            
    except Exception as e:
        print(f"Error extracting text from {filename}: {str(e)}")
        # Fallback: try to decode as UTF-8
        try:
            file.seek(0)
            return file.read().decode('utf-8', errors='ignore')
        except:
            raise ValueError(f"Could not extract text from file: {filename}")

@main.route('/api/analyze', methods=['POST'])
def analyze():
    print("Analyze endpoint called")
    print(f"Request files: {list(request.files.keys())}")
    print(f"Request form data: {dict(request.form)}")
    
    if 'cv' not in request.files or 'jobDescription' not in request.files:
        print("Missing files in request")
        return jsonify({'error': 'Missing files'}), 400

    cv = request.files['cv']
    job_description = request.files['jobDescription']
    question_type = request.form.get('questionType', 'general')  # Get question type from form data
    
    print(f"CV filename: {cv.filename}")
    print(f"Job description filename: {job_description.filename}")
    print(f"Question type: {question_type}")

    if cv.filename == '' or job_description.filename == '':
        print("Empty filenames")
        return jsonify({'error': 'No selected files'}), 400

    try:
        print("Extracting text from CV...")
        cv_content = extract_text_from_file(cv)
        print(f"CV content length: {len(cv_content)}")
        
        print("Extracting text from job description...")
        job_description_content = extract_text_from_file(job_description)
        print(f"Job description content length: {len(job_description_content)}")
        
        if not cv_content.strip() or not job_description_content.strip():
            print("Empty content after extraction")
            return jsonify({'error': 'Could not extract text from uploaded files. Please ensure they contain readable text.'}), 400
        
        print("Calling GPT service...")
        questions = analyze_documents(cv_content, job_description_content, question_type)
        print(f"Generated {len(questions)} questions")
        return jsonify({'questions': questions})
        
    except ValueError as e:
        print(f"ValueError: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error in analyze endpoint: {str(e)}")
        return jsonify({'error': 'An error occurred while processing your files. Please try again.'}), 500

@main.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    
    if not data or 'message' not in data:
        return jsonify({'error': 'Message is required'}), 400
    
    user_message = data['message']
    chat_history = data.get('history', [])
    
    try:
        response = chat_with_gpt(user_message, chat_history)
        return jsonify({'response': response})
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': 'Failed to get response from AI'}), 500
