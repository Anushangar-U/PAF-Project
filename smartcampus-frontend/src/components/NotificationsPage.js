import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9091';

function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = user?.id;

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  const loadNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications/${userId}`);
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/notifications/${id}/read`);
      loadNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  return (
    <div style={{ maxWidth: "1200px", margin: "30px auto", padding: "0 20px 40px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#ffffff", borderRadius: "18px", padding: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", border: "1px solid #e8edf5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "24px" }}>
          <div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "34px", color: "#0f2345" }}>Notifications</h2>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "16px" }}>Track booking updates and important alerts.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ background: unreadCount > 0 ? "#fff4d6" : "#eef2ff", color: unreadCount > 0 ? "#9a6700" : "#23395d", padding: "10px 16px", borderRadius: "999px", fontWeight: "700", fontSize: "14px" }}>
              {unreadCount} unread
            </div>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "14px", padding: "24px", textAlign: "center", color: "#64748b" }}>
            No notifications yet.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {notifications.slice().reverse().map((n) => (
              <div key={n.id} style={{ background: n.read ? "#f8fafc" : "#fffaf0", border: n.read ? "1px solid #e2e8f0" : "1px solid #f4d58d", borderLeft: n.read ? "6px solid #cbd5e1" : "6px solid #f59e0b", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                      <h3 style={{ margin: 0, fontSize: "20px", color: "#13294b" }}>{n.title}</h3>
                      <span style={{ background: n.read ? "#e5e7eb" : "#fef3c7", color: n.read ? "#4b5563" : "#92400e", padding: "6px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "700" }}>{n.read ? "Read" : "Unread"}</span>
                    </div>
                    <p style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#334155" }}>{n.message}</p>
                    <small style={{ color: "#64748b", fontSize: "13px" }}>{formatDate(n.createdAt)}</small>
                  </div>
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} style={{ background: "#ffffff", color: "#0f2345", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", fontWeight: "700", cursor: "pointer", minWidth: "120px" }}>Mark as Read</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;