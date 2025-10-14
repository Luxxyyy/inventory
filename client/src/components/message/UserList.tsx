import React from "react";
import {
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
} from "@mui/material";
import { User as UserType } from "../../services/authService";
import { ConversationItem } from "../../api/conversation_api";

interface UserListProps {
  users: UserType[];
  selectedConversation: ConversationItem | null;
  onUserClick: (user: UserType) => void;
  socket?: any;
  currentUser?: UserType | null;
  unreadCounts?: Record<number, number>;
  setUnreadCounts?: (fn: (prev: Record<number, number>) => Record<number, number>) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  selectedConversation,
  onUserClick,
  socket,
  currentUser,
  unreadCounts = {},
  setUnreadCounts,
}) => {
  return (
    <List>
      {users.map((user) => {
        const isSelected =
          selectedConversation
            ? (selectedConversation.user1_id === user.id ||
                selectedConversation.user2_id === user.id) &&
              selectedConversation.user1_id !== selectedConversation.user2_id
            : false;

        const unread = unreadCounts[user.id] || 0;

        return (
          <ListItemButton
            key={user.id}
            selected={isSelected}
            onClick={() => {
              onUserClick(user);
              if (setUnreadCounts) {
                setUnreadCounts((prev) => ({ ...prev, [user.id]: 0 }));
              }
              socket?.emit?.("mark_user_read", { userId: currentUser?.id, fromUserId: user.id });
            }}
          >
            <ListItemAvatar>
              <Avatar src={user.image || undefined}>
                {!user.image && user.username[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{user.username}</span>
                  {unread > 0 && (
                    <Badge badgeContent={unread} color="primary" />
                  )}
                </div>
              }
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default UserList;
