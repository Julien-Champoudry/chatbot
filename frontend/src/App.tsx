import React, { useEffect } from "react";
import "./App.css";
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { io, Socket } from "socket.io-client";

interface Message {
  sender: "user" | "bot";
  content: string;
}

function App() {
  const [model, setModel] = React.useState("");
  const [prompt, setPrompt] = React.useState<string>("");
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [messages, setMessages] = React.useState<Array<Message | null>>([]);

  const handleModelChange = (event: SelectChangeEvent) => {
    setModel(event.target.value);
  };
  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connecté avec ID :", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Erreur de connexion WebSocket :", err);
    });

    let botResponse = "";

    newSocket.on("chatToken", (token: string) => {
      botResponse += token;

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];

        if (last?.sender === "bot") {
          updated[updated.length - 1] = { ...last, content: botResponse };
          return updated;
        } else {
          return [...updated, { sender: "bot", content: token }];
        }
      });
    });

    newSocket.on("chatEnd", () => {
      botResponse = "";
    });

    newSocket.on("events", (data: { completion: string }) => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: data.completion },
      ]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  console.log("socket", socket);
  console.log("messages", messages);

  enum MOEDELS {
    GPT4_PREVIEW = "gpt-4-turbo-preview",
    GPT4 = "gpt-4",
    GPT3_5_TURBO = "gpt-3.5-turbo",
  }

  const submit = async () => {
    if (!socket) return;

    const userMessage: Message = {
      sender: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    socket.emit("chatCompletion", {
      prompt: prompt,
      clientId: "user_123",
      model,
    });
    setPrompt("");
  };
  return (
    <div className="App">
      <Container>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={model}
            label="Model"
            onChange={handleModelChange}
          >
            <MenuItem value={MOEDELS.GPT4_PREVIEW}>
              gpt-4-turbo-preview
            </MenuItem>
            <MenuItem value={MOEDELS.GPT4}>gpt-4</MenuItem>
            <MenuItem value={MOEDELS.GPT3_5_TURBO}>gpt-3.5-turbo</MenuItem>
          </Select>
          <FormHelperText>Choose your chatgpt model</FormHelperText>
        </FormControl>
      </Container>

      <Container>
        {messages.map((message, index) => {
          return (
            <p
              key={index}
              style={{
                textAlign: message?.sender === "bot" ? "left" : "right",
              }}
            >
              {" "}
              <strong>{message?.sender === "bot" ? "Bot" : "You"}</strong>
              <br />
              {message?.content}
            </p>
          );
        })}
      </Container>
      <Container>
        <FormControl sx={{ m: 1, minWidth: 400 }}>
          <TextField
            label="Ask your question"
            variant="standard"
            focused
            multiline
            value={prompt}
            rows={4}
            onChange={handlePromptChange}
          />
        </FormControl>
      </Container>
      <Container>
        <Button onClick={submit} variant="contained">
          Submit
        </Button>
      </Container>
    </div>
  );
}

export default App;
