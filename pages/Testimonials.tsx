import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Star, Quote } from 'lucide-react';
import { getTestimonials, Testimonial } from '../utils/supabase/database';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            const data = await getTestimonials();
            setTestimonials(data);
        } catch (error) {
            console.error('Error loading testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

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
                                Client Testimonials
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="text-xl text-muted-foreground max-w-3xl mx-auto"
                            >
                                What my clients say about working with me
                            </motion.p>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
                                <p className="text-muted-foreground mt-4">Loading testimonials...</p>
                            </div>
                        ) : testimonials.length === 0 ? (
                            <div className="text-center py-12">
                                <Quote className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground">No testimonials yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {testimonials.map((testimonial, index) => (
                                    <motion.div
                                        key={testimonial.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-1 mb-4">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>

                                                <Quote className="w-8 h-8 text-primary/30 mb-4" />

                                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                                    {testimonial.feedback}
                                                </p>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                                                        {testimonial.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {testimonial.role}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
