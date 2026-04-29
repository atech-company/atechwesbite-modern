import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { submitTestimonial, Testimonial } from '@/lib/content';
import { useHomeContent, useTestimonials } from '@/hooks/use-content';
import { useQueryClient } from '@tanstack/react-query';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();
  const { data: home } = useHomeContent();
  const queryClient = useQueryClient();
  const { data } = useTestimonials();
  const [company, setCompany] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const testimonials = data?.testimonials ?? [];

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const prevTestimonial = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !feedback.trim()) return;
    setIsSubmitting(true);

    try {
      await submitTestimonial({
        name: user.username,
        email: user.email,
        role: company.trim() ? `Client at ${company.trim()}` : 'Client',
        avatar: user.avatar,
        content: feedback.trim(),
        rating,
      });
      await queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setCurrentIndex(0);
      setCompany('');
      setFeedback('');
      setRating(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (testimonials.length === 0) return (
    <section className="py-20 bg-gradient-to-br from-card/50 to-background">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        No testimonials configured yet.
      </div>
    </section>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-card/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {String((home as any)?.testimonialsTitle ?? 'Testimonials')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {String((home as any)?.testimonialsDescription ?? '')}
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-gradient-to-r from-card to-card/50 border-primary/20 min-h-[300px] flex items-center">
            <div className="w-full">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-xl md:text-2xl text-center text-foreground mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center">
                <Avatar className="h-16 w-16 mr-4 border-2 border-primary/30">
                  <AvatarImage 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].name} 
                  />
                  <AvatarFallback>
                    {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h4 className="font-bold text-foreground text-lg">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-muted-foreground">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 p-0 border-primary/30 hover:border-primary hover:bg-primary/10"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 p-0 border-primary/30 hover:border-primary hover:bg-primary/10"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-14">
          {user ? (
            <Card className="p-6 space-y-4 border-primary/20">
              <h3 className="text-xl font-semibold">Share your feedback</h3>
              <form className="space-y-4" onSubmit={handleSubmitFeedback}>
                <Input
                  placeholder="Company (optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <Textarea
                  placeholder="Write your testimonial..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="p-1"
                    >
                      <Star className={`h-5 w-5 ${value <= rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Testimonial'}</Button>
              </form>
            </Card>
          ) : (
            <Card className="p-6 text-center text-muted-foreground border-primary/20">
              Please login to share your testimonial.
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;