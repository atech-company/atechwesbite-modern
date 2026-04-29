import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <TestimonialsSection />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;