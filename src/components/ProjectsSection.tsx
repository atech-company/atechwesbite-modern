import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHomeContent, useProjectsList } from '@/hooks/use-content';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const ProjectsSection = () => {
  const { data: home } = useHomeContent();
  const { data, isLoading, error } = useProjectsList();
  const projects = data?.projects ?? [];
  const chunks = projects.reduce<Array<typeof projects>>((acc, _, idx) => {
    if (idx % 4 === 0) acc.push(projects.slice(idx, idx + 4));
    return acc;
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {String((home as any)?.projectsSectionTitle ?? 'Projects')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {String((home as any)?.projectsSectionDescription ?? '')}
          </p>
        </div>

        {isLoading && <p className="text-center text-muted-foreground mb-12">Loading projects...</p>}
        {error && <p className="text-center text-red-500 mb-12">Failed to load projects.</p>}

        {!isLoading && !error && (
          projects.length === 0 ? (
            <p className="text-center text-muted-foreground mb-12">No projects published yet.</p>
          ) : (
            <Carousel opts={{ align: 'start' }} className="mb-12 px-10 md:px-12">
              <CarouselContent>
                {chunks.map((group, slideIndex) => (
                  <CarouselItem key={`slide-${slideIndex}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {group.map((project) => (
                        <Link key={project.slug} to={`/projects/${project.slug}`}>
                          <Card className="overflow-hidden group cursor-pointer hover-scale transition-all duration-300 hover:border-primary/50">
                            <div className="relative h-48 overflow-hidden">
                              {project.cover ? (
                                <img
                                  src={project.cover}
                                  alt={project.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted/40" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-6">
                              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {project.title}
                              </h3>
                              <p className="text-muted-foreground mb-4">
                                {project.summary}
                              </p>
                              {project.tags && project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {project.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="text-xs border-primary/30 text-primary"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          )
        )}

        {/* View All Projects Button */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 group"
            asChild
          >
            <Link to="/projects">
              {String((home as any)?.projectsSectionButtonLabel ?? 'View All Projects')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;