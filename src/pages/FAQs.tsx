import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageCircle, Clock, DollarSign, Palette, Code, Smartphone } from 'lucide-react';
import { usePageContent } from '@/hooks/use-content';

const FAQs = () => {
  const { data: cmsPage } = usePageContent('faqs');
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

  const faqCategories = parseArray<any>(merged.faqCategories).map((category) => ({
    ...category,
    icon:
      category.icon === 'Clock' ? Clock :
      category.icon === 'DollarSign' ? DollarSign :
      category.icon === 'Palette' ? Palette :
      category.icon === 'Code' ? Code :
      category.icon === 'Smartphone' ? Smartphone :
      MessageCircle,
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
              <p className="text-xl text-muted-foreground animate-fade-in-up">
                {String(merged.heroDescription ?? '')}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 max-w-4xl mx-auto">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-secondary glow-effect">
                      <category.icon className="h-6 w-6 text-background" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                      {category.title}
                    </h2>
                  </div>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem 
                        key={faqIndex} 
                        value={`${categoryIndex}-${faqIndex}`}
                        className="bg-card/50 backdrop-blur-sm border border-border rounded-xl px-6 hover:bg-card/70 smooth-transition"
                      >
                        <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary py-6 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="text-center mt-20 p-12 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm rounded-2xl border border-border card-shadow">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Still have <span className="gradient-text">questions?</span>
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our team is here to help! Get in touch with us for personalized answers and to discuss your project needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold glow-effect hover:opacity-90 smooth-transition"
                >
                  Contact Us
                </a>
                <a
                  href="mailto:hello@atech.com"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card smooth-transition"
                >
                  Send Email
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

export default FAQs;