import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { CURRENT_USER, DEMO_USERS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => Promise<boolean>;
  signup: (userData: { username: string; fullName: string; email: string; password?: string }) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  allDemoUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'aurora_active_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.id) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return CURRENT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [allDemoUsers, setAllDemoUsers] = useState<UserProfile[]>(DEMO_USERS);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  // If Supabase is configured, listen to auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    const checkUser = async () => {
      const { data: { session } } = await client.auth.getSession();
      if (session?.user) {
        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser({
            id: profile.id,
            username: profile.username,
            fullName: profile.full_name,
            avatarUrl: profile.avatar_url,
            bannerUrl: profile.banner_url,
            bio: profile.bio,
            website: profile.website,
            location: profile.location,
            isVerified: profile.is_verified,
            followersCount: profile.followers_count || 0,
            followingCount: profile.following_count || 0,
            postsCount: profile.posts_count || 0,
            isOnline: true,
          });
          setIsAuthenticated(true);
        }
      }
    };

    checkUser();

    const { data: authListener } = client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email?: string, password?: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase && email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Supabase Login error:', error.message);
        return false;
      }
      setIsAuthenticated(true);
      return true;
    }

    // Demo Mode login fallback
    setIsAuthenticated(true);
    return true;
  };

  const signup = async (userData: { username: string; fullName: string; email: string; password?: string }): Promise<boolean> => {
    if (isSupabaseConfigured && supabase && userData.email && userData.password) {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.fullName,
          }
        }
      });
      if (error) {
        console.error('Supabase Signup error:', error.message);
        return false;
      }
      setIsAuthenticated(true);
      return true;
    }

    // Local Demo Signup
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      username: userData.username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      fullName: userData.fullName,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80`,
      bannerUrl: `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80`,
      bio: 'New pioneer on Aurora. Ready to connect and inspire! 🌌✨',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      isVerified: false,
      isOnline: true,
      joinedDate: 'Joined Just Now',
    };

    setCurrentUser(newUser);
    setAllDemoUsers(prev => [newUser, ...prev]);
    setIsAuthenticated(true);
    return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
  };

  const switchDemoUser = (userId: string) => {
    const targetUser = allDemoUsers.find(u => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      setIsAuthenticated(true);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updates,
    }));

    setAllDemoUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );

    // Sync to Supabase if available
    if (isSupabaseConfigured && supabase) {
      supabase.from('profiles').update({
        full_name: updates.fullName,
        bio: updates.bio,
        website: updates.website,
        location: updates.location,
        avatar_url: updates.avatarUrl,
        banner_url: updates.bannerUrl,
      }).eq('id', currentUser.id).then();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        signup,
        logout,
        switchDemoUser,
        updateProfile,
        allDemoUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
