import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { usePageContent } from '@/hooks/use-content';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  TrendingUp, 
  Globe, 
  Lightbulb,
  Code,
  Palette,
  Smartphone,
  Shield
} from 'lucide-react';

const About = () => {
  const { data: cmsPage } = usePageContent('about');
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

  const stats = parseArray<{ number: string; label: string; icon?: string }>(merged.stats).map((s) => ({
    ...s,
    icon:
      s.icon === 'Users' ? Users :
      s.icon === 'TrendingUp' ? TrendingUp :
      s.icon === 'Shield' ? Shield :
      Award,
  }));

  const timeline = parseArray<{ year: string; title: string; description: string }>(merged.timeline);

  const team = parseArray<{ name: string; role: string; speciality: string; icon?: string; description: string }>(merged.team).map((m) => ({
    ...m,
    icon:
      m.icon === 'Palette' ? Palette :
      m.icon === 'Smartphone' ? Smartphone :
      m.icon === 'Target' ? Target :
      Code,
  }));

  const values = parseArray<{ icon?: string; title: string; description: string }>(merged.values).map((v) => ({
    ...v,
    icon:
      v.icon === 'Heart' ? Heart :
      v.icon === 'Users' ? Users :
      v.icon === 'Globe' ? Globe :
      Lightbulb,
  }));

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
              <p className="text-xl text-muted-foreground animate-fade-in-up max-w-3xl mx-auto">
                {String(merged.heroDescription ?? '')}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-card/50 backdrop-blur-sm border border-border rounded-2xl hover:bg-card/70 smooth-transition">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-primary to-secondary glow-effect mb-4">
                    <stat.icon className="h-6 w-6 text-background" />
                  </div>
                  <div className="text-3xl font-bold gradient-text">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-secondary glow-effect">
                    <Target className="h-6 w-6 text-background" />
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">{String(merged.missionTitle ?? '')}</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {String(merged.missionText ?? '')}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-secondary glow-effect">
                    <Eye className="h-6 w-6 text-background" />
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">{String(merged.visionTitle ?? '')}</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {String(merged.visionText ?? '')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-card/20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {String(merged.timelineTitle ?? '')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {String(merged.timelineDescription ?? '')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary to-secondary"></div>
                
                {timeline.map((item, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-12`}>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-card/70 smooth-transition">
                        <Badge variant="outline" className="border-primary/30 text-primary mb-3">
                          {item.year}
                        </Badge>
                        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background glow-effect"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {String(merged.teamTitle ?? '')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {String(merged.teamDescription ?? '')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 text-center hover:bg-card/70 smooth-transition hover:scale-105">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-primary to-secondary glow-effect mb-6">
                    <member.icon className="h-8 w-8 text-background" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <Badge variant="outline" className="border-secondary/30 text-secondary mb-4">
                    {member.speciality}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-card/20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {String(merged.valuesTitle ?? '')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {String(merged.valuesDescription ?? '')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center p-6 bg-card/50 backdrop-blur-sm border border-border rounded-2xl hover:bg-card/70 smooth-transition hover:scale-105">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-primary to-secondary glow-effect mb-6">
                    <value.icon className="h-6 w-6 text-background" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
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
                {String(merged.ctaTitle ?? '')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {String(merged.ctaDescription ?? '')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold glow-effect hover:opacity-90 smooth-transition"
                >
                  {String(merged.ctaPrimaryLabel ?? '')}
                </a>
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card smooth-transition"
                >
                  {String(merged.ctaSecondaryLabel ?? '')}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;