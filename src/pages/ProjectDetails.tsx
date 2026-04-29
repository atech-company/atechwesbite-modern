import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { useProject } from '@/hooks/use-content';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { isFavorite, toggleFavorite } from '@/lib/favorites';

const ProjectDetails = () => {
  const { slug = '' } = useParams();
  const { data: project, isLoading, error } = useProject(slug);
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isTreeVisible, setIsTreeVisible] = useState(false);
  const [, setRefreshFav] = useState(0);
  const allImages = useMemo(
    () => [project?.cover, ...(project?.gallery ?? [])].filter((img): img is string => Boolean(img)),
    [project?.cover, project?.gallery]
  );
  const formattedTime = project?.publishedAt
    ? new Date(project.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  useEffect(() => {
    setIsTreeVisible(false);
    const timer = window.setTimeout(() => setIsTreeVisible(true), 120);
    return () => window.clearTimeout(timer);
  }, [project?.slug]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-20">
          {isLoading && <p className="text-center text-muted-foreground">Loading project...</p>}
          {error && <p className="text-center text-red-500">Project not found.</p>}

          {!isLoading && !error && project && (
            <article className="max-w-5xl mx-auto">
              <Link to="/projects" className="text-sm text-primary hover:underline">
                Back to projects
              </Link>

              <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4">{project.title}</h1>
              {user && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mb-4"
                  onClick={() => {
                    toggleFavorite(user.id, project.slug);
                    setRefreshFav((v) => v + 1);
                  }}
                >
                  {isFavorite(user.id, project.slug) ? 'Remove Favorite' : 'Add to Favorites'}
                </Button>
              )}
              <p className="text-lg text-muted-foreground mb-3">{project.summary}</p>
              {formattedTime && (
                <p className="text-sm text-muted-foreground mb-6">
                  Project time: {formattedTime}
                </p>
              )}

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {project.cover && (
                <button
                  type="button"
                  onClick={() => setActiveImage(project.cover!)}
                  className="w-full mb-8 text-left"
                >
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="w-full max-h-[520px] object-cover rounded-xl cursor-zoom-in"
                  />
                </button>
              )}

              {project.body && (
                <section className="prose prose-invert max-w-none mb-10">
                  <h2>Details</h2>
                  <p>{project.body}</p>
                </section>
              )}

              {project.tags && project.tags.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-5">Tech Stack Tree</h2>
                  <div className="rounded-xl border border-border/60 bg-card/40 p-5">
                    <div className="text-sm text-muted-foreground mb-4">Project</div>
                    <div className="ml-2 border-l border-primary/30 pl-5 space-y-3">
                      {project.tags.map((tag, idx) => (
                        <div
                          key={tag}
                          className={`relative transition-all duration-500 ${
                            isTreeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                          }`}
                          style={{ transitionDelay: `${idx * 120}ms` }}
                        >
                          <span className="absolute -left-[27px] top-1 h-px w-5 bg-primary/40" />
                          <div className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-sm">
                            {tag}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {project.gallery && project.gallery.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.gallery.map((image, idx) => (
                      <button
                        key={`${image}-${idx}`}
                        type="button"
                        onClick={() => setActiveImage(image)}
                        className="text-left"
                      >
                        <img
                          src={image}
                          alt={`${project.title} gallery ${idx + 1}`}
                          className="w-full h-64 object-cover rounded-lg cursor-zoom-in"
                        />
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </article>
          )}
        </div>
      </main>
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') setActiveImage(null);
          }}
        >
          <div className="w-full max-w-6xl">
            <img
              src={activeImage}
              alt="Project image preview"
              className="w-full max-h-[85vh] object-contain rounded-lg"
            />
            {allImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 md:grid-cols-8 gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(img);
                    }}
                    className={`overflow-hidden rounded border ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-14 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProjectDetails;
