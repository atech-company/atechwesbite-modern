import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { usePageContent, useProjectsList } from '@/hooks/use-content';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { useState } from 'react';

const Projects = () => {
  const { data, isLoading, error } = useProjectsList();
  const { data: cmsPage } = usePageContent('projects');
  const { user } = useAuth();
  const [, setVersion] = useState(0);
  const projects = data?.projects ?? [];
  const favorites = user ? getFavorites(user.id) : [];
  const merged = (cmsPage?.sections ?? []).reduce<Record<string, unknown>>((acc, section) => {
    Object.assign(acc, section.payload ?? {});
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {String(merged.heroTitle ?? 'Our')} <span className="gradient-text">{String(merged.heroAccent ?? 'Projects')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {String(merged.heroDescription ?? 'Explore our portfolio of successful digital projects and case studies.')}
            </p>
          </div>

          {isLoading && <p className="text-center text-muted-foreground">Loading projects...</p>}
          {error && <p className="text-center text-red-500">Failed to load projects.</p>}

          {!isLoading && !error && (
            projects.length === 0 ? (
              <p className="text-center text-muted-foreground">No projects yet. Add some in the CMS.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <Link key={p.slug} to={`/projects/${p.slug}`}>
                    <Card className="p-6 h-full transition-colors hover:border-primary/50">
                      {p.cover && (
                        <img src={p.cover} alt={p.title} className="w-full h-40 object-cover rounded mb-4" />
                      )}
                      <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{p.summary}</p>
                      {user && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(user.id, p.slug);
                            setVersion((v) => v + 1);
                          }}
                          className="mb-3"
                        >
                          {favorites.includes(p.slug) ? 'Remove Favorite' : 'Add to Favorites'}
                        </Button>
                      )}
                      {p.tags && p.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {p.tags.map((t) => (
                            <span key={t} className="text-xs bg-card border border-border rounded px-2 py-1">{t}</span>
                          ))}
                        </div>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;