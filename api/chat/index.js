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

  // =========================
  // 🧠 BUILT-IN KNOWLEDGE
  // =========================
  const knowledge = {
    "what is ai": "AI is when machines simulate human intelligence.",
    "what is finance": "Finance is about managing money and investments.",
    "what is coding": "Coding is writing instructions for computers.",
    "what is html": "HTML structures web pages.",
    "what is css": "CSS styles web pages.",
    "what is javascript": "JavaScript makes websites interactive.",
    "what is api": "An API lets systems communicate with each other.",
    "what is a database": "A database stores and organizes data.",
    "what is investing": "Investing is putting money into assets to grow wealth.",
    "what is risk": "Risk is the chance of losing money."
  };

  if (knowledge[lowerMessage]) {
    return res.status(200).json({ reply: knowledge[lowerMessage] });
  }

  // =========================
  // 🎯 INTENTS
  // =========================
  const intents = [
    {
      keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
      responses: ["Hey!", "Hi there!", "Hello!"]
    },
    {
      keywords: ["how are you", "how r you", "howre you"],
      responses: ["I'm good!", "Doing great!", "All good here."]
    },
    {
      keywords: ["what is your name", "who are you"],
      responses: ["I'm your custom AI.", "I'm your chatbot."]
    },
    {
      keywords: ["help", "what can you do"],
      responses: [
        "You can chat with me or teach me new things.",
        "Try asking questions or teaching me something."
      ]
    },
    {
      keywords: ["bye", "goodbye", "see you"],
      responses: ["Bye!", "See you later!", "Goodbye!"]
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

  // =========================
  // 🧠 NAME MEMORY
  // =========================
  function findNameInHistory(chatHistory) {
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      const msg = chatHistory[i];
      if (msg?.role === "user" && msg.text.toLowerCase().includes("my name is ")) {
        return msg.text
          .substring(msg.text.toLowerCase().indexOf("my name is ") + 11)
          .trim();
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
      ? `Nice to meet you, ${name}.`
      : "I didn't catch your name.";

  } else if (
    lowerMessage.includes("what's my name") ||
    lowerMessage.includes("what is my name")
  ) {
    const name = findNameInHistory(history);

    reply = name
      ? `You told me your name is ${name}.`
      : "You haven't told me your name yet.";

  } else if (lowerMessage.endsWith("?")) {
    reply = "I don't know that yet. You can teach me.";

  } else if (lowerMessage.length < 3) {
    reply = "Say a bit more.";

  } else {
    reply = `I don't know that yet.`;
  }

  return res.status(200).json({ reply });
}