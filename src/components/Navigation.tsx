import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { isAdmin } from '@/lib/auth';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Services', href: '/services' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-card/90 backdrop-blur-xl border-b border-border card-shadow'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold gradient-text">A TECH</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-foreground hover:text-primary smooth-transition relative',
                  location.pathname === item.href && 'text-primary'
                )}
              >
                {item.name}
                {location.pathname === item.href && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className={cn(
                  'text-foreground hover:text-primary smooth-transition relative',
                  location.pathname === '/dashboard' && 'text-primary'
                )}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center space-x-3">
            {!user ? (
              <>
                <Button asChild variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
              </>
            ) : (
              <>
                {isAdmin(user) && (
                  <Button asChild variant="secondary">
                    <a href="/cms-admin/index.html">Admin</a>
                  </Button>
                )}
                <Button onClick={handleLogout} variant="outline">Logout</Button>
              </>
            )}
            <Button
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-effect"
              asChild
            >
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border card-shadow">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'block text-foreground hover:text-primary smooth-transition',
                    location.pathname === item.href && 'text-primary'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Link
                  to="/dashboard"
                  className={cn(
                    'block text-foreground hover:text-primary smooth-transition',
                    location.pathname === '/dashboard' && 'text-primary'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {!user ? (
                <div className="flex">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  {isAdmin(user) && (
                    <Button asChild variant="secondary" className="flex-1">
                      <a href="/cms-admin/index.html" onClick={() => setIsOpen(false)}>Admin</a>
                    </Button>
                  )}
                  <Button onClick={() => { handleLogout(); setIsOpen(false); }} variant="outline" className="flex-1">Logout</Button>
                </div>
              )}
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-effect"
                asChild
              >
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Get a Quote
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;