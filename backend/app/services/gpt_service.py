import openai
from app.config import Config
import json
import os

# Set the OpenAI API key
openai.api_key = Config.OPENAI_API_KEY

def analyze_documents(cv_content, job_description, question_type="general"):
    try:
        # Load instructions from file
        instructions_path = os.path.join('app', 'instructions.json')
        with open(instructions_path, 'r') as f:
            instructions = json.load(f)
        
        system_prompt = instructions['system_prompt']
        
        # Define question type specific instructions
        question_type_instructions = {
            "general": "Generate a mix of general interview questions covering background, motivation, and role fit.",
            "technical": "Focus on technical skills, programming challenges, system design, and job-specific technical knowledge. Include coding scenarios or technical problem-solving questions if relevant.",
            "competency": "Create competency-based (behavioral) questions using the STAR method. Focus on past experiences, achievements, and how they handled specific situations like teamwork, leadership, and problem-solving.",
            "leadership": "Generate questions about leadership experience, team management, conflict resolution, decision-making, and motivating others.",
            "situational": "Create hypothetical scenario-based questions relevant to the role. Focus on how they would handle specific workplace situations and challenges.",
            "culture_fit": "Generate questions about work style, values, team collaboration, company culture alignment, and work-life balance preferences."
        }
        
        # Get specific instructions for the question type
        type_instruction = question_type_instructions.get(question_type, question_type_instructions["general"])
        
        user_prompt = f"""CV:
{cv_content}

Job Description:
{job_description}

QUESTION TYPE: {question_type.upper()}
Focus: {type_instruction}

Generate 6-8 specific {question_type} interview questions that test the candidate's experience and suitability for this role. For each question, provide 3-4 bullet points of suggested talking points/answers based on the candidate's CV.

Format your response as JSON with the following structure:

{{
  "questions": [
    {{
      "question": "The interview question",
      "bullet_points": [
        "First talking point based on CV",
        "Second talking point based on CV",
        "Third talking point based on CV"
      ]
    }}
  ]
}}"""
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        
        response_text = response.choices[0].message['content']
        
        # Try to parse JSON response
        try:
            response_data = json.loads(response_text)
            return response_data.get('questions', [])
        except json.JSONDecodeError:
            # Fallback: parse as plain text and create structure
            questions_text = response_text
            questions = [q.strip() for q in questions_text.split('\n') if q.strip() and (q.strip()[0].isdigit() or q.strip().startswith('-'))]
            
            # Convert to new format for backward compatibility
            formatted_questions = []
            for question in questions:
                formatted_questions.append({
                    "question": question,
                    "bullet_points": ["Review your relevant experience", "Prepare specific examples", "Practice your delivery"]
                })
            return formatted_questions
        
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
