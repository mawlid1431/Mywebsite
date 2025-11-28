import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    image?: string;
}

export default function Testimonials() {
    // Sample testimonials - you can later fetch these from Supabase
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: "Bilal Andersen",
            role: "CEO",
            company: "Tech Solutions",
            content: "Perfekt organiseret fra start til slut. Den dansk-talende guide gjorde det hele så nemt at forstå. Hotellet havde en fantastisk beliggenhed tæt på Haram.",
            rating: 5,
        },
        {
            id: 2,
            name: "Amina Nielsen",
            role: "Marketing Director",
            company: "Digital Agency",
            content: "En uforglemmelig spirituel rejse! Alt var inkluderet, og jeg behøvede ikke bekymre mig om noget. Teamet var altid tilgængelige og hjælpsomme.",
            rating: 5,
        },
        {
            id: 3,
            name: "Sarah Johnson",
            role: "Product Manager",
            company: "Innovation Labs",
            content: "Outstanding work! The attention to detail and commitment to quality exceeded our expectations. Highly recommended for any project.",
            rating: 5,
        },
        {
            id: 4,
            name: "Ahmed Hassan",
            role: "CTO",
            company: "StartUp Inc",
            content: "Professional, reliable, and delivers on time. Working with this team has been a game-changer for our business.",
            rating: 5,
        },
        {
            id: 5,
            name: "Lisa Chen",
            role: "Designer",
            company: "Creative Studio",
            content: "Incredible creativity and technical expertise. The final product was beyond what we imagined. Will definitely work together again!",
            rating: 5,
        },
        {
            id: 6,
            name: "Mohammed Ali",
            role: "Founder",
            company: "E-commerce Plus",
            content: "From concept to deployment, everything was handled professionally. Great communication and excellent results.",
            rating: 5,
        },
    ];

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

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                                {testimonial.content}
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                                                    {testimonial.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {testimonial.role} at {testimonial.company}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
