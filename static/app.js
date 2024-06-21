function sendQuestion() {
    const userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;

    const chatBox = document.getElementById("chat-box");
    const userMessage = document.createElement("div");
    userMessage.className = "user";
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);
    
    document.getElementById("user-input").value = "";

    // Display typing animation
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = "Bot is typing...";
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    fetch('/get_answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: userInput })
    })
    .then(response => response.json())
    .then(data => {
        setTimeout(() => {
            chatBox.removeChild(typingIndicator);
            const botMessage = document.createElement("div");
            botMessage.className = "bot";
            botMessage.textContent = data.answer;
            chatBox.appendChild(botMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 2000); // Simulate typing delay
    });
}

document.getElementById('question-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const question = document.getElementById('question').value;

    // Retrieve chat history from localStorage or initialize it if not present
    let chatHistory = JSON.parse(localStorage.getItem('chat_history')) || [];
    chatHistory.push({"role": "user", "content": question});

    // Send the question and chat history to the server
    fetch('/get_answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: question, chat_history: chatHistory })
    })
    .then(response => response.json())
    .then(data => {
        const answerDiv = document.getElementById('answer');
        // Render the answer in Markdown format using marked library
        answerDiv.innerHTML = marked(data.answer);

        // Update chat history with the latest data from the server
        chatHistory = data.chat_history;
        localStorage.setItem('chat_history', JSON.stringify(chatHistory));
    });
});

// Clear chat history from localStorage on page reload
window.onbeforeunload = function() {
    localStorage.removeItem('chat_history');
};
