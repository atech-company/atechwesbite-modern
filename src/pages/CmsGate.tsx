import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { isAdmin } from '@/lib/auth';

const CmsGate = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAdmin(user)) {
			window.location.href = '/cms-admin/index.html';
		} else {
			navigate('/login', { replace: true });
		}
	}, [user, navigate]);

	return null;
};

export default CmsGate;
