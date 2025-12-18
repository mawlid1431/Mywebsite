import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { getServices } from '../utils/supabase/database';
import { Service as DbService } from '../utils/supabase/client';
import { Star, ArrowRight, X, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
    id: string;
    title: string;
    description: string;
    price: string;
    category: string;
}

interface ServicesProps {
    onAddToCart?: (service: Service) => void;
}

interface BookingForm {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export default function Services({ onAddToCart }: ServicesProps) {
    const navigate = useNavigate();
    const [dbServices, setDbServices] = useState<DbService[]>([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingForm, setBookingForm] = useState<BookingForm>({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

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

    const services: Service[] = dbServices.map(dbService => ({
        id: dbService.id.toString(),
        title: dbService.name,
        description: dbService.description,
        price: dbService.price,
        category: 'Service'
    }));

    const handleBookService = (service: Service) => {
        setSelectedService(service);
        setShowBookingForm(true);
    };

    const handleCloseBookingForm = () => {
        setShowBookingForm(false);
        setSelectedService(null);
        setBookingForm({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    const handleSubmitBooking = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!bookingForm.name || !bookingForm.email || !bookingForm.phone) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(bookingForm.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        // Store booking data and navigate to contact page
        const bookingData = {
            service: selectedService,
            ...bookingForm
        };

        // Store in sessionStorage so it can be accessed on the contact page
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

        toast.success(`Redirecting to contact page...`);

        // Navigate to contact page
        setTimeout(() => {
            navigate('/contact');
        }, 500);
    };

    const handleInputChange = (field: keyof BookingForm, value: string) => {
        setBookingForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <section className="py-32 relative">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center max-w-5xl mx-auto">
                            {servicesLoading ? (
                                [...Array(4)].map((_, index) => (
                                    <div key={index} className="animate-pulse w-full">
                                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
                                            <CardHeader>
                                                <div className="h-6 bg-gray-200 rounded w-20 mb-4"></div>
                                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                            </CardHeader>
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
                                        className="cursor-pointer w-full"
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
                                                <CardDescription className="leading-relaxed">
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
                                                        onClick={() => handleBookService(service)}
                                                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary group"
                                                    >
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        Book Now
                                                        <motion.div
                                                            className="ml-auto opacity-0 group-hover:opacity-100"
                                                            animate={{ x: [0, 5, 0] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                        >
                                                            <ArrowRight className="w-4 h-4" />
                                                        </motion.div>
                                                    </Button>
                                                </motion.div>
                                            </CardFooter>

                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-muted-foreground">No services available. Add some services in your Supabase dashboard!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Booking Form Modal */}
            <AnimatePresence>
                {showBookingForm && selectedService && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={handleCloseBookingForm}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <Card className="w-full max-w-lg bg-background border-border shadow-2xl">
                                <CardHeader className="relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCloseBookingForm}
                                        className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        Book {selectedService.title}
                                    </CardTitle>
                                    <CardDescription>
                                        Fill in your details and we'll get back to you shortly
                                    </CardDescription>
                                    <div className="mt-2 text-lg font-semibold text-primary">
                                        {selectedService.price}
                                    </div>
                                </CardHeader>
                                <form onSubmit={handleSubmitBooking}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Name <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Your full name"
                                                value={bookingForm.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="your.email@example.com"
                                                value={bookingForm.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">
                                                Phone Number <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                value={bookingForm.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">
                                                Message (Optional)
                                            </Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us about your project or any specific requirements..."
                                                value={bookingForm.message}
                                                onChange={(e) => handleInputChange('message', e.target.value)}
                                                rows={4}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCloseBookingForm}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                                        >
                                            Submit Booking
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
