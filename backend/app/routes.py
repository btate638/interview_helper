from flask import Blueprint, request, jsonify
from app.services.gpt_service import analyze_documents, chat_with_gpt
from werkzeug.utils import secure_filename
import os

main = Blueprint('main', __name__)

@main.route('/api/analyze', methods=['POST'])
def analyze():
    if 'cv' not in request.files or 'jobDescription' not in request.files:
        return jsonify({'error': 'Missing files'}), 400

    cv = request.files['cv']
    job_description = request.files['jobDescription']

    if cv.filename == '' or job_description.filename == '':
        return jsonify({'error': 'No selected files'}), 400

    cv_content = cv.read().decode('utf-8')
    job_description_content = job_description.read().decode('utf-8')

    questions = analyze_documents(cv_content, job_description_content)
    return jsonify({'questions': questions})

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
