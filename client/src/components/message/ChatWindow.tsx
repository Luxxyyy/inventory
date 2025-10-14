import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
} from "@mui/material";
import { FaPaperPlane, FaImage, FaTimes } from "react-icons/fa";
import { User as UserType } from "../../services/authService";
import { MessageItem } from "../../api/message_api";
import { ConversationItem } from "../../api/conversation_api";

interface ChatWindowProps {
  currentUser: UserType | null;
  users: UserType[];
  messages: MessageItem[];
  loadingMessages: boolean;
  selectedConversation: ConversationItem | null;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  mediaFile: File | null;
  mediaPreviewUrl: string | null;
  setMediaFile: React.Dispatch<React.SetStateAction<File | null>>;
  setMediaPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  handleSend: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  currentUser,
  users,
  messages,
  loadingMessages,
  selectedConversation,
  text,
  setText,
  mediaFile,
  mediaPreviewUrl,
  setMediaFile,
  setMediaPreviewUrl,
  handleSend,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [dialogImageSrc, setDialogImageSrc] = useState<string | null>(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getConversationUserName(conv: ConversationItem) {
    if (!currentUser) return "Unknown";
    const otherUserId =
      conv.user1_id === currentUser.id ? conv.user2_id : conv.user1_id;
    const user = users.find((u) => u.id === otherUserId);
    return user ? user.username : "Unknown";
  }

  const handleImageClick = (src: string) => {
    setDialogImageSrc(src);
    setOpenImageDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenImageDialog(false);
    setDialogImageSrc(null);
  };

  return (
    <Box flex={8} display="flex" flexDirection="column" sx={{ height: "100%" }}>
      <Box p={2} borderBottom="1px solid #ddd">
        <Typography variant="h6">
          {selectedConversation
            ? getConversationUserName(selectedConversation)
            : "Select a conversation"}
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
                  sx={{
                    flexDirection: isCurrentUser ? "row-reverse" : "row",
                  }}
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
                  {msg.message && (
                    <Typography variant="body1">{msg.message}</Typography>
                  )}
                  {msg.image_fullview && (
                    <Box mt={1}>
                      <img
                        src={msg.image_fullview}
                        alt="media preview"
                        style={{
                          maxWidth: "100%",
                          borderRadius: 8,
                          cursor: "pointer",
                          maxHeight: 200,
                          objectFit: "cover",
                        }}
                        onClick={() => handleImageClick(msg.image_fullview!)}
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

      {mediaPreviewUrl && (
        <Box
          p={1}
          mb={1}
          display="flex"
          alignItems="center"
          border="1px solid #ccc"
          borderRadius={1}
          bgcolor="#fafafa"
        >
          {mediaFile?.type.startsWith("video") ? (
            <video
              src={mediaPreviewUrl}
              style={{ maxHeight: 80, maxWidth: 120, borderRadius: 8 }}
              controls
            />
          ) : (
            <img
              src={mediaPreviewUrl}
              alt="preview"
              style={{ maxHeight: 80, maxWidth: 120, borderRadius: 8 }}
            />
          )}
          <IconButton
            size="small"
            onClick={() => {
              setMediaFile(null);
              if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
              setMediaPreviewUrl(null);
            }}
            sx={{ ml: 1 }}
          >
            <FaTimes />
          </IconButton>
        </Box>
      )}

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
            const file = e.target.files?.[0];
            if (file) {
              setMediaFile(file);
              if (mediaPreviewUrl) {
                URL.revokeObjectURL(mediaPreviewUrl);
              }
              setMediaPreviewUrl(URL.createObjectURL(file));
              e.target.value = "";
            }
          }}
        />
        <label htmlFor="media-upload">
          <IconButton
            color={mediaFile ? "primary" : "default"}
            component="span"
            sx={{ ml: 1 }}
          >
            <FaImage />
          </IconButton>
        </label>
        <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
          <FaPaperPlane />
        </IconButton>
      </Box>

      <Dialog open={openImageDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogContent sx={{ p: 0 }}>
          {dialogImageSrc && (
            <img
              src={dialogImageSrc}
              alt="full view"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ChatWindow;
