import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
    const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactForm.name || !contactForm.email || !contactForm.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const { addContact } = await import('../utils/supabase/database');
            await addContact({
                name: contactForm.name,
                email: contactForm.email,
                phone: contactForm.phone,
                message: contactForm.message,
                status: 'new'
            });

            setContactForm({ name: '', email: '', phone: '', message: '' });
            toast.success('Message sent successfully!');
        } catch (error) {
            console.error('Error saving contact:', error);
            toast.error('Failed to send message. Please try again.');
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
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
        </div>
    );
}
