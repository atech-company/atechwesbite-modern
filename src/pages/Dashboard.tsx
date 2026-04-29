import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/use-auth';
import { Navigate, Link } from 'react-router-dom';
import { useMyTestimonials, useProjectsList } from '@/hooks/use-content';
import { getFavorites } from '@/lib/favorites';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: projectsData } = useProjectsList();
  const { data: myTestimonials } = useMyTestimonials(user?.email);

  if (!user) return <Navigate to="/login" replace />;

  const favoriteSlugs = getFavorites(user.id);
  const favoriteProjects = (projectsData?.projects ?? []).filter((p) => favoriteSlugs.includes(p.slug));

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <Link to="/profile" className="text-primary hover:underline">Edit Profile</Link>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Favorite Projects</h2>
            {favoriteProjects.length === 0 ? (
              <p className="text-muted-foreground">No favorites yet.</p>
            ) : (
              <div className="space-y-2">
                {favoriteProjects.map((project) => (
                  <Link key={project.slug} to={`/projects/${project.slug}`} className="block hover:text-primary">
                    {project.title}
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">My Testimonials</h2>
            {(myTestimonials?.testimonials ?? []).length === 0 ? (
              <p className="text-muted-foreground">You have not submitted feedback yet.</p>
            ) : (
              <div className="space-y-4">
                {myTestimonials?.testimonials.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <p className="mb-2">{item.content}</p>
                    <p className="text-sm text-muted-foreground">
                      Rating: {item.rating}/5 - {item.isApproved ? 'Approved' : 'Pending approval'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
