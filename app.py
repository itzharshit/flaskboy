from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Fixed questions and answers
qa_pairs = {
    "What is your name?": "I am your mentor bot.",
    "How can you help me?": "I can provide guidance on various topics.",
    "What is Flask?": "Flask is a lightweight WSGI web application framework."
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_answer', methods=['POST'])
def get_answer():
    question = request.json.get("question")
    answer = qa_pairs.get(question, "I don't know the answer to that question.")
    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(debug=True)
