from flask import Flask, render_template, request, jsonify, session
import os
from groq import Groq
from flask_session import Session

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Configure server-side session storage (can be configured to use Redis, filesystem, etc.)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Create the Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Set the system prompt
system_prompt = {
    "role": "system",
    "content": "You are a helpful assistant. You reply with very short answers formatted in Markdown."
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_answer', methods=['POST'])
def get_answer():
    question = request.json.get("question")
    
    if 'chat_history' not in session:
        session['chat_history'] = [system_prompt]
    
    chat_history = session['chat_history']
    chat_history.append({"role": "user", "content": question})

    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=chat_history,
        max_tokens=100,
        temperature=1.2
    )
    answer = response.choices[0].message.content
    chat_history.append({"role": "assistant", "content": answer})

    # Update session chat history
    session['chat_history'] = chat_history

    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=800, debug=True)
