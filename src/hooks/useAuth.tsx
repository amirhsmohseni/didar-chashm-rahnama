
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any;
  userRole: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  refreshAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  userRole: null,
  isLoading: true,
  isAdmin: false,
  refreshAuth: async () => {},
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserRole = async (userId: string) => {
    try {
      // Security enhancement: Multiple validation layers
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('Error fetching role:', roleError);
        setUserRole('user');
        return;
      }

      const role = roleData?.role || 'user';
      
      // Additional security check: Verify admin role with server-side function
      if (role === 'admin') {
        try {
          const { data: hasAdminRole, error: checkError } = await supabase
            .rpc('has_role', { _user_id: userId, _role: 'admin' });
          
          if (checkError) {
            console.error('Error verifying admin role:', checkError);
            setUserRole('user');
            return;
          }
          
          setUserRole(hasAdminRole ? 'admin' : 'user');
        } catch (error) {
          console.error('Admin role verification failed:', error);
          setUserRole('user');
        }
      } else {
        setUserRole(role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user');
    }
  };

  const refreshAuth = async () => {
    if (user) {
      await fetchUserProfile(user.id);
      await fetchUserRole(user.id);
    }
  };

  const signOut = async () => {
    try {
      // Security audit: Log logout
      if (user) {
        try {
          await supabase.rpc('log_admin_activity', {
            action_name: 'user_logout',
            resource_type_name: 'auth',
            details_data: { 
              logout_time: new Date().toISOString(),
              user_id: user.id
            }
          });
        } catch (logError) {
          console.warn('Failed to log logout:', logError);
        }
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      // Clear all local state
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserRole(null);
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Enhanced auth state listener with security checks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        // Security enhancement: Log auth events
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            await supabase.rpc('log_admin_activity', {
              action_name: 'user_login',
              resource_type_name: 'auth',
              details_data: { 
                login_time: new Date().toISOString(),
                user_id: session.user.id,
                login_method: 'email_password'
              }
            });
          }
        } catch (logError) {
          console.warn('Failed to log auth event:', logError);
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && mounted) {
          // Use setTimeout to prevent auth state callback deadlocks
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(session.user.id);
              fetchUserRole(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
          setUserRole(null);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Initial session check with enhanced security
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Initial session check error:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          setSession(session);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          await fetchUserRole(session.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      userRole, 
      isLoading, 
      isAdmin,
      refreshAuth,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
