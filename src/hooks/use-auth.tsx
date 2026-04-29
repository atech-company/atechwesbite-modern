import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthUser, getCurrentUser, login as loginFn, loginWithSocial as loginWithSocialFn, logout as logoutFn, seedDefaultAdmin, signup as signupFn, updateUserProfile as updateUserProfileFn } from '@/lib/auth';

 type AuthContextValue = {
	user: AuthUser | null;
	login: (username: string, password: string) => Promise<void>;
	signup: (username: string, password: string) => Promise<void>;
	loginWithSocial: (profile: { provider: "google" | "github"; email: string; name?: string; avatar?: string }) => Promise<void>;
	updateProfile: (payload: { username?: string; avatar?: string }) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		seedDefaultAdmin();
		setUser(getCurrentUser());
	}, []);

	const login = async (username: string, password: string) => {
		const u = loginFn(username, password);
		setUser(u);
	};

	const signup = async (username: string, password: string) => {
		const u = signupFn(username, password);
		setUser(u);
	};

	const loginWithSocial = async (profile: { provider: "google" | "github"; email: string; name?: string; avatar?: string }) => {
		const u = loginWithSocialFn(profile);
		setUser(u);
	};

	const updateProfile = async (payload: { username?: string; avatar?: string }) => {
		if (!user) return;
		const updated = updateUserProfileFn(user.id, payload);
		if (updated) setUser(updated);
	};

	const logout = () => {
		logoutFn();
		setUser(null);
	};

	const value = useMemo(() => ({ user, login, signup, loginWithSocial, updateProfile, logout }), [user]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
