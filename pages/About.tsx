import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Code, Users, Award, GraduationCap, Briefcase, Globe, Mail, Star, ExternalLink } from 'lucide-react';

const profileImage2 = "/images/profile-image.jpg";

export default function About() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* About Section */}
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
                                About Me
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="text-xl text-muted-foreground max-w-3xl mx-auto"
                            >
                                Passionate about creating digital solutions that make a difference in communities worldwide
                            </motion.p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                        {/* Profile Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            viewport={{ once: true }}
                            className="mt-20 flex justify-center"
                        >
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.08, rotateY: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    animate={{ y: [0, -8, 0], rotateX: [0, 2, 0, -2, 0] }}
                                    transition={{
                                        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                        rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="w-80 h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-background cursor-pointer"
                                >
                                    <img
                                        src={profileImage2}
                                        alt="Mowlid Mohamud in office"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0, rotate: 0 }}
                                            whileHover={{ scale: 1, rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                                        >
                                            <Star className="w-8 h-8 text-white" />
                                        </motion.div>
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    viewport={{ once: true }}
                                    className="absolute -right-8 top-8"
                                >
                                    <Badge className="bg-primary text-primary-foreground px-4 py-2 shadow-lg">
                                        <Star className="w-4 h-4 mr-2" />
                                        Hi I am Mowlid Haibe
                                    </Badge>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Education Section */}
            <section className="py-32 bg-muted/30 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
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
                                Education & Learning
                            </motion.h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: GraduationCap,
                                    title: 'Bachelor of Computer Science',
                                    institution: 'Albukhary International University (Malaysia)',
                                    status: 'Current',
                                    color: 'from-blue-500 to-cyan-500',
                                    link: 'https://aiu.edu.my/'
                                },
                                {
                                    icon: Award,
                                    title: 'Google Project Management Certificate',
                                    institution: 'Google\'s professional certification program focused on project planning, agile methodologies, stakeholder management, risk assessment, and leadership in real-world projects.',
                                    status: 'Completed (Dec 2023 – Aug 2024)',
                                    color: 'from-red-500 to-orange-500',
                                    link: 'https://www.coursera.org/programs/kiron-open-higher-education-learning-program-55mz5/professional-certificates/google-project-management'
                                },
                                {
                                    icon: Award,
                                    title: 'Full Stack Web Developer Graduate',
                                    institution: 'FikrCamp - Comprehensive full-stack development program covering modern web technologies, frameworks, and best practices',
                                    status: 'Completed (2023-2024)',
                                    color: 'from-purple-500 to-pink-500',
                                    link: 'https://www.fikrcamp.com/'
                                },
                                {
                                    icon: Award,
                                    title: 'IBM Full Stack Developer Graduate',
                                    institution: 'IBM Professional Certificate - Advanced full-stack development with enterprise-level technologies and cloud computing',
                                    status: 'Completed (2025)',
                                    color: 'from-blue-600 to-indigo-600',
                                    link: 'https://www.coursera.org/programs/kiron-open-higher-education-learning-program-55mz5/professional-certificates/ibm-full-stack-cloud-developer'
                                },
                                {
                                    icon: Award,
                                    title: 'ALX Africa - Software Engineering Graduate',
                                    institution: 'Comprehensive software engineering program',
                                    status: 'Completed',
                                    color: 'from-orange-500 to-red-500',
                                    link: 'https://www.alxafrica.com/'
                                },
                                {
                                    icon: Code,
                                    title: 'Hargabits Digital School - Graduate',
                                    institution: 'Digital skills and technology training',
                                    status: 'Completed',
                                    color: 'from-green-500 to-emerald-500',
                                    link: 'https://shaqodoon.org/project-listing/bits-school-digital-design-hargabits-garobits'
                                }
                            ].map((edu, index) => (
                                <motion.div
                                    key={edu.title}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.2 }}
                                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                    viewport={{ once: true }}
                                    onClick={() => edu.link && window.open(edu.link, '_blank')}
                                    className={edu.link ? 'cursor-pointer' : ''}
                                >
                                    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm h-full group">
                                        <CardHeader className="pb-4">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${edu.color} flex items-center justify-center mb-4 shadow-lg`}
                                            >
                                                <edu.icon className="w-6 h-6 text-white" />
                                            </motion.div>
                                            <CardTitle className="group-hover:text-primary transition-colors">{edu.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed mb-4">{edu.institution}</p>
                                            <Badge
                                                variant={edu.status === 'Current' ? 'default' : 'secondary'}
                                                className="mb-2"
                                            >
                                                {edu.status}
                                            </Badge>
                                        </CardContent>
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Experience Section */}
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
                                Experience & Social Impact
                            </motion.h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                            {[
                                {
                                    icon: Globe,
                                    title: 'Somaliland Standard - Digital Media & Protocol Manager (2023)',
                                    description: 'Led digital media coverage and protocol management for Africa Science Week, coordinating across 11 African countries including Somaliland',
                                    skills: ['Digital Media', 'Protocol Management', 'International Coordination', 'Event Coverage'],
                                    color: 'from-indigo-500 to-purple-500',
                                    link: 'https://somalilandstandard.com/africa-science-week-starts-in-11-african-countries-including-somaliland/'
                                },
                                {
                                    icon: Briefcase,
                                    title: 'BarkulanHub - Head of Community & Communication Manager',
                                    description: 'Built their website and managed community growth, leading digital transformation initiatives',
                                    skills: ['Community Management', 'Web Development', 'Digital Marketing'],
                                    color: 'from-blue-500 to-cyan-500'
                                },
                                {
                                    icon: Users,
                                    title: 'Mansa Musa Start School - Head of Communication & Trainer',
                                    description: 'Trained 12+ youth in entrepreneurship & fundraising, developing comprehensive training programs',
                                    skills: ['Training & Development', 'Entrepreneurship', 'Public Speaking'],
                                    color: 'from-purple-500 to-pink-500'
                                },
                                {
                                    icon: Globe,
                                    title: 'Sirta Maanka Mental Health Org - Media & Communications',
                                    description: 'Mental health awareness and community support through digital platforms and outreach',
                                    skills: ['Mental Health Advocacy', 'Content Creation', 'Community Outreach'],
                                    color: 'from-green-500 to-emerald-500'
                                },
                                {
                                    icon: Mail,
                                    title: 'Shaqdoo.org - Communication Intern',
                                    description: 'Digital communication and outreach, building connections across diverse communities',
                                    skills: ['Digital Communication', 'Social Media', 'Community Building'],
                                    color: 'from-orange-500 to-red-500'
                                }
                            ].map((exp, index) => (
                                <motion.div
                                    key={exp.title}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    viewport={{ once: true }}
                                    onClick={() => exp.link && window.open(exp.link, '_blank')}
                                    className={exp.link ? 'cursor-pointer' : ''}
                                >
                                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group relative">
                                        <CardHeader>
                                            <div className="flex items-start gap-6">
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                                                >
                                                    <exp.icon className="w-7 h-7 text-white" />
                                                </motion.div>
                                                <div className="flex-1">
                                                    <CardTitle className="group-hover:text-primary transition-colors text-xl mb-3 flex items-center gap-2">
                                                        {exp.title}
                                                        {exp.link && (
                                                            <motion.div
                                                                animate={{ x: [0, 5, 0] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </motion.div>
                                                        )}
                                                    </CardTitle>
                                                    <p className="text-base leading-relaxed mb-4 text-muted-foreground">
                                                        {exp.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {exp.skills.map((skill) => (
                                                            <Badge key={skill} variant="secondary" className="text-xs">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        {exp.link && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute top-4 right-4"
                                            >
                                                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 shadow-lg">
                                                    <Globe className="w-3 h-3 mr-1" />
                                                    Featured
                                                </Badge>
                                            </motion.div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
