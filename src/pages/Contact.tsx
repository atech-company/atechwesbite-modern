import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePageContent } from '@/hooks/use-content';

const Contact = () => {
  const { toast } = useToast();
  const { data: cmsPage } = usePageContent('contact');
  const merged = (cmsPage?.sections ?? []).reduce<Record<string, unknown>>((acc, section) => {
    Object.assign(acc, section.payload ?? {});
    return acc;
  }, {});
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000';
  const WHATSAPP_NUMBER = '76349746';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    budget: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/contact`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send contact request');
      }

      const data = (await response.json()) as { whatsapp_url?: string };
      toast({
        title: "Message sent successfully!",
        description: "Email sent. WhatsApp chat will open now.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
        budget: ''
      });

      const waUrl = data.whatsapp_url ?? `https://wa.me/${WHATSAPP_NUMBER}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      toast({
        title: 'Failed to send message',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      value: "atech@atechleb.com",
      description: "Send us an email anytime",
      action: "mailto:atech@atechleb.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+961 76 349 746",
      description: "Mon-Fri 9AM-6PM LB",
      action: "tel:+96176349746"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "76349746",
      description: "Quick chat on WhatsApp",
      action: "https://wa.me/76349746"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Beiruth, LB",
      description: "Schedule an appointment",
      action: "#"
    }
  ];

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
                {String(merged.heroTitle ?? 'Contact')} <span className="gradient-text">{String(merged.heroAccent ?? 'A TECH')}</span>
              </h1>
              <p className="text-xl text-muted-foreground animate-fade-in-up">
                {String(merged.heroDescription ?? "Ready to start your project? Get in touch with our team and let's build something amazing together.")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  className="p-6 bg-card/50 backdrop-blur-sm border border-border rounded-2xl hover:bg-card smooth-transition hover:scale-105 group"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-primary to-secondary glow-effect group-hover:scale-110 smooth-transition">
                      <method.icon className="h-6 w-6 text-background" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{method.title}</h3>
                      <p className="text-primary font-medium">{method.value}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    Let's Start a <span className="gradient-text">Conversation</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-card/50 border-border"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-card/50 border-border"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-card/50 border-border"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="bg-card/50 border-border"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="service">Service Needed</Label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a service</option>
                        <option value="web-development">Web Development</option>
                        <option value="mobile-app">Mobile App Development</option>
                        <option value="ui-ux-design">UI/UX Design</option>
                        <option value="custom-systems">Custom Systems</option>
                        <option value="consultation">Consultation</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select budget range</option>
                        <option value="5k-10k">$5k - $10k</option>
                        <option value="10k-25k">$10k - $25k</option>
                        <option value="25k-50k">$25k - $50k</option>
                        <option value="50k+">$50k+</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Project Details *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="bg-card/50 border-border"
                      placeholder="Tell us about your project, goals, and any specific requirements..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-effect py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Map & Additional Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Our Location</h3>
                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-2">Beirut, LB</h4>
                      <p className="text-muted-foreground">Heart of Innovation</p>
                      <p className="text-muted-foreground">Virtual meetings available worldwide</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-4">Why Choose A TECH?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Expert team with 8+ years experience</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Latest technologies and best practices</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">24-hour response time guarantee</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Ongoing support and maintenance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;