import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';

const Login = () => {
	const { login, signup, loginWithSocial } = useAuth();
	const navigate = useNavigate();
	const [mode, setMode] = useState<'login' | 'signup'>('login');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get('social') === 'error') {
			setError('Social login failed. Please try again.');
			return;
		}

		const provider = params.get('provider');
		const email = params.get('email');
		if (params.get('social') === 'success' && (provider === 'google' || provider === 'github') && email) {
			void loginWithSocial({
				provider,
				email,
				name: params.get('name') ?? undefined,
				avatar: params.get('avatar') ?? undefined,
			}).then(() => navigate('/'));
		}
	}, [loginWithSocial, navigate]);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			if (mode === 'login') await login(username, password);
			else await signup(username, password);
			navigate('/');
		} catch (err: any) {
			setError(err.message || `${mode === 'login' ? 'Login' : 'Signup'} failed`);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<Card className="max-w-md w-full p-6 space-y-4">
				<h1 className="text-2xl font-bold">{mode === 'login' ? 'Login' : 'Sign Up'}</h1>
				<div className="grid grid-cols-2 gap-2">
					<Button type="button" variant={mode === 'login' ? 'default' : 'outline'} onClick={() => { setMode('login'); setError(null); }}>
						Login
					</Button>
					<Button type="button" variant={mode === 'signup' ? 'default' : 'outline'} onClick={() => { setMode('signup'); setError(null); }}>
						Sign Up
					</Button>
				</div>
				{error && <div className="text-sm text-red-500">{error}</div>}
				<form className="space-y-4" onSubmit={onSubmit}>
					<div>
						<label className="block text-sm mb-1">Username</label>
						<Input value={username} onChange={(e) => setUsername(e.target.value)} required />
					</div>
					<div>
						<label className="block text-sm mb-1">Password</label>
						<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					</div>
					<Button type="submit" className="w-full">{mode === 'login' ? 'Login' : 'Create Account'}</Button>
				</form>
				<div className="space-y-2">
					<a href={`${API_BASE_URL}/auth/google/redirect`} className="block">
						<Button type="button" variant="outline" className="w-full gap-2">
							<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
								<path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.7 14.6 2.8 12 2.8 6.9 2.8 2.8 7 2.8 12s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1.1-.2-1.6H12z"/>
								<path fill="#34A853" d="M3.9 7.8l3.2 2.3C7.9 8.3 9.8 6.9 12 6.9c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.7 14.6 2.8 12 2.8c-3.5 0-6.6 2-8.1 5z"/>
								<path fill="#4A90E2" d="M12 21.2c2.5 0 4.6-.8 6.1-2.3l-2.8-2.2c-.8.6-1.8 1.1-3.3 1.1-3.7 0-5.1-2.5-5.4-3.8l-3.2 2.5c1.5 2.9 4.5 4.7 8.6 4.7z"/>
								<path fill="#FBBC05" d="M6.6 14c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L3.4 7.8C2.9 9 2.8 10.5 2.8 12s.1 3 0.6 4.2L6.6 14z"/>
							</svg>
							Continue with Google
						</Button>
					</a>
					<a href={`${API_BASE_URL}/auth/github/redirect`} className="block">
						<Button type="button" variant="outline" className="w-full gap-2"><Github className="h-4 w-4" /> Continue with GitHub</Button>
					</a>
				</div>
			</Card>
		</div>
	);
};

export default Login;
