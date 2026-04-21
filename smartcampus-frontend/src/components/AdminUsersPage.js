import React, { useEffect, useState } from "react";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:9090/api/admin/users", {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await fetch(`http://localhost:9090/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role }),
      });

      loadUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "30px auto",
        padding: "0 20px 40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "18px",
          padding: "24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          border: "1px solid #e8edf5",
        }}
      >
        <h2 style={{ margin: "0 0 8px 0", fontSize: "34px", color: "#0f2345" }}>
           Admin Users
        </h2>
        <p style={{ margin: "0 0 24px 0", color: "#6b7280" }}>
          Manage user roles for the Smart Campus system.
        </p>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "18px",
                  background: "#f8fafc",
                }}
              >
                <h3 style={{ margin: "0 0 8px 0", color: "#13294b" }}>
                  {user.name}
                </h3>
                <p style={{ margin: "0 0 8px 0" }}>{user.email}</p>
                <p style={{ margin: "0 0 14px 0", fontWeight: "700" }}>
                  Role: {user.role}
                </p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button onClick={() => updateRole(user.id, "USER")}>USER</button>
                  <button onClick={() => updateRole(user.id, "TECHNICIAN")}>
                    TECHNICIAN
                  </button>
                  <button onClick={() => updateRole(user.id, "ADMIN")}>ADMIN</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;