from flask import Flask, render_template, request, jsonify
import os
from groq import Groq

app = Flask(__name__)

systemPrompt = """
You are a help assistant
"""

# Create the Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Set the system prompt
system_prompt = {
    "role": "system",
    "content": systemPrompt
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_answer', methods=['POST'])
def get_answer():
    question = request.json.get("question")
    chat_history = [system_prompt, {"role": "user", "content": question}]
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=chat_history,
        max_tokens=100,
        temperature=1.2
    )
    answer = response.choices[0].message.content

    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=800, debug=True)
