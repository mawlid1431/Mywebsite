import { motion } from 'framer-motion';

export default function Terms() {
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
                                Terms & Conditions
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
                                    <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        By accessing and using this website or engaging my services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use my services.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Services</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        I provide web development, mobile app development, and digital consulting services. All services are provided on a project basis with terms outlined in individual project agreements. Specific deliverables, timelines, and costs will be detailed in project proposals.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Project Terms</h2>
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        When engaging my services:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                        <li>A detailed project proposal will be provided outlining scope, timeline, and costs</li>
                                        <li>Payment terms will be specified in the project agreement</li>
                                        <li>Changes to project scope may affect timeline and costs</li>
                                        <li>Both parties must agree to any significant changes in writing</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Upon full payment, you will own the final deliverables created specifically for your project. I retain the right to showcase the work in my portfolio unless otherwise agreed. Any pre-existing code, frameworks, or tools remain my property or that of their respective owners.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Client Responsibilities</h2>
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Clients are responsible for:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                        <li>Providing necessary content, materials, and access in a timely manner</li>
                                        <li>Timely feedback and approvals to maintain project timeline</li>
                                        <li>Payment according to agreed terms</li>
                                        <li>Ensuring they have rights to any materials provided</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Warranties and Limitations</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        I strive to deliver high-quality work but cannot guarantee specific results or outcomes. Services are provided "as is" without warranties of any kind. I am not liable for any indirect, incidental, or consequential damages arising from the use of my services.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Termination</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Either party may terminate a project with written notice. Upon termination, payment is due for work completed up to that point. Any deliverables completed and paid for will be provided to the client.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Confidentiality</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        I respect the confidentiality of client information and will not disclose sensitive project details without permission. Clients are expected to maintain confidentiality regarding any proprietary methods or processes shared during our collaboration.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        I reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this website. Continued use of my services after changes constitutes acceptance of the modified terms.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        For questions about these Terms & Conditions, please contact me at{' '}
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
