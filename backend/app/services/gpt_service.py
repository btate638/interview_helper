import openai
from app.config import Config
import json
import os

# Set the OpenAI API key
openai.api_key = Config.OPENAI_API_KEY

def analyze_documents(cv_content, job_description):
    try:
        # Load instructions from file
        instructions_path = os.path.join('app', 'instructions.json')
        with open(instructions_path, 'r') as f:
            instructions = json.load(f)
        
        system_prompt = instructions['system_prompt']
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"CV:\n{cv_content}\n\nJob Description:\n{job_description}\n\nGenerate 5-7 specific interview questions that test the candidate's experience and suitability for this role."}
            ]
        )
        
        questions_text = response.choices[0].message['content']
        # Split into individual questions and clean them up
        questions = [q.strip() for q in questions_text.split('\n') if q.strip() and (q.strip()[0].isdigit() or q.strip().startswith('-'))]
        
        return questions
    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
        return []

def chat_with_gpt(user_message, chat_history=None):
    if chat_history is None:
        chat_history = []
        
    try:
        # Build messages array with chat history
        messages = [
            {"role": "system", "content": "You are an expert interview coach and career advisor. Help users prepare for interviews, answer questions about career development, provide feedback on interview responses, and offer guidance on professional growth. Be encouraging, constructive, and specific in your advice."}
        ]
        
        # Add chat history
        for msg in chat_history:
            if isinstance(msg, dict) and 'role' in msg and 'content' in msg:
                messages.append({"role": msg["role"], "content": msg["content"]})
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message['content']
    except Exception as e:
        print(f"Error in chat_with_gpt: {str(e)}")
        return "I'm sorry, I'm having trouble responding right now. Please try again."
