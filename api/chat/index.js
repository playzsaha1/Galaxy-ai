export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const message = (req.body?.message || "").trim();
  const lowerMessage = message.toLowerCase();
  const history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (!message) {
    return res.status(400).json({ reply: "Please send a message." });
  }

  const intents = [
    {
      name: "greeting",
      keywords: ["hello", "hi", "hey", "heyy", "good morning", "good afternoon"],
      responses: [
        "Hey! How can I help you today?",
        "Hi! What would you like to talk about?",
        "Hello! I'm ready."
      ]
    },
    {
      name: "how_are_you",
      keywords: ["how are you", "how r you", "howre you"],
      responses: [
        "I'm doing well. Thanks for asking.",
        "I'm good and ready to help.",
        "Doing great. What do you need?"
      ]
    },
    {
      name: "name_question",
      keywords: ["what is your name", "what's your name", "who are you"],
      responses: [
        "I'm your custom AI assistant.",
        "I'm your own chatbot, built by you.",
        "I'm your AI project."
      ]
    },
    {
      name: "help",
      keywords: ["help", "what can you do", "commands", "options"],
      responses: [
        "Right now I can chat, answer simple questions, and respond based on intents. We can keep improving me.",
        "I can handle greetings, simple questions, and basic memory. We can add much more next.",
        "I can already chat with you, and we can expand my skills step by step."
      ]
    },
    {
      name: "goodbye",
      keywords: ["bye", "goodbye", "see you", "cya"],
      responses: [
        "Goodbye!",
        "See you later.",
        "Bye! Come back soon."
      ]
    }
  ];

  function pickResponse(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function detectIntent(text) {
    for (const intent of intents) {
      for (const keyword of intent.keywords) {
        if (text.includes(keyword)) {
          return intent;
        }
      }
    }
    return null;
  }

  function getLastUserMessage(chatHistory) {
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      if (chatHistory[i]?.role === "user") {
        return chatHistory[i].text;
      }
    }
    return null;
  }

  let reply = "";
  const matchedIntent = detectIntent(lowerMessage);

  if (matchedIntent) {
    reply = pickResponse(matchedIntent.responses);
  } else if (lowerMessage.includes("my name is ")) {
    const name = message.substring(lowerMessage.indexOf("my name is ") + 11).trim();
    reply = name
      ? `Nice to meet you, ${name}. I'll remember that in this chat.`
      : "I think you were telling me your name, but I didn't catch it.";
  } else if (lowerMessage.includes("what's my name") || lowerMessage.includes("what is my name")) {
    const previousUserMessage = getLastUserMessage(history);

    if (previousUserMessage && previousUserMessage.toLowerCase().includes("my name is ")) {
      const extracted = previousUserMessage
        .substring(previousUserMessage.toLowerCase().indexOf("my name is ") + 11)
        .trim();

      reply = extracted
        ? `You told me your name is ${extracted}.`
        : "You mentioned your name earlier, but I couldn't read it clearly.";
    } else {
      reply = "You haven't told me your name yet.";
    }
  } else if (lowerMessage.endsWith("?")) {
    reply = "That's a good question. I don't fully know yet, but I can get smarter as you build me.";
  } else if (lowerMessage.length < 4) {
    reply = "Could you say a little more?";
  } else {
    reply = `You said: "${message}". I don't fully understand that yet, but I'm learning how to respond better.`;
  }

  return res.status(200).json({ reply });
}