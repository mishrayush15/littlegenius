
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Admin credentials - would normally come from a secure database
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";
// Use a valid email format for Supabase
const ADMIN_EMAIL = "ayushmishra@gmail.com";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple hardcoded authentication
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try {
        // Sign in with Supabase using a valid email format
        const { data, error } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: password,
        });
        
        if (error) {
          console.error("Supabase auth error:", error);
          
          // If the user doesn't exist in Supabase yet, sign them up
          if (error.message.includes("Invalid login credentials")) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: ADMIN_EMAIL,
              password: password,
            });
            
            if (signUpError) {
              console.error("Supabase signup error:", signUpError);
              return false;
            }
            
            // Successfully signed up, now sign in
            const { error: secondSignInError } = await supabase.auth.signInWithPassword({
              email: ADMIN_EMAIL,
              password: password,
            });
            
            if (secondSignInError) {
              console.error("Second sign-in error:", secondSignInError);
              return false;
            }
          } else {
            return false;
          }
        }
        
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        return true;
      } catch (error) {
        console.error("Authentication error:", error);
        return false;
      }
    }
    return false;
  };

  const logout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  // Check if user was previously authenticated
  useEffect(() => {
    const checkAuth = async () => {
      // Check localStorage first for quick UI response
      const storedAuth = localStorage.getItem("isAuthenticated");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
      }

      // Then verify with Supabase
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
      } else if (storedAuth === "true") {
        // If localStorage says we're authenticated but Supabase disagrees,
        // clear localStorage to stay in sync
        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
