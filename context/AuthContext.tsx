"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { RoleType, UserSession, hasPermission, Permission } from "@/lib/rbac";
import { MOCK_USERS } from "@/lib/mock-data";

interface AuthContextType {
  currentUser: UserSession;
  activeRole: RoleType;
  switchRole: (role: RoleType) => void;
  can: (permission: Permission) => boolean;
}

const defaultUser: UserSession = {
  id: "usr-manager",
  name: "Hendra Wijaya, S.E.",
  email: "manager@unimerchant.id",
  role: "MANAGER",
  department: "Executive Management",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
};

const AuthContext = createContext<AuthContextType>({
  currentUser: defaultUser,
  activeRole: "MANAGER",
  switchRole: () => {},
  can: () => true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<RoleType>("MANAGER");
  const [currentUser, setCurrentUser] = useState<UserSession>(defaultUser);

  // Sync user with active role
  const switchRole = (role: RoleType) => {
    setActiveRole(role);
    const matchedUser = MOCK_USERS.find((u) => u.role === role);
    if (matchedUser) {
      setCurrentUser({
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        department: matchedUser.department,
        avatarUrl: matchedUser.avatarUrl,
      });
    }
  };

  const can = (permission: Permission): boolean => {
    return hasPermission(activeRole, permission);
  };

  return (
    <AuthContext.Provider value={{ currentUser, activeRole, switchRole, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
