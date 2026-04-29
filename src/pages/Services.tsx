import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePageContent } from '@/hooks/use-content';
import { 
  Code, 
  Smartphone, 
  Palette, 
  Settings, 
  Check, 
  ArrowRight, 
  Zap,
  Shield,
  Clock,
  Users,
  Star,
  TrendingUp
} from 'lucide-react';

const Services = () => {
  const { data: cmsPage } = usePageContent('services');
  const merged = (cmsPage?.sections ?? []).reduce<Record<string, unknown>>((acc, section) => {
    Object.assign(acc, section.payload ?? {});
    return acc;
  }, {});
  const parseArray = <T,>(value: unknown): T[] => {
    if (Array.isArray(value)) return value as T[];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? (parsed as T[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const services = parseArray<any>(merged.services);

  const whyChooseUs = parseArray<{ icon?: string; title: string; description: string }>(merged.whyChooseUs).map((item) => ({
    ...item,
    icon:
      item.icon === 'Shield' ? Shield :
      item.icon === 'Clock' ? Clock :
      item.icon === 'Users' ? Users :
      item.icon === 'Star' ? Star :
      item.icon === 'TrendingUp' ? TrendingUp :
      Zap,
  }));

  const iconMap: Record<string, any> = {
    Code,
    Smartphone,
    Palette,
    Settings,
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
                {String(merged.heroTitle ?? '')} <span className="gradient-text">{String(merged.heroAccent ?? '')}</span>
              </h1>
              <p className="text-xl text-muted-foreground animate-fade-in-up">
                {String(merged.heroDescription ?? '')}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {services.length === 0 && (
              <p className="text-center text-muted-foreground mb-10">No services configured in CMS yet.</p>
            )}
            <div className="space-y-20">
              {services.map((service, index) => (
                <div key={index} className="max-w-7xl mx-auto">
                  {(() => {
                    const ServiceIcon = iconMap[service.icon as string] ?? Code;
                    return (
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                    {/* Service Info */}
                    <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-secondary glow-effect">
                          <ServiceIcon className="h-8 w-8 text-background" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                          {service.title}
                        </h2>
                      </div>
                      
                      <p className="text-lg text-muted-foreground">
                        {service.description}
                      </p>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Key Features:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-3">
                              <Check className="h-5 w-5 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Technologies:</h3>
                        <div className="flex flex-wrap gap-2">
                          {service.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="border-primary/30 text-primary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-effect">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    {/* Pricing Cards */}
                    <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                      <div className="grid gap-6">
                        {Object.entries(service.pricing).map(([plan, details], planIndex) => (
                          <div key={planIndex} className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-card/70 smooth-transition">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-lg font-semibold capitalize">{plan}</h4>
                                <p className="text-sm text-muted-foreground">{details.duration}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary">{details.price}</div>
                                <div className="text-sm text-muted-foreground">starting from</div>
                              </div>
                            </div>
                            <ul className="space-y-2">
                              {details.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center gap-2 text-sm">
                                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span className="text-muted-foreground">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-card/20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose <span className="gradient-text">A TECH?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We combine technical excellence with creative innovation to deliver solutions that drive real business results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="text-center p-6 bg-card/50 backdrop-blur-sm border border-border rounded-2xl hover:bg-card/70 smooth-transition hover:scale-105">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-primary to-secondary glow-effect mb-6">
                    <item.icon className="h-6 w-6 text-background" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto p-12 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm rounded-2xl border border-border card-shadow">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your <span className="gradient-text">Project?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Let's discuss your project requirements and create a custom solution that exceeds your expectations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-effect">
                  Get Free Quote
                </Button>
                <Button size="lg" variant="outline" className="border-border hover:bg-card">
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;