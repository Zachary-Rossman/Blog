"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// =====================================================
// AUTHENTICATED USER TYPE
// =====================================================
// This represents the minimal user information that the
// frontend needs after authentication.
//
// The backend returns this information from /api/me after
// verifying the user's JWT.
//
// NOTE:
// Never store sensitive information (passwords, tokens,
// etc.) in frontend state.
// =====================================================

type User = {
  id: string;
  username: string;
  email: string;
};

// =====================================================
// AUTH CONTEXT TYPE
// =====================================================
// This defines everything that components can access
// through the authentication context.
//
// user
// The currently logged-in user.
//
// loading
// True only during the initial authentication check
// when the application first loads.
//
// refreshing
// True whenever refreshUser() is manually called after
// login, logout, or another authentication event.
//
// refreshUser()
// Re-fetches the currently authenticated user from the
// backend.
// =====================================================

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshing: boolean;
  refreshUser: () => Promise<void>;
};

// =====================================================
// AUTH CONTEXT
// =====================================================
// createContext() creates a shared piece of state that
// any component can access without passing props through
// every intermediate component.
//
// We initialize with undefined so useAuth() can throw a
// helpful error if used outside the provider.
// =====================================================

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// =====================================================
// AUTH PROVIDER
// =====================================================
// Wraps the application and manages authentication state.
//
// Responsibilities:
//
// • Store the current authenticated user
// • Check authentication on initial page load
// • Allow any component to refresh authentication
// • Expose authentication state throughout the app
//
// This component should wrap the application once inside
// the root layout.
// =====================================================

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ---------------------------------------------------
  // Current authenticated user.
  // Null means no user is logged in.
  // ---------------------------------------------------

  const [user, setUser] = useState<User | null>(null);

  // ---------------------------------------------------
  // loading
  //
  // Used ONLY during the initial authentication check
  // when the application first loads.
  // ---------------------------------------------------

  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------
  // refreshing
  //
  // Used whenever authentication is refreshed later,
  // such as after login or logout.
  //
  // Keeping this separate prevents the entire app from
  // returning to a "loading" state unnecessarily.
  // ---------------------------------------------------

  const [refreshing, setRefreshing] = useState(false);

  // ===================================================
  // REFRESH AUTHENTICATED USER
  // ===================================================
  // Retrieves the currently authenticated user from the
  // backend.
  //
  // The backend checks the JWT stored in the user's
  // cookies and returns:
  //
  // • User information if authenticated
  // • An error if not authenticated
  //
  // This function is reused after login, logout, or any
  // authentication event to keep frontend state synced
  // with the server.
  // ===================================================

  async function refreshUser() {
    try {
      setRefreshing(true);

      const response = await fetch("/api/me");

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      setUser(data);
    } catch {
      // Any unexpected error is treated as an
      // unauthenticated state.

      setUser(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // ===================================================
  // INITIAL AUTH CHECK
  // ===================================================
  // Runs once when the provider first mounts.
  //
  // This restores the user's session if they already
  // have a valid authentication cookie.
  // ===================================================

  useEffect(() => {
    refreshUser();
  }, []);

  // ===================================================
  // PROVIDE AUTH STATE
  // ===================================================
  // Makes authentication data available to every
  // component wrapped by this provider.
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshing,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// CUSTOM AUTH HOOK
// =====================================================
// Provides easy access to the authentication context.
//
// Example:
//
// const { user, loading } = useAuth();
//
// This also prevents accidental usage outside of the
// AuthProvider by throwing a descriptive error.
// =====================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}