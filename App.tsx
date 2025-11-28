import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog';
import { toast, Toaster } from 'sonner';
import { getServices, getProjects, addOrder } from './utils/supabase/database';
import { Service as DbService, Project as DbProject } from './utils/supabase/client';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Moon,
  Sun,
  MessageCircle,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Code,
  Users,
  Globe,
  Award,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Star,
  Zap,
  Sparkles,
  ChevronDown,
  Package,
  CheckCircle,
  User,
  Menu,
  X,
  Clock,
  Instagram
} from 'lucide-react';

// Import your actual profile images (swapped)
const profileImage1 = "/images/hero-image.jpg"; // Hero section image
const profileImage2 = "/images/profile-image.jpg"; // Profile image



interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
}



interface CartItem extends Service {
  quantity: number;
}

interface CheckoutData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface OrderConfirmation {
  orderId: string;
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    postal: string;
    country: string;
  };
  total: number;
  subtotal: number;
  tax: number;
}

const FloatingIcon = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}+</span>;
};

// Main portfolio application component with optimized performance
// Production-ready with comprehensive features and security
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderConfirmation | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    fullName: '', email: '', phone: '', address: '', city: '', postalCode: '', country: ''
  });

  // Database state
  const [dbServices, setDbServices] = useState<DbService[]>([]);
  const [dbProjects, setDbProjects] = useState<DbProject[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load services from database
  useEffect(() => {
    const loadServices = async () => {
      try {
        setServicesLoading(true);
        const services = await getServices();
        setDbServices(services);
      } catch (error) {
        console.error('Error loading services:', error);
        toast.error('Failed to load services');
      } finally {
        setServicesLoading(false);
      }
    };

    loadServices();
  }, []);

  // Load projects from database
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setProjectsLoading(true);
        const projects = await getProjects();
        setDbProjects(projects);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Close mobile menu on window resize (when switching to desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Convert database services to UI format
  const convertDbServiceToService = (dbService: DbService): Service => {
    // Extract price number from price string (e.g., "$500-$2000" -> 500)
    const priceMatch = dbService.price.match(/\$(\d+)/);
    const price = priceMatch ? parseInt(priceMatch[1]) : 0;

    return {
      id: dbService.id.toString(),
      title: dbService.name,
      description: dbService.description,
      price: price,
      category: 'Service' // Default category since DB doesn't have this field
    };
  };

  // Convert database services for the services section
  const services: Service[] = dbServices.map(convertDbServiceToService);

  // Use database projects directly (add fallback structure)  
  const projects = dbProjects.map(project => ({
    name: project.name,
    description: project.description,
    image: project.image || '/images/default-project.jpg',
    tech: project.technology.split(', '),
    url: project.is_live ? (project.link || '#') : '#'
  }));

  const addToCart = (service: Service) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        return prev.map(item =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
    toast.success('Added to cart!');
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from cart');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Save contact to database
  const sendOrderNotification = async (orderData: OrderConfirmation) => {
    console.log('Order submitted:', orderData.orderId);
  };

  const sendContactNotification = async (contactData: any) => {
    try {
      const { addContact } = await import('./utils/supabase/database');
      await addContact({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        message: contactData.message,
        status: 'new'
      });
      console.log('Contact saved to database');
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleCheckout = async () => {
    if (!checkoutData.fullName || !checkoutData.email || !checkoutData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const orderId = `ORD-${Date.now()}`;

    const orderData: OrderConfirmation = {
      orderId,
      customer: {
        name: checkoutData.fullName,
        email: checkoutData.email,
        phone: checkoutData.phone
      },
      address: {
        street: checkoutData.address,
        city: checkoutData.city,
        postal: checkoutData.postalCode,
        country: checkoutData.country
      },
      items: [...cart],
      subtotal,
      tax,
      total
    };

    try {
      // Save order to database
      await addOrder({
        order_id: orderId,
        customer_name: checkoutData.fullName,
        customer_email: checkoutData.email,
        customer_phone: checkoutData.phone,
        address_street: checkoutData.address,
        address_city: checkoutData.city,
        address_postal: checkoutData.postalCode,
        address_country: checkoutData.country,
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        subtotal,
        tax,
        total,
        status: 'pending'
      });

      // Send order notification
      await sendOrderNotification(orderData);

      // Set order details and show confirmation
      setOrderDetails(orderData);
      setShowOrderConfirmation(true);

      // Clear cart and close checkout
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
      setCheckoutData({
        fullName: '', email: '', phone: '', address: '', city: '', postalCode: '', country: ''
      });

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order. Please try again.');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Send contact notification
    await sendContactNotification(contactForm);

    // Clear the form
    setContactForm({ name: '', email: '', phone: '', message: '' });
    toast.success('Message sent successfully!');
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster />


      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-secondary/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-accent/25 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary/15 rounded-full animate-pulse"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-primary-foreground text-lg font-bold">M</span>
              </motion.div>
              <span className="font-semibold text-foreground hover:text-primary transition-all duration-300">
                Mowlid Mohamud
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-8">
              {['about', 'experience', 'projects', 'services', 'contact'].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(item)}
                  className="capitalize text-foreground hover:text-primary transition-colors duration-200 cursor-pointer font-medium"
                >
                  {item}
                </motion.button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-foreground hover:text-primary hover:bg-muted"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                  className="relative overflow-hidden text-foreground hover:text-primary hover:bg-muted"
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: darkMode ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </motion.div>
                </Button>
              </motion.div>

              {/* Admin Login Button - Hidden on mobile */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = '/admin'}
                  className="relative text-foreground hover:text-primary hover:bg-muted"
                  title="Admin Login"
                >
                  <User className="h-4 w-4" />
                </Button>
              </motion.div>

              {/* Cart Button - Hidden on mobile */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCart(true)}
                  className="relative text-foreground hover:text-primary hover:bg-muted"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <AnimatePresence>
                    {cart.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                          {cart.reduce((sum, item) => sum + item.quantity, 0)}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 bg-background/95 backdrop-blur-lg border-l border-border z-50 md:hidden"
            >
              <div className="flex flex-col h-full p-6">
                {/* Close button */}
                <div className="flex justify-end mb-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-foreground hover:text-primary hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-6">
                  {['about', 'experience', 'projects', 'services', 'contact'].map((item) => (
                    <motion.button
                      key={item}
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        scrollToSection(item);
                        setMobileMenuOpen(false);
                      }}
                      className="capitalize text-left text-lg font-medium text-foreground hover:text-primary transition-colors duration-200 py-2"
                    >
                      {item}
                    </motion.button>
                  ))}
                </nav>

                {/* Mobile Actions */}
                <div className="mt-auto space-y-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.location.href = '/admin';
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Admin Login
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowCart(true)}
                    className="w-full justify-start relative"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {cart.length > 0 && (
                      <Badge className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-2xl"
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6 text-primary" />
                    </motion.div>
                    <span className="text-primary dark:text-primary">Welcome to my digital world</span>
                  </div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl">
                    <span className="block">
                      <motion.span
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent dark:from-primary dark:via-primary/80 dark:to-secondary"
                      >
                        Crafting
                      </motion.span>
                    </span>
                    <span className="block">
                      <motion.span
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="bg-gradient-to-r from-secondary via-primary/60 to-primary bg-clip-text text-transparent dark:from-secondary dark:via-primary/60 dark:to-primary"
                      >
                        Digital
                      </motion.span>
                    </span>
                    <span className="block">
                      <motion.span
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent dark:from-primary dark:to-accent"
                      >
                        Excellence
                      </motion.span>
                    </span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="text-xl text-foreground/80 dark:text-muted-foreground max-w-lg leading-relaxed"
                >
                  Full Stack Developer • Community Builder • Digital Innovator
                  <br />
                  <span className="text-primary dark:text-primary font-medium">Transforming ideas into impactful digital solutions</span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="flex flex-wrap gap-4"
                >
                  <Badge variant="secondary" className="px-4 py-2 bg-primary/10 text-primary border-primary/20">
                    <MapPin className="w-4 h-4 mr-2" />
                    Malaysia
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 bg-secondary/10 text-secondary-foreground border-secondary/20">
                    <Globe className="w-4 h-4 mr-2" />
                    4 Languages
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 bg-accent/10 text-accent-foreground border-accent/20">
                    <Award className="w-4 h-4 mr-2" />
                    ALX Graduate
                  </Badge>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  className="flex flex-wrap gap-4"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary group"
                      onClick={() => scrollToSection('contact')}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Let's Connect
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-primary/20 hover:bg-primary/5"
                      onClick={() => scrollToSection('projects')}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      View Projects
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right Column - Profile Image */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className="relative flex justify-center lg:justify-end"
              >
                <div className="relative">
                  {/* Animated Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary via-secondary to-primary opacity-20 blur-sm"
                  />

                  {/* Second Ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 rounded-full bg-gradient-to-r from-secondary via-accent to-secondary opacity-30"
                  />

                  {/* Profile Image Container */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    animate={{
                      y: [0, -10, 0],
                      rotateY: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                      rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-background shadow-2xl"
                  >
                    <img
                      src={profileImage1}
                      alt="Mowlid Mohamud"
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20" />
                  </motion.div>

                  {/* Floating Icons */}
                  <FloatingIcon delay={0}>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <Code className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </FloatingIcon>

                  <FloatingIcon delay={1}>
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-secondary-foreground" />
                    </div>
                  </FloatingIcon>

                  <FloatingIcon delay={2}>
                    <div className="absolute top-1/2 -right-8 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                      <Globe className="w-5 h-5 text-accent-foreground" />
                    </div>
                  </FloatingIcon>
                </div>
              </motion.div>
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { label: 'Projects Completed', value: 15 },
                { label: 'Happy Clients', value: 25 },
                { label: 'Countries Served', value: 8 },
                { label: 'Youth Trained', value: 12 }
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
                >
                  <div className="text-3xl text-primary mb-2">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-muted-foreground cursor-pointer"
            onClick={() => scrollToSection('about')}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                About Me
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Passionate about creating digital solutions that make a difference in communities worldwide
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Code,
                  title: 'Technical Expertise',
                  description: 'Experienced in TypeScript, JavaScript, Next.js, and modern web technologies. Specialized in creating scalable web applications.',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: Users,
                  title: 'Community Building',
                  description: 'Passionate about building communities and empowering youth through technology and entrepreneurship training programs.',
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  icon: Award,
                  title: 'Social Impact',
                  description: 'Active in mental health organizations and social projects, combining technology with social work for community impact.',
                  gradient: 'from-green-500 to-emerald-500'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  viewport={{ once: true }}
                >
                  <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm h-full group">
                    <CardHeader className="pb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg`}
                      >
                        <item.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <CardTitle className="group-hover:text-primary transition-colors">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </CardContent>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Second Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-20 flex justify-center"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.08, rotateY: 5 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    y: [0, -8, 0],
                    rotateX: [0, 2, 0, -2, 0]
                  }}
                  transition={{
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-80 h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-background cursor-pointer"
                >
                  <img
                    src={profileImage2}
                    alt="Mowlid Mohamud in office"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />

                  {/* Hover overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: 0 }}
                      whileHover={{ scale: 1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <Star className="w-8 h-8 text-white" />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="absolute -right-8 top-8"
                >
                  <Badge className="bg-primary text-primary-foreground px-4 py-2 shadow-lg">
                    <Star className="w-4 h-4 mr-2" />
                    Hi I am Mowlid Haibe
                  </Badge>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-32 bg-muted/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                Education & Learning
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: GraduationCap,
                  title: 'Bachelor of Computer Science',
                  institution: 'Albukhary International University (Malaysia)',
                  status: 'Current',
                  color: 'from-blue-500 to-cyan-500',
                  link: 'https://aiu.edu.my/'
                },
                {
                  icon: Award,
                  title: 'Google Project Management Certificate',
                  institution: 'Google\'s professional certification program focused on project planning, agile methodologies, stakeholder management, risk assessment, and leadership in real-world projects.',
                  status: 'Completed (Dec 2023 – Aug 2024)',
                  color: 'from-red-500 to-orange-500',
                  link: 'https://www.coursera.org/programs/kiron-open-higher-education-learning-program-55mz5/professional-certificates/google-project-management'
                },
                {
                  icon: Award,
                  title: 'Full Stack Web Developer Graduate',
                  institution: 'FikrCamp - Comprehensive full-stack development program covering modern web technologies, frameworks, and best practices',
                  status: 'Completed (2023-2024)',
                  color: 'from-purple-500 to-pink-500',
                  link: 'https://www.fikrcamp.com/'
                },
                {
                  icon: Award,
                  title: 'IBM Full Stack Developer Graduate',
                  institution: 'IBM Professional Certificate - Advanced full-stack development with enterprise-level technologies and cloud computing',
                  status: 'Completed (2025)',
                  color: 'from-blue-600 to-indigo-600',
                  link: 'https://www.coursera.org/programs/kiron-open-higher-education-learning-program-55mz5/professional-certificates/ibm-full-stack-cloud-developer'
                },
                {
                  icon: Award,
                  title: 'ALX Africa - Software Engineering Graduate',
                  institution: 'Comprehensive software engineering program',
                  status: 'Completed',
                  color: 'from-orange-500 to-red-500',
                  link: 'https://www.alxafrica.com/'
                },
                {
                  icon: Code,
                  title: 'Hargabits Digital School - Graduate',
                  institution: 'Digital skills and technology training',
                  status: 'Completed',
                  color: 'from-green-500 to-emerald-500',
                  link: 'https://shaqodoon.org/project-listing/bits-school-digital-design-hargabits-garobits'
                }
              ].map((edu, index) => (
                <motion.div
                  key={edu.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  viewport={{ once: true }}
                  onClick={() => edu.link && window.open(edu.link, '_blank')}
                  className={edu.link ? 'cursor-pointer' : ''}
                >
                  <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm h-full group">
                    <CardHeader className="pb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${edu.color} flex items-center justify-center mb-4 shadow-lg`}
                      >
                        <edu.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <CardTitle className="group-hover:text-primary transition-colors">{edu.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed mb-4">{edu.institution}</p>
                      <Badge
                        variant={edu.status === 'Current' ? 'default' : 'secondary'}
                        className="mb-2"
                      >
                        {edu.status}
                      </Badge>
                    </CardContent>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                Experience & Social Impact
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {[
                {
                  icon: Globe,
                  title: 'Somaliland Standard - Digital Media & Protocol Manager (2023)',
                  description: 'Led digital media coverage and protocol management for Africa Science Week, coordinating across 11 African countries including Somaliland',
                  skills: ['Digital Media', 'Protocol Management', 'International Coordination', 'Event Coverage'],
                  color: 'from-indigo-500 to-purple-500',
                  link: 'https://somalilandstandard.com/africa-science-week-starts-in-11-african-countries-including-somaliland/'
                },
                {
                  icon: Briefcase,
                  title: 'BarkulanHub - Head of Community & Communication Manager',
                  description: 'Built their website and managed community growth, leading digital transformation initiatives',
                  skills: ['Community Management', 'Web Development', 'Digital Marketing'],
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: Users,
                  title: 'Mansa Musa Start School - Head of Communication & Trainer',
                  description: 'Trained 12+ youth in entrepreneurship & fundraising, developing comprehensive training programs',
                  skills: ['Training & Development', 'Entrepreneurship', 'Public Speaking'],
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  icon: Globe,
                  title: 'Sirta Maanka Mental Health Org - Media & Communications',
                  description: 'Mental health awareness and community support through digital platforms and outreach',
                  skills: ['Mental Health Advocacy', 'Content Creation', 'Community Outreach'],
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  icon: Mail,
                  title: 'Shaqdoo.org - Communication Intern',
                  description: 'Digital communication and outreach, building connections across diverse communities',
                  skills: ['Digital Communication', 'Social Media', 'Community Building'],
                  color: 'from-orange-500 to-red-500'
                }
              ].map((exp, index) => (
                <motion.div
                  key={exp.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  viewport={{ once: true }}
                  onClick={() => exp.link && window.open(exp.link, '_blank')}
                  className={exp.link ? 'cursor-pointer' : ''}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group relative">
                    <CardHeader>
                      <div className="flex items-start gap-6">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                        >
                          <exp.icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <CardTitle className="group-hover:text-primary transition-colors text-xl mb-3 flex items-center gap-2">
                            {exp.title}
                            {exp.link && (
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </motion.div>
                            )}
                          </CardTitle>
                          <CardDescription className="text-base leading-relaxed mb-4">
                            {exp.description}
                          </CardDescription>
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Featured Badge for Somaliland Standard */}
                    {exp.link && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4"
                      >
                        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 shadow-lg">
                          <Globe className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </motion.div>
                    )}

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                Projects
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Successful projects that I delivered for my clients
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectsLoading ? (
                // Loading skeleton for projects
                [...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm h-full">
                      <div className="aspect-video bg-gray-200"></div>
                      <div className="p-6">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="flex gap-2 mb-4">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                      </div>
                    </Card>
                  </div>
                ))
              ) : projects.length > 0 ? (
                projects.map((project, index) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    viewport={{ once: true }}
                  >
                    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm group h-full">
                      <div className="relative aspect-video overflow-hidden cursor-pointer"
                        onClick={() => project.url !== '#' && window.open(project.url, '_blank')}>
                        <motion.img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          whileHover={{ scale: 1.1 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Hover Overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg"
                          >
                            <ExternalLink className="w-6 h-6 text-primary-foreground" />
                          </motion.div>
                        </motion.div>

                        {/* Live Badge for DEH project */}
                        {project.url !== '#' && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-4 right-4"
                          >
                            <Badge className="bg-green-500 text-white px-3 py-1 shadow-lg">
                              <Globe className="w-3 h-3 mr-1" />
                              Live
                            </Badge>
                          </motion.div>
                        )}
                      </div>

                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                          {project.name}
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.div>
                        </CardTitle>
                        <CardDescription className="leading-relaxed">
                          {project.description}
                        </CardDescription>
                      </CardHeader>

                      <CardFooter>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardFooter>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </Card>
                  </motion.div>
                ))
              ) : (
                // Empty state for projects
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No projects available. Add some projects in your Supabase dashboard!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                Services & Solutions
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Professional services designed to elevate your digital presence and business success
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-4xl mx-auto">
              {servicesLoading ? (
                // Loading skeleton for services
                [...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
                      <CardHeader>
                        <div className="h-6 bg-gray-200 rounded w-20 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </CardHeader>
                      <CardFooter>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                      </CardFooter>
                    </Card>
                  </div>
                ))
              ) : services.length > 0 ? (
                services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    viewport={{ once: true }}
                    className="cursor-pointer w-full max-w-sm mx-auto"
                    onClick={() => {
                      setSelectedService(service);
                      setShowServiceDetails(true);
                    }}
                  >
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group h-full hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-4">
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            {service.category}
                          </Badge>
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 15 }}
                            className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center"
                          >
                            <Star className="w-4 h-4 text-white" />
                          </motion.div>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="leading-relaxed line-clamp-3">
                          {service.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <motion.div
                          className="text-2xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                          whileHover={{ scale: 1.1 }}
                        >
                          {service.price}
                        </motion.div>
                      </CardContent>

                      <CardFooter>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full"
                        >
                          <Button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              addToCart(service);
                            }}
                            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary group"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Quick Add
                            <motion.div
                              className="ml-auto opacity-0 group-hover:opacity-100"
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          </Button>

                          <div className="text-center mt-2 text-xs text-muted-foreground">
                            Click card for details
                          </div>
                        </motion.div>
                      </CardFooter>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </Card>
                  </motion.div>
                ))
              ) : (
                // Empty state for services
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No services available. Add some services in your Supabase dashboard!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                Let's Create Something Amazing
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Ready to bring your digital vision to life? Let's connect and discuss your next project
              </motion.p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h3 className="text-2xl mb-6">Get In Touch</h3>
                <div className="space-y-6">
                  {[
                    { icon: MapPin, label: 'Location', value: 'Alor Setar, Kedah, Malaysia' },
                    {
                      icon: Mail,
                      label: 'Email',
                      value: ['malitmohamud@gmail.com', 'mowlid@malito.tech']
                    },
                    {
                      icon: Phone,
                      label: 'Phone',
                      value: ['Malaysia: +6017 258 9925', 'Somaliland: +252 63 423 5966']
                    }
                  ].map((contact, index) => (
                    <motion.div
                      key={contact.label}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      whileHover={{ x: 10 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg flex-shrink-0"
                      >
                        <contact.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h4 className="text-lg mb-1">{contact.label}</h4>
                        {Array.isArray(contact.value) ? (
                          contact.value.map((val, i) => (
                            <p key={i} className="text-muted-foreground">{val}</p>
                          ))
                        ) : (
                          <p className="text-muted-foreground">{contact.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Send a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and I'll get back to you within 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Input
                          placeholder="Your Name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-background/50"
                        />
                      </motion.div>

                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Input
                          type="email"
                          placeholder="Your Email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-background/50"
                        />
                      </motion.div>

                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Input
                          placeholder="Your Phone (Optional)"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-background/50"
                        />
                      </motion.div>

                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Textarea
                          placeholder="Tell me about your project..."
                          rows={5}
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          className="bg-background/50 resize-none"
                        />
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary group"
                          size="lg"
                        >
                          Send Message
                          <motion.div
                            className="ml-2"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex justify-center space-x-6 mb-6">
              {[
                { icon: Github, href: 'https://github.com/mawlid1431', label: 'GitHub' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/mowlid-mohamoud-haibe-8b7b6a189/', label: 'LinkedIn' },
                { icon: Instagram, href: 'https://www.instagram.com/malitfx/', label: 'Instagram' },
                { icon: Mail, href: 'mailto:malitmohamud@gmail.com', label: 'Email' }
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-lg"
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted-foreground"
            >
              © 2024 Mowlid Mohamud. Crafted with passion and innovation.
            </motion.p>
          </motion.div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <motion.a
        href="https://wa.me/601725889925"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50 group"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <MessageCircle className="w-7 h-7" />
        </motion.div>

        {/* Pulse Effect */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
      </motion.a>

      {/* Cart Dialog */}
      <AnimatePresence>
        {showCart && (
          <Dialog open={showCart} onOpenChange={setShowCart}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Shopping Cart</DialogTitle>
                <DialogDescription>
                  {cart.length === 0 ? 'Your cart is empty' : `${cart.reduce((sum, item) => sum + item.quantity, 0)} item(s) in cart`}
                </DialogDescription>
              </DialogHeader>

              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 text-center text-muted-foreground"
                >
                  Your cart is empty
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-4 border rounded-lg bg-card/50"
                    >
                      <div className="flex-1">
                        <h4>{item.title}</h4>
                        <p className="text-sm text-muted-foreground">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Shipping:</span>
                      <span>FREE 🎉 You qualify for free shipping!</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => {
                        setShowCart(false);
                        setShowCheckout(true);
                      }}
                      className="w-full bg-gradient-to-r from-primary to-primary/80"
                    >
                      Proceed to Checkout
                    </Button>
                  </motion.div>

                  <div className="text-xs text-muted-foreground text-center space-y-1">
                    <div>✓ Secure checkout with SSL encryption</div>
                    <div>✓ 30-day return policy</div>
                    <div>✓ Worldwide shipping available</div>
                  </div>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Checkout Dialog */}
      <AnimatePresence>
        {showCheckout && (
          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Checkout</DialogTitle>
                <DialogDescription>
                  Complete your order for {cart.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                </DialogDescription>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name"
                      value={checkoutData.fullName}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={checkoutData.email}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                      placeholder="Phone"
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg mb-4">Shipping Address</h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="Street Address"
                      value={checkoutData.address}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, address: e.target.value }))}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="City"
                        value={checkoutData.city}
                        onChange={(e) => setCheckoutData(prev => ({ ...prev, city: e.target.value }))}
                      />
                      <Input
                        placeholder="Postal Code"
                        value={checkoutData.postalCode}
                        onChange={(e) => setCheckoutData(prev => ({ ...prev, postalCode: e.target.value }))}
                      />
                      <Input
                        placeholder="Country"
                        value={checkoutData.country}
                        onChange={(e) => setCheckoutData(prev => ({ ...prev, country: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="text-lg mb-4">Order Summary</h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>Qty: {item.quantity} × {item.title}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Shipping:</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="mb-2">Payment Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Your order will be reviewed before payment. Payment instructions will be sent via email after order confirmation.
                  </p>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-primary to-primary/80"
                    size="lg"
                  >
                    Place Order
                  </Button>
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Order Confirmation Dialog */}
      <AnimatePresence>
        {showOrderConfirmation && orderDetails && (
          <Dialog open={showOrderConfirmation} onOpenChange={setShowOrderConfirmation}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center space-y-6"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                  className="flex justify-center"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-xl">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <h2 className="text-3xl text-green-600 dark:text-green-400 mb-4">Order Confirmed!</h2>
                  <p className="text-muted-foreground mb-2">
                    Thank you for your order. We've received your request and it's currently under review.
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Order ID: </span>
                    <span className="font-mono bg-muted/50 px-2 py-1 rounded">{orderDetails.orderId}</span>
                  </p>
                </motion.div>

                {/* What Happens Next */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="bg-card/50 rounded-lg p-6 text-left"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg">What Happens Next?</h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        step: "1",
                        title: "Order Review",
                        description: "Our team will review your order to ensure artwork availability and quality."
                      },
                      {
                        step: "2",
                        title: "Email Confirmation",
                        description: "You'll receive an email with order status updates and payment instructions."
                      },
                      {
                        step: "3",
                        title: "Secure Packaging & Shipping",
                        description: "Once approved and payment is received, we'll carefully package and ship your artwork."
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={item.step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                        className="flex gap-4"
                      >
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="grid md:grid-cols-2 gap-6 text-left"
                >
                  {/* Order Items */}
                  <div className="bg-card/50 rounded-lg p-4">
                    <h4 className="mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {orderDetails.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                          className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                        >
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Star className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">Qty: {item.quantity} × ${item.price}</p>
                            <p className="text-xs text-muted-foreground">{item.title}</p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </motion.div>
                      ))}

                      <Separator />
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${orderDetails.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Shipping:</span>
                          <span>FREE</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>${orderDetails.tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg">
                          <span>Total:</span>
                          <span>${orderDetails.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="bg-card/50 rounded-lg p-4">
                    <h4 className="mb-3">Shipping Information</h4>
                    <div className="space-y-3">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                      >
                        <h5 className="text-sm">Contact</h5>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{orderDetails.customer.name}</p>
                          <p>{orderDetails.customer.email}</p>
                          <p>{orderDetails.customer.phone}</p>
                        </div>
                      </motion.div>

                      {orderDetails.address.street && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                        >
                          <h5 className="text-sm">Address</h5>
                          <div className="text-sm text-muted-foreground">
                            <p>{orderDetails.address.street}</p>
                            <p>{orderDetails.address.city} {orderDetails.address.postal}</p>
                            <p>{orderDetails.address.country}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Button
                    onClick={() => setShowOrderConfirmation(false)}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => scrollToSection('contact')}
                    className="flex-1"
                  >
                    Contact Support
                  </Button>
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Service Details Modal */}
      <AnimatePresence>
        {showServiceDetails && selectedService && (
          <Dialog open={showServiceDetails} onOpenChange={setShowServiceDetails}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader className="text-left">
                  <DialogTitle className="text-2xl font-bold mb-2">
                    {selectedService.title}
                  </DialogTitle>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {selectedService.category}
                    </Badge>
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {selectedService.price}
                    </span>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Detailed Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Service Overview</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedService.description}
                    </p>
                  </div>

                  {/* What's Included */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Professional consultation and planning</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Modern design and development</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Testing and quality assurance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Documentation and training</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>30 days of support after delivery</span>
                      </li>
                    </ul>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Estimated Timeline</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>2-4 weeks delivery time</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => {
                        addToCart(selectedService);
                        setShowServiceDetails(false);
                        toast.success('Service added to cart!');
                      }}
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart - {selectedService.price}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => scrollToSection('contact')}
                      className="flex-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact First
                    </Button>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}