const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

let chatHistory = [];

function addMessage(role, text) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${role}`;

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = role === "user" ? "You" : "AI";

  const textP = document.createElement("p");
  textP.textContent = text;

  messageDiv.appendChild(label);
  messageDiv.appendChild(textP);
  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  chatHistory.push({ role, text });
}

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  messageInput.value = "";
  sendButton.disabled = true;
  sendButton.textContent = "Sending...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        history: chatHistory
      })
    });

    const data = await response.json();

    if (!response.ok) {
      addMessage("ai", data.reply || "Something went wrong.");
    } else {
      addMessage("ai", data.reply);
    }
  } catch (error) {
    addMessage("ai", "Server error. Please try again.");
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send";
    messageInput.focus();
  }
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});