import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Smartphone, 
  Palette, 
  Settings, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react';
import { useHomeContent } from '@/hooks/use-content';

const iconMap = {
  Code,
  Smartphone,
  Palette,
  Settings,
};

type IconName = keyof typeof iconMap;

const ServicesSection = () => {
  const { data } = useHomeContent();

  const services = useMemo(() => data?.services ?? [], [data]);

  const [activeService, setActiveService] = useState(0);
  if (services.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-background via-card/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Services</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const IconComponent = iconMap[(service.icon ?? 'Code') as IconName] ?? Code;
            return (
              <Card
                key={index}
                className={`
                p-6 cursor-pointer transition-all duration-300 hover-scale
                ${activeService === index 
                  ? 'border-primary/50 glow-effect' 
                  : 'border-border hover:border-primary/30'
                }
              `}
                onClick={() => setActiveService(index)}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-${service.colorFrom} to-${service.colorTo} flex items-center justify-center`}>
                  <IconComponent className={`h-8 w-8`} />
                </div>
                <h3 className="text-xl font-bold text-center mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-center text-sm">
                  {service.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Active Service Details */}
        <Card className="p-8 bg-gradient-to-r from-card to-card/50 border-primary/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-6">
                {(() => {
                  const active = services[activeService];
                  const IconComponent = iconMap[(active.icon ?? 'Code') as IconName] ?? Code;
                  return (
                    <>
                      <div className={`w-20 h-20 rounded-xl bg-gradient-to-br from-${active.colorFrom} to-${active.colorTo} flex items-center justify-center mr-4`}>
                        <IconComponent className={`h-10 w-10 opacity-90`} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold gradient-text">
                          {active.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {active.description}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              <ul className="space-y-3 mb-6">
                {services[activeService].features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 group"
                asChild
              >
                <a href="/services">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>

            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                {(() => {
                  const IconComponent = iconMap[(services[activeService].icon ?? 'Code') as IconName] ?? Code;
                  return <IconComponent className={`h-24 w-24 opacity-50`} />;
                })()}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ServicesSection;