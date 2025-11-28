import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "What services do you offer?",
            answer: "I offer full-stack web development, mobile app development, UI/UX design, and digital consulting services. I specialize in creating modern, responsive applications using React, TypeScript, and other cutting-edge technologies."
        },
        {
            question: "How long does a typical project take?",
            answer: "Project timelines vary based on complexity and scope. A simple website might take 2-4 weeks, while a complex web application could take 2-3 months. I'll provide a detailed timeline during our initial consultation."
        },
        {
            question: "What is your development process?",
            answer: "My process includes: 1) Discovery & Planning, 2) Design & Prototyping, 3) Development & Testing, 4) Deployment & Launch, 5) Maintenance & Support. I maintain clear communication throughout each phase."
        },
        {
            question: "Do you provide ongoing support after project completion?",
            answer: "Yes! I offer various maintenance and support packages to ensure your application runs smoothly. This includes bug fixes, updates, performance optimization, and feature enhancements."
        },
        {
            question: "What technologies do you work with?",
            answer: "I work with modern technologies including React, TypeScript, Node.js, Next.js, Tailwind CSS, Supabase, PostgreSQL, and more. I choose the best tech stack based on your project requirements."
        },
        {
            question: "How do you handle project communication?",
            answer: "I believe in transparent communication. We'll have regular check-ins via your preferred method (email, video calls, or messaging). You'll receive progress updates and have access to the development environment."
        },
        {
            question: "What are your payment terms?",
            answer: "I typically work with a 50% upfront payment and 50% upon project completion. For larger projects, we can arrange milestone-based payments. All terms are clearly outlined in the project contract."
        },
        {
            question: "Can you work with my existing team?",
            answer: "Absolutely! I'm experienced in collaborating with existing teams, whether as a lead developer, team member, or consultant. I adapt to your workflow and communication style."
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-16">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold"
                            >
                                Frequently Asked Questions
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-xl text-muted-foreground"
                            >
                                Find answers to common questions about my services
                            </motion.p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="border border-border rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm"
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                                    >
                                        <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${openIndex === index ? 'transform rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="px-6 pb-5"
                                        >
                                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="mt-16 text-center p-8 bg-card/50 backdrop-blur-sm border border-border rounded-lg"
                        >
                            <h3 className="text-2xl font-semibold mb-4">Still have questions?</h3>
                            <p className="text-muted-foreground mb-6">
                                Feel free to reach out, and I'll be happy to help!
                            </p>
                            <a
                                href="/contact"
                                className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Contact Me
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
