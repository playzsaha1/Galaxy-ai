export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const message = (req.body?.message || "").toLowerCase().trim();

  let reply = "I don't understand that yet.";

  if (message.includes("hello") || message.includes("hi")) {
    reply = "Hi! Nice to meet you.";
  } else if (message.includes("bye")) {
    reply = "Goodbye!";
  } else if (message.includes("how are you")) {
    reply = "I'm doing well!";
  }

  return res.status(200).json({ reply });
}