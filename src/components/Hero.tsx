import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Smartphone, Palette, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBackground from '@/assets/hero-background.jpg';
import { useHomeContent } from '@/hooks/use-content';

const Hero = () => {
	const { data } = useHomeContent();

	const heading1 = data?.heroHeading1 ?? '';
	const heading2 = data?.heroHeading2 ?? '';
	const subtitle = data?.heroSubtitle ?? '';
	const ctas = data?.heroCtas ?? [];
	const serviceIcons = data?.serviceIcons ?? [];

	const renderIcon = (name: 'Code' | 'Smartphone' | 'Palette' | 'Settings') => {
		switch (name) {
			case 'Code':
				return <Code className="h-8 w-8 text-primary" />;
			case 'Smartphone':
				return <Smartphone className="h-8 w-8 text-secondary" />;
			case 'Palette':
				return <Palette className="h-8 w-8 text-accent" />;
			case 'Settings':
				return <Settings className="h-8 w-8 text-primary" />;
		}
	};

	return (
		<section className="min-h-screen flex items-center justify-center relative overflow-hidden">
			{/* Background Image with Overlay */}
			<div 
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{ backgroundImage: `url(${heroBackground})` }}
			/>
			<div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-transparent" />
			
			{/* Floating Elements */}
			<div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 animate-float" />
			<div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-secondary/20 animate-float delay-1000" />
			<div className="absolute bottom-40 left-20 w-24 h-24 rounded-full bg-accent/20 animate-float delay-2000" />

			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center max-w-4xl mx-auto">
					{/* Main Heading */}
					{(heading1 || heading2) && (
						<h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
							<span className="gradient-text">{heading1}</span>
							{heading2 && (
								<>
									<br />
									<span className="text-foreground">{heading2}</span>
								</>
							)}
						</h1>
					)}

					{/* Subtitle */}
					{subtitle && (
						<p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in-up delay-200">
							{subtitle}
						</p>
					)}

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-400">
						{ctas.map((cta, idx) => (
							<Button 
								key={idx}
								size="lg" 
								className={cta.variant === 'outline' ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground' : 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-effect group'}
								variant={cta.variant === 'outline' ? 'outline' : undefined}
								asChild
							>
								<Link to={cta.href}>
									{cta.label}
									{cta.variant !== 'outline' && (
										<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
									)}
								</Link>
							</Button>
						))}
					</div>

					{/* Service Icons */}
					<div className="grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in-up delay-600">
						{serviceIcons.map((s, i) => (
							<div className="text-center group cursor-pointer" key={i}>
								<div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
									{renderIcon(s.icon)}
								</div>
								<p className="text-sm text-muted-foreground">{s.label}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Scroll Indicator */}
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
				<div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
					<div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
				</div>
			</div>
		</section>
	);
};

export default Hero;