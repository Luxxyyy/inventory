import React, { useEffect, useState, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";
import  io   from "socket.io-client";
import {
  getAllConversations,
  getOrCreateConversation,
  ConversationItem,
} from "../api/conversation_api";
import {
  getMessages,
  sendMessage,
  MessageItem,
} from "../api/message_api";
import { User as UserType } from "../services/authService";
import UserList from "../components/message/UserList";
import ChatWindow from "../components/message/ChatWindow";
import { encryptMessage, decryptMessage } from "../utils/encryption";
import http from "../api/http";

const Message: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const [loadingMessages, setLoadingMessages] = useState(false);

const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    if (!socketRef.current) {
      const sock = io("http://localhost:8080");
      socketRef.current = sock;

      sock.on("connect", () => {
        console.log("✅ Socket connected:", sock.id);
        sock.emit("join", { userId: currentUser.id });
      });

      sock.on("new_message", (msg: MessageItem) => {
        console.log("📨 Received socket new_message:", msg);
        const decryptedText = msg.message
          ? decryptMessage(msg.message)
          : msg.message;

        if (
          selectedConversation &&
          msg.conversation_id === selectedConversation.id
        ) {
          setMessages((prev) => [
            ...prev,
            { ...msg, message: decryptedText },
          ]);
        } else {
          setUnreadCounts((prev) => ({
            ...prev,
            [msg.sender_id]: (prev[msg.sender_id] || 0) + 1,
          }));
        }
      });

      sock.on("disconnect", () => console.log("❌ Socket disconnected"));
    }
  }, [currentUser, selectedConversation]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get<{ user: UserType }>("/auth/user");
        setCurrentUser(data.user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const { data } = await http.get<UserType[]>("/users");
        setUsers(data.filter((u) => u.id !== currentUser.id));
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    })();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const convs = await getAllConversations();
        setConversations(convs);
        if (convs.length > 0) setSelectedConversation(convs[0]);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    })();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedConversation) return;
    (async () => {
      setLoadingMessages(true);
      try {
        const msgs = await getMessages(selectedConversation.id);
        const decrypted = msgs.map((m) => ({
          ...m,
          message: m.message ? decryptMessage(m.message) : m.message,
        }));
        setMessages(decrypted);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    })();
  }, [selectedConversation]);

  async function handleSend() {
    if (!selectedConversation || !currentUser) return;
    if (!text.trim() && !mediaFile) return;

    let messageType = "text";
    let base64Media = null;

    if (mediaFile) {
      const reader = new FileReader();
      base64Media = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(mediaFile);
      });

      if (mediaFile.type.startsWith("image/")) messageType = "image";
      else if (mediaFile.type.startsWith("video/")) messageType = "video";
      else messageType = "file";
    }

    const encryptedText = text ? encryptMessage(text) : "";

    const receiver_id =
      selectedConversation.user1_id === currentUser.id
        ? selectedConversation.user2_id
        : selectedConversation.user1_id;

    const payload = {
      conversation_id: selectedConversation.id,
      sender_id: currentUser.id,
      receiver_id,
      message: encryptedText,
      message_type: messageType,
      thumbnail: base64Media,
      image_fullview: base64Media,
    };

    try {
      const saved = await sendMessage(payload);

      setMessages((prev) => [
        ...prev,
        {
          ...saved,
          message: text,
          sender_id: currentUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      setText("");
      setMediaFile(null);
      if (mediaPreviewUrl) {
        URL.revokeObjectURL(mediaPreviewUrl);
        setMediaPreviewUrl(null);
      }
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  }

  async function handleUserClick(user: UserType) {
    if (!currentUser) return;
    try {
      const conv = await getOrCreateConversation(currentUser.id, user.id);
      setSelectedConversation(conv);
      setUnreadCounts((prev) => ({ ...prev, [user.id]: 0 }));
    } catch (err) {
      console.error("Failed to open conversation:", err);
    }
  }

  return (
    <Box
      display="flex"
      height="86.5vh"
      padding={2}
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Box
        flex={8}
        display="flex"
        flexDirection="column"
        component={Paper}
        elevation={3}
        sx={{ mr: 2 }}
      >
        <ChatWindow
          currentUser={currentUser}
          users={users}
          messages={messages}
          loadingMessages={loadingMessages}
          selectedConversation={selectedConversation}
          text={text}
          setText={setText}
          mediaFile={mediaFile}
          mediaPreviewUrl={mediaPreviewUrl}
          setMediaFile={setMediaFile}
          setMediaPreviewUrl={setMediaPreviewUrl}
          handleSend={handleSend}
        />
      </Box>

      <Box flex={4} component={Paper} elevation={3} p={2}>
        <Typography variant="h6" mb={2}>
          Users
        </Typography>
        <UserList
          users={users}
          selectedConversation={selectedConversation}
          onUserClick={handleUserClick}
          socket={socketRef.current}
          currentUser={currentUser}
          unreadCounts={unreadCounts}
          setUnreadCounts={setUnreadCounts}
        />
      </Box>
    </Box>
  );
};

export default Message;
