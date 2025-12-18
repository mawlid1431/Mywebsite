import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { getServices, getProjects, getTrustedCompanies, TrustedCompany } from '../utils/supabase/database';
import { Service as DbService, Project as DbProject } from '../utils/supabase/client';
import {
    Code, Users, Award, ArrowRight, Star, Sparkles,
    ChevronDown, MapPin, Globe, Zap, Mail
} from 'lucide-react';

const profileImage1 = "/images/hero-image.jpg";

const FloatingIcon = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
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

export default function Home() {
    const navigate = useNavigate();
    const [dbServices, setDbServices] = useState<DbService[]>([]);
    const [dbProjects, setDbProjects] = useState<DbProject[]>([]);
    const [trustedCompanies, setTrustedCompanies] = useState<TrustedCompany[]>([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [companiesLoading, setCompaniesLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                setServicesLoading(true);
                const services = await getServices();
                setDbServices(services);
            } catch (error) {
                console.error('Error loading services:', error);
            } finally {
                setServicesLoading(false);
            }
        };
        loadServices();
    }, []);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setProjectsLoading(true);
                const projects = await getProjects();
                setDbProjects(projects);
            } catch (error) {
                console.error('Error loading projects:', error);
            } finally {
                setProjectsLoading(false);
            }
        };
        loadProjects();
    }, []);

    useEffect(() => {
        const loadTrustedCompanies = async () => {
            try {
                setCompaniesLoading(true);
                const companies = await getTrustedCompanies();
                setTrustedCompanies(companies);
            } catch (error) {
                console.error('Error loading trusted companies:', error);
            } finally {
                setCompaniesLoading(false);
            }
        };
        loadTrustedCompanies();
    }, []);



    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    const projects = dbProjects.map(project => ({
        name: project.name,
        description: project.description,
        image: project.image || '/images/default-project.jpg',
        tech: project.technology.split(', '),
        url: project.is_live ? (project.link || '#') : '#'
    }));

    const services = dbServices.map(dbService => {
        return {
            id: dbService.id.toString(),
            title: dbService.name,
            description: dbService.description,
            price: dbService.price,
            category: 'Service'
        };
    });

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 overflow-hidden">
                <div className="absolute inset-0">
                    <motion.div
                        animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 0.8, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-2xl"
                    />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                                            <Sparkles className="w-6 h-6 text-primary" />
                                        </motion.div>
                                        <span className="text-primary">Welcome to my digital world</span>
                                    </div>

                                    <h1 className="text-4xl md:text-6xl lg:text-7xl">
                                        <span className="block">
                                            <motion.span
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4, duration: 0.8 }}
                                                className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
                                            >
                                                Crafting
                                            </motion.span>
                                        </span>
                                        <span className="block">
                                            <motion.span
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6, duration: 0.8 }}
                                                className="bg-gradient-to-r from-secondary via-primary/60 to-primary bg-clip-text text-transparent"
                                            >
                                                Digital
                                            </motion.span>
                                        </span>
                                        <span className="block">
                                            <motion.span
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.8, duration: 0.8 }}
                                                className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
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
                                    className="text-xl text-foreground/80 max-w-lg leading-relaxed mt-6"
                                >
                                    Full Stack Developer • Community Builder • Digital Innovator
                                    <br />
                                    <br />
                                    <span className="text-primary font-medium">Transforming ideas into impactful digital solutions</span>
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
                                            onClick={() => navigate('/contact')}
                                        >
                                            <Mail className="w-5 h-5 mr-2" />
                                            Let's Connect
                                            <motion.div className="ml-2" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                                <ArrowRight className="w-4 h-4" />
                                            </motion.div>
                                        </Button>
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="border-primary/20 hover:bg-primary/5"
                                            onClick={() => navigate('/projects')}
                                        >
                                            <Zap className="w-5 h-5 mr-2" />
                                            View Projects
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                className="relative flex justify-center lg:justify-end"
                            >
                                <div className="relative">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary via-secondary to-primary opacity-20 blur-sm"
                                    />

                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-2 rounded-full bg-gradient-to-r from-secondary via-accent to-secondary opacity-30"
                                    />

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        animate={{ y: [0, -10, 0], rotateY: [0, 5, 0, -5, 0] }}
                                        transition={{
                                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                            rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                                        }}
                                        className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-background shadow-2xl"
                                    >
                                        <img
                                            src={profileImage1}
                                            alt="Mowlid Mohamud"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20" />
                                    </motion.div>

                                    <FloatingIcon delay={0}>
                                        <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                            <Code className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                                        </div>
                                    </FloatingIcon>

                                    <FloatingIcon delay={1}>
                                        <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-foreground" />
                                        </div>
                                    </FloatingIcon>

                                    <FloatingIcon delay={2}>
                                        <div className="absolute top-1/2 -right-6 sm:-right-8 w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                                            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
                                        </div>
                                    </FloatingIcon>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6, duration: 0.8 }}
                            className="mt-12 md:mt-20 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
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
                                    className="text-center p-4 sm:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
                                >
                                    <div className="text-2xl sm:text-3xl text-primary mb-2">
                                        <AnimatedCounter value={stat.value} />
                                    </div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

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
                        onClick={() => scrollToSection('about-preview')}
                    >
                        <ChevronDown className="w-6 h-6" />
                    </motion.div>
                </motion.div>
            </section>

            {/* About Preview Section */}
            <section id="about-preview" className="py-24 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="text-center mb-12">
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
                                Passionate about creating digital solutions that make a difference
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mt-12"
                        >
                            <Button
                                size="lg"
                                onClick={() => navigate('/about')}
                                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary group"
                            >
                                See More About Me
                                <motion.div className="ml-2" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Projects Preview Section */}
            <section className="py-24 bg-muted/30 relative overflow-hidden">
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
                                Recent Projects
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="text-xl text-muted-foreground max-w-3xl mx-auto"
                            >
                                Check out my latest work
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                            {projectsLoading ? (
                                [...Array(3)].map((_, index) => (
                                    <div key={index} className="animate-pulse">
                                        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm h-full">
                                            <div className="aspect-video bg-gray-200"></div>
                                            <div className="p-6">
                                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                            </div>
                                        </Card>
                                    </div>
                                ))
                            ) : projects.slice(0, 3).map((project, index) => (
                                <motion.div
                                    key={project.name}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm group h-full cursor-pointer"
                                        onClick={() => navigate('/projects')}>
                                        <div className="relative aspect-video overflow-hidden">
                                            <motion.img
                                                src={project.image}
                                                alt={project.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                whileHover={{ scale: 1.1 }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
                                                    <ArrowRight className="w-6 h-6 text-primary-foreground" />
                                                </motion.div>
                                            </motion.div>

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
                                            </CardTitle>
                                            <CardDescription className="leading-relaxed line-clamp-2">
                                                {project.description}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardFooter>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech.slice(0, 3).map((tech) => (
                                                    <Badge key={tech} variant="outline" className="text-xs">
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-center mt-20 mb-8"
                        >
                            <Button
                                size="lg"
                                onClick={() => navigate('/projects')}
                                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary group"
                            >
                                See All Projects
                                <motion.div className="ml-2" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Services Preview Section */}
            <section className="py-20 relative">
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
                                className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                            >
                                Services & Solutions
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="text-base text-muted-foreground max-w-2xl mx-auto"
                            >
                                Professional services designed to elevate your digital presence
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-4xl mx-auto">
                            {servicesLoading ? (
                                [...Array(3)].map((_, index) => (
                                    <div key={index} className="animate-pulse">
                                        <div className="border border-border/50 bg-card/50 backdrop-blur-sm rounded-lg p-4 h-full">
                                            <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
                                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                                        </div>
                                    </div>
                                ))
                            ) : services.slice(0, 3).map((service, index) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    viewport={{ once: true }}
                                    className="cursor-pointer"
                                    onClick={() => navigate('/services')}
                                >
                                    <div className="relative border border-border/50 bg-card/50 backdrop-blur-sm rounded-lg overflow-hidden group hover:border-primary/40 hover:shadow-md transition-all duration-300 p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <Badge
                                                variant="secondary"
                                                className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5"
                                            >
                                                {service.category}
                                            </Badge>
                                            <motion.div
                                                whileHover={{ rotate: 15 }}
                                                className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center shadow-sm"
                                            >
                                                <Star className="w-3 h-3 text-white" />
                                            </motion.div>
                                        </div>

                                        <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                            {service.title}
                                        </h3>

                                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 min-h-[2.5rem]">
                                            {service.description}
                                        </p>

                                        <div className="flex items-center justify-center pt-2 border-t border-border/30">
                                            <span className="text-xs font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                                {service.price}
                                            </span>
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-center mt-20"
                        >
                            <Button
                                size="lg"
                                onClick={() => navigate('/services')}
                                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary group"
                            >
                                See All Services
                                <motion.div className="ml-2" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Preview Section */}
            <section className="py-24 bg-muted/30 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center"
                    >
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
                            className="text-xl text-muted-foreground mb-16"
                        >
                            Ready to bring your digital vision to life? Let's connect and discuss your next project
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <Button
                                size="lg"
                                onClick={() => navigate('/contact')}
                                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary group"
                            >
                                <Mail className="w-5 h-5 mr-2" />
                                Get In Touch
                                <motion.div className="ml-2" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>


        </div>
    );
}
