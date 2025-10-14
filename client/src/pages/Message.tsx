import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import { FaPaperPlane, FaImage } from "react-icons/fa";
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
import http from "../api/http";
import io from "socket.io-client";
import { User as UserType } from "../services/authService";

const socket = io();

const PUBLIC_CONVERSATION_ID = 0;

const Message: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await http.get<{ user: UserType }>("/auth/user");
        setCurrentUser(res.data.user);
      } catch (error) {
        console.error("Failed to load current user", error);
      }
    }
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      if (!currentUser) return;

      try {
        const res = await http.get<UserType[]>("/users");
        setUsers(res.data.filter((u) => u.id !== currentUser.id));
      } catch (error) {
        console.error("Failed to load users", error);
      }
    }
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    async function fetchConvs() {
      try {
        const convs = await getAllConversations();
        setConversations(convs);

        const publicConv = convs.find((c) => c.user1_id === c.user2_id) || null;
        if (publicConv) {
          setSelectedConversation(publicConv);
        } else if (convs.length > 0) {
          setSelectedConversation(convs[0]);
        } else {
          setSelectedConversation(null);
        }
      } catch (error) {
        console.error("Failed to load conversations", error);
      }
    }
    fetchConvs();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedConversation) return;

    const conversationId = selectedConversation.id;

    async function loadMessages() {
      setLoadingMessages(true);
      try {
        const msgs = await getMessages(conversationId);
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setLoadingMessages(false);
        scrollToBottom();
      }
    }
    loadMessages();
  }, [selectedConversation]);

  useEffect(() => {
    socket.on("new_message", (message: MessageItem) => {
      if (message.conversation_id === selectedConversation?.id) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });
    return () => {
      socket.off("new_message");
    };
  }, [selectedConversation]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleUserClick(user: UserType) {
    if (!currentUser) return;

    try {
      const conv = await getOrCreateConversation(currentUser.id, user.id);
      setSelectedConversation(conv);

      const convs = await getAllConversations();
      setConversations(convs);
    } catch (error) {
      console.error("Failed to create/get conversation", error);
    }
  }

  async function handleSend() {
    if (!selectedConversation || !currentUser) {
      alert("No conversation selected or no current user");
      return;
    }
    if (!text.trim() && !mediaFile) {
      return;
    }

    let thumbnail: string | null = null;
    let image_fullview: string | null = null;

    if (mediaFile) {
      const formData = new FormData();
      formData.append("file", mediaFile);
      try {
        const res = await http.post<{ url: string }>("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        thumbnail = res.data.url;
        image_fullview = res.data.url;
      } catch (error) {
        console.error("Media upload failed", error);
        return;
      }
    }

    try {
      const receiver_id =
        selectedConversation.user1_id === currentUser.id
          ? selectedConversation.user2_id
          : selectedConversation.user1_id;

      await sendMessage({
        conversation_id: selectedConversation.id,
        sender_id: currentUser.id,
        receiver_id,
        message: text.trim(),
        message_type: mediaFile ? "media" : "text",
        message_status: "sent",
        thumbnail,
        image_fullview,
      });

      setText("");
      setMediaFile(null);

      const msgs = await getMessages(selectedConversation.id);
      setMessages(msgs);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message", error);
    }
  }

  function getConversationUserName(conv: ConversationItem) {
    if (!currentUser) return "Unknown";
    const otherUserId =
      conv.user1_id === currentUser.id ? conv.user2_id : conv.user1_id;
    const user = users.find((u) => u.id === otherUserId);
    return user ? user.username : "Unknown";
  }

  return (
    <Box display="flex" height="86.5vh" padding={2} sx={{ backgroundColor: "#f5f5f5" }}>
      <Box flex={8} display="flex" flexDirection="column" component={Paper} elevation={3} sx={{ mr: 2 }}>
        <Box p={2} borderBottom="1px solid #ddd">
          <Typography variant="h6">
            {selectedConversation
              ? getConversationUserName(selectedConversation)
              : "Public Chat"}
          </Typography>
        </Box>

        <Box flex={1} p={2} sx={{ overflowY: "auto", bgcolor: "#fff" }}>
          {loadingMessages ? (
            <CircularProgress />
          ) : (
            messages.map((msg) => {
              if (!currentUser) return null;

              const isCurrentUser = msg.sender_id === currentUser.id;

              const senderUser = isCurrentUser
                ? { id: currentUser.id, username: "You", image: currentUser.image }
                : users.find((u) => u.id === msg.sender_id) || {
                    username: "Unknown",
                    image: null,
                  };

              return (
                <Box
                  key={msg.id}
                  mb={2}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isCurrentUser ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    mb={0.5}
                    sx={{ flexDirection: isCurrentUser ? "row-reverse" : "row" }}
                  >
                    <Avatar
                      src={senderUser.image || undefined}
                      sx={{
                        width: 30,
                        height: 30,
                        ml: isCurrentUser ? 1 : 0,
                        mr: isCurrentUser ? 0 : 1,
                        bgcolor: isCurrentUser ? "primary.main" : "grey.500",
                      }}
                    >
                      {!senderUser.image && senderUser.username[0]}
                    </Avatar>
                    <Typography variant="subtitle2">
                      {senderUser.username}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: isCurrentUser ? "#dcf8c6" : "#eee",
                      borderRadius: 2,
                      padding: 1,
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.message && <Typography variant="body1">{msg.message}</Typography>}
                    {msg.image_fullview && (
                      <Box mt={1}>
                        <img
                          src={msg.image_fullview}
                          alt="media"
                          style={{ maxWidth: "100%", borderRadius: 8 }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box p={2} borderTop="1px solid #ddd" display="flex" alignItems="center">
          <TextField
            placeholder="Type a message..."
            fullWidth
            multiline
            maxRows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <input
            type="file"
            accept="image/*,video/*"
            style={{ display: "none" }}
            id="media-upload"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setMediaFile(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="media-upload">
            <IconButton color={mediaFile ? "primary" : "default"} component="span" sx={{ ml: 1 }}>
              <FaImage />
            </IconButton>
          </label>
          <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
            <FaPaperPlane />
          </IconButton>
        </Box>
      </Box>

      <Box flex={4} component={Paper} elevation={3} display="flex" flexDirection="column">
        <Box p={2} borderBottom="1px solid #ddd" flex={1} overflow="auto">
          <Typography variant="h6" mb={2}>
            Users
          </Typography>
          <List component="nav">
            {users.map((user) => (
              <ListItem key={user.id} disablePadding>
                <ListItemButton
                  onClick={() => handleUserClick(user)}
                  selected={
                    selectedConversation
                      ? selectedConversation.user1_id === user.id || selectedConversation.user2_id === user.id
                      : false
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={user.image || undefined} />
                  </ListItemAvatar>
                  <ListItemText primary={user.username} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box p={2} borderTop="1px solid #ddd" sx={{ maxHeight: 200, overflowY: "auto" }}>
          <Typography variant="h6" mb={1}>
            Media
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {messages
              .filter((msg) => msg.image_fullview)
              .map((msg) => (
                <Box
                  key={msg.id}
                  component="img"
                  src={msg.image_fullview!}
                  alt="media"
                  sx={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (msg.image_fullview) {
                      window.open(msg.image_fullview, "_blank");
                    }
                  }}
                />
              ))}
            {messages.filter((msg) => msg.image_fullview).length === 0 && (
              <Typography variant="body2" color="textSecondary">
                No media
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Message;
