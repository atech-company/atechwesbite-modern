import { Users, Award, Coffee, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useHomeContent } from '@/hooks/use-content';

const AboutSection = () => {
  const { data } = useHomeContent();
  const statsRaw = (data as any)?.aboutStats;
  const stats = Array.isArray(statsRaw)
    ? statsRaw
    : [];

  const title = String((data as any)?.aboutSectionTitle ?? '');
  const description = String((data as any)?.aboutSectionDescription ?? '');
  const missionTitle = String((data as any)?.aboutMissionTitle ?? '');
  const missionText = String((data as any)?.aboutMissionText ?? '');

  const iconMap = {
    Users,
    Award,
    Coffee,
    Clock,
  } as const;

  if (!title && !description && stats.length === 0 && !missionTitle && !missionText) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {title && (
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat: any, index) => {
            const Icon = iconMap[(stat.icon as keyof typeof iconMap) ?? 'Users'] ?? Users;
            return (
            <Card 
              key={index} 
              className="p-6 text-center bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/50 transition-all duration-300 hover-scale"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                {String(stat.value ?? '')}
              </h3>
              <p className="text-muted-foreground text-sm">{String(stat.label ?? '')}</p>
            </Card>
          );
          })}
          </div>
        )}

        {/* Mission Statement */}
        {(missionTitle || missionText) && <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border border-primary/20">
          <div className="text-center">
            {missionTitle && <h3 className="text-2xl md:text-3xl font-bold mb-6 gradient-text">{missionTitle}</h3>}
            {missionText && <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">{missionText}</p>}
          </div>
        </div>}
      </div>
    </section>
  );
};

export default AboutSection;