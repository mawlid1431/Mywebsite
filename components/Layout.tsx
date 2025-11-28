import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Moon, Sun, User, ShoppingCart, Menu, X, Github, Linkedin, Mail, Instagram
} from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    cart?: any[];
    onCartClick?: () => void;
}

export default function Layout({ children, darkMode, setDarkMode, cart = [], onCartClick }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        if (window.innerWidth >= 768) {
            setMobileMenuOpen(false);
        }
    }, [location]);

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

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Projects', path: '/projects' },
        { name: 'Services', path: '/services' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-1 h-1 bg-secondary/30 rounded-full animate-bounce"></div>
                <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-accent/25 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary/15 rounded-full animate-pulse"></div>
            </div>

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
                            onClick={() => navigate('/')}
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
                            {navItems.map((item) => (
                                <motion.button
                                    key={item.name}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate(item.path)}
                                    className={`capitalize transition-colors duration-200 cursor-pointer font-medium ${location.pathname === item.path
                                        ? 'text-primary'
                                        : 'text-foreground hover:text-primary'
                                        }`}
                                >
                                    {item.name}
                                </motion.button>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-4">
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

                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate('/admin')}
                                    className="relative text-foreground hover:text-primary hover:bg-muted"
                                    title="Admin Login"
                                >
                                    <User className="h-4 w-4" />
                                </Button>
                            </motion.div>

                            {onCartClick && (
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={onCartClick}
                                        className="relative text-foreground hover:text-primary hover:bg-muted"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        {cart.length > 0 && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-2 -right-2"
                                            >
                                                <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                                                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                                </Badge>
                                            </motion.div>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.header>

            {mobileMenuOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-64 bg-background/95 backdrop-blur-lg border-l border-border z-50 md:hidden"
                    >
                        <div className="flex flex-col h-full p-6">
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

                            <nav className="flex flex-col space-y-6">
                                {navItems.map((item) => (
                                    <motion.button
                                        key={item.name}
                                        whileHover={{ x: 10 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            navigate(item.path);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`capitalize text-left text-lg font-medium transition-colors duration-200 py-2 ${location.pathname === item.path
                                            ? 'text-primary'
                                            : 'text-foreground hover:text-primary'
                                            }`}
                                    >
                                        {item.name}
                                    </motion.button>
                                ))}
                            </nav>

                            <div className="mt-auto space-y-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        navigate('/admin');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full justify-start"
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    Admin Login
                                </Button>

                                {onCartClick && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            onCartClick();
                                            setMobileMenuOpen(false);
                                        }}
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
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}

            <main className="pt-20">
                {children}
            </main>

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
        </div>
    );
}
