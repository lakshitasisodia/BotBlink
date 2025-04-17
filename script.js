const chatInput = document.querySelector(".chat_input textarea");
const sendmsg = document.querySelector(".chat_input span");
const chatbox = document.querySelector(".chatbox");
const chattoggeler = document.querySelector(".chatbot-toggler");


const API_KEY = "AIzaSyCEXvDN957Vz9mAnzhFRCRRZAcw9BWC1rI";
const Api_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

let userMessage = ""; // Global for current input

// Create chat <li> for messages
const createchatli = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);

    const chatContent =
        className === "outgoing"
            ? `<p></p>`
            : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;

    chatli.innerHTML = chatContent;
    chatli.querySelector("p").textContent=message
    return chatli;
};

// Send request to Gemini API and display response
const generateResponse = async () => {
    const messageElement = chatbox.querySelector(".chat.incoming:last-child p");

    try {
        const response = await fetch(Api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await response.json();
        let reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Failed to get response.";

        // Convert markdown-style **bold** and newlines
        // Convert markdown to HTML
reply = reply
.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
.replace(/\*(.*?)\*/g, "<em>$1</em>")             // italic
.replace(/`([^`]+)`/g, "<code>$1</code>")         // inline code
.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>') // links
.replace(/\n/g, "<br>");                          // line breaks


        messageElement.innerHTML = reply; // ✅ render HTML response
    } catch (error) {
        messageElement.textContent = "⚠️ Error fetching response!";
        console.error("Error:", error);
    }
};

// Handle sending message
const handlechats = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Show user's message
    chatbox.appendChild(createchatli(userMessage, "outgoing"));
    chatbox.scrollTop = chatbox.scrollHeight;

    // Clear input
    chatInput.value = "";

    // Show bot placeholder
    setTimeout(() => {
        chatbox.appendChild(createchatli("Thinking...", "incoming"));
        chatbox.scrollTop = chatbox.scrollHeight;
        generateResponse();
    }, 500);
};

// Trigger on button click
sendmsg.addEventListener("click", handlechats);

// Trigger on Enter key
chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handlechats();
    }
});


chattoggeler.addEventListener("click",()=>{document.body.classList.toggle("show-chatbot")})