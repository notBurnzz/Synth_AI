import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { useAuth0 } from "@auth0/auth0-react";

export function Sidebar({ messages = [], setMessages = () => {} }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // ✅ Get Auth0 authentication functions
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <aside
      className={`${styles.Sidebar} ${isExpanded ? styles.Expanded : styles.Collapsed}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* 🔹 Chat History Section */}
      <div className={styles.TopSection}>
        <h3 className={styles.SidebarTitle}>{isExpanded ? "Chat History" : "CH"}</h3>
        {messages.length === 0 ? (
          <p className={styles.EmptyMessage}>No chats</p>
        ) : (
          <ul className={styles.ChatList}>
            {messages.map((chat) => (
              <li
                key={chat.id}
                className={styles.ChatItem}
                onClick={() => setMessages([chat])}
              >
                {isExpanded && <span className={styles.ModelName}>{chat.model}</span>}
                <span className={styles.Timestamp}>
                  {new Date(chat.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔹 User Authentication Section */}
      <div className={styles.BottomSection}>
        {isAuthenticated ? (
          <div
            className={styles.UserInfo}
            onMouseEnter={() => setIsDropdownVisible(true)}
            onMouseLeave={() => setIsDropdownVisible(false)}
          >
            <img
              className={styles.UserAvatar}
              src={user.picture || "/default-avatar.png"}
              alt="User Avatar"
            />
            {isExpanded && (
              <span className={styles.UserEmail} title={user.email}>
                {user.email}
              </span>
            )}

            {/* 🔹 Dropdown for Logout */}
            {isDropdownVisible && (
              <div className={styles.Dropdown}>
                <button
                  className={styles.DropdownButton}
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className={styles.AuthButton} onClick={() => loginWithRedirect()}>
            {isExpanded ? "Login with Auth0" : "Login"}
          </button>
        )}
      </div>
    </aside>
  );
}
