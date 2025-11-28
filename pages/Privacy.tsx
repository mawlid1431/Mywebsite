import { motion } from 'framer-motion';

export default function Privacy() {
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
                                Privacy Policy
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-muted-foreground"
                            >
                                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="prose prose-lg dark:prose-invert max-w-none"
                        >
                            <div className="space-y-8 text-foreground">
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        This Privacy Policy describes how I collect, use, and protect your personal information when you visit my portfolio website or use my services. I am committed to ensuring your privacy and protecting your personal data.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Information I Collect</h2>
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        I may collect the following types of information:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                        <li>Contact information (name, email address, phone number) when you reach out through the contact form</li>
                                        <li>Project details and requirements you share during consultations</li>
                                        <li>Usage data and analytics to improve website performance</li>
                                        <li>Communication history for project management purposes</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">How I Use Your Information</h2>
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Your information is used to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                        <li>Respond to your inquiries and provide requested services</li>
                                        <li>Communicate about projects and deliverables</li>
                                        <li>Improve my services and website experience</li>
                                        <li>Send project updates and relevant information</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        I implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Your data is stored securely and is only accessible to authorized personnel.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        This website may use third-party services for analytics and functionality. These services have their own privacy policies, and I encourage you to review them. I do not sell or share your personal information with third parties for marketing purposes.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        You have the right to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                        <li>Access the personal information I hold about you</li>
                                        <li>Request correction of inaccurate information</li>
                                        <li>Request deletion of your personal data</li>
                                        <li>Opt-out of communications at any time</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        If you have any questions about this Privacy Policy or how your data is handled, please contact me at{' '}
                                        <a href="mailto:malitmohamud@gmail.com" className="text-primary hover:underline">
                                            malitmohamud@gmail.com
                                        </a>
                                    </p>
                                </section>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
