import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { getProjects } from '../utils/supabase/database';
import { Project as DbProject } from '../utils/supabase/client';
import { ExternalLink, Globe } from 'lucide-react';

export default function Projects() {
    const [dbProjects, setDbProjects] = useState<DbProject[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);

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

    const projects = dbProjects.map(project => ({
        name: project.name,
        description: project.description,
        image: project.image || '/images/default-project.jpg',
        tech: project.technology.split(', '),
        url: project.is_live ? (project.link || '#') : '#'
    }));

    return (
        <div className="min-h-screen bg-background text-foreground">
            <section className="py-32 relative overflow-hidden">
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
                                All Projects
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
                                [...Array(6)].map((_, index) => (
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

                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-muted-foreground">No projects available. Add some projects in your Supabase dashboard!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
