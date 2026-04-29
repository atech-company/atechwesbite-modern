import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHomeContent } from '@/hooks/use-content';

const ContactCTA = () => {
  const { data: home } = useHomeContent();
  const phone = String((home as any)?.contactPhone ?? '76349746');
  const email = String((home as any)?.contactEmail ?? 'hello@example.com');
  const whatsapp = String((home as any)?.contactWhatsapp ?? '76349746');

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/20 animate-float" />
      <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-secondary/20 animate-float delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {String((home as any)?.contactCtaTitleLine1 ?? 'Ready to Start Your')}
            <br />
            <span className="gradient-text">{String((home as any)?.contactCtaTitleLine2 ?? 'Digital Journey?')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {String((home as any)?.contactCtaDescription ?? '')}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-effect group px-8 py-4 text-lg"
            asChild
          >
            <Link to="/contact">
              <MessageCircle className="mr-3 h-6 w-6" />
              {String((home as any)?.contactCtaPrimaryLabel ?? 'Get a Free Consultation')}
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg"
            asChild
          >
            <Link to="/projects">{String((home as any)?.contactCtaSecondaryLabel ?? 'View Our Portfolio')}</Link>
          </Button>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-card/50 border border-border hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Call Us</h3>
            <p className="text-muted-foreground mb-3">Let's talk about your project</p>
            <a 
              href={`tel:${phone}`} 
              className="text-primary hover:underline font-medium"
            >
              {phone}
            </a>
          </div>

          <div className="text-center p-6 rounded-xl bg-card/50 border border-border hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email Us</h3>
            <p className="text-muted-foreground mb-3">Send us your requirements</p>
            <a 
              href={`mailto:${email}`} 
              className="text-primary hover:underline font-medium"
            >
              {email}
            </a>
          </div>

          <div className="text-center p-6 rounded-xl bg-card/50 border border-border hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
            <p className="text-muted-foreground mb-3">Quick chat and support</p>
            <a 
              href={`https://wa.me/${whatsapp}`} 
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat with us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;