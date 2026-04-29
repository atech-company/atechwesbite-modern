import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [saved, setSaved] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ username, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-sm block mb-1">Display name</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm block mb-1">Avatar URL</label>
                <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} />
              </div>
              <Button type="submit">Save Profile</Button>
              {saved && <p className="text-sm text-green-500">Profile updated.</p>}
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
