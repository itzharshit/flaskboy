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
