import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import AdminSettings from './AdminSettings';
import {
  getServices,
  getProjects,
  addService,
  addProject,
  updateService,
  updateProject,
  deleteService,
  deleteProject,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getContacts,
  updateContactStatus,
  deleteContact,
  Order,
  Contact
} from '../utils/supabase/database';
import { Service, Project } from '../utils/supabase/client';
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Users,
  Briefcase,
  Globe,
  RefreshCw,
  ArrowLeft,
  ShoppingCart,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Mail,
  Phone,
  MapPin,
  Moon,
  Sun,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'contacts' | 'orders' | 'services' | 'projects' | 'settings'>('contacts');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Form states
  const [serviceForm, setServiceForm] = useState({
    name: '',
    price: '',
    description: ''
  });

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    is_live: false,
    link: '',
    image: '',
    technology: '',
    official_link: ''
  });

  // Auto-logout functionality
  const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminSession');
    sessionStorage.removeItem('adminSessionActive');
    toast.info('Session expired. Please login again.');
    onLogout();
    navigate('/admin');
  }, [onLogout, navigate]);

  // Check session validity
  const checkSession = useCallback(() => {
    const sessionActive = sessionStorage.getItem('adminSessionActive');
    const sessionData = localStorage.getItem('adminSession');

    // If tab was closed (sessionStorage cleared), logout
    if (!sessionActive) {
      handleLogout();
      return false;
    }

    if (sessionData) {
      const session = JSON.parse(sessionData);
      const now = Date.now();
      const timeSinceLastActivity = now - session.lastActivity;

      // If inactive for more than 1 hour, logout
      if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
        handleLogout();
        return false;
      }
    }
    return true;
  }, [handleLogout, INACTIVITY_TIMEOUT]);

  // Update last activity time
  const updateActivity = useCallback(() => {
    const sessionData = localStorage.getItem('adminSession');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      session.lastActivity = Date.now();
      localStorage.setItem('adminSession', JSON.stringify(session));
    }
  }, []);

  // Set up activity tracking and session checking
  useEffect(() => {
    // Check session on mount
    if (!checkSession()) return;

    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Check session every minute
    const sessionCheckInterval = setInterval(() => {
      checkSession();
    }, 60000); // Check every minute

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(sessionCheckInterval);
    };
  }, [checkSession, updateActivity]);

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesData, projectsData, ordersData, contactsData] = await Promise.all([
        getServices(),
        getProjects(),
        getOrders(),
        getContacts()
      ]);
      setServices(servicesData);
      setProjects(projectsData);
      setOrders(ordersData);
      setContacts(contactsData);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Contact handlers
  const handleContactStatusUpdate = async (contactId: number, newStatus: Contact['status']) => {
    try {
      await updateContactStatus(contactId, newStatus);
      toast.success('Contact status updated successfully');
      await loadData();
    } catch (error) {
      toast.error('Failed to update contact status');
      console.error('Error updating contact status:', error);
    }
  };

  const handleContactDelete = async (contactId: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(contactId);
        toast.success('Contact deleted successfully');
        await loadData();
      } catch (error) {
        toast.error('Failed to delete contact');
        console.error('Error deleting contact:', error);
      }
    }
  };

  const openContactDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactDialog(true);
  };

  const getContactStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-600';
      case 'read': return 'bg-yellow-600';
      case 'replied': return 'bg-green-600';
      case 'archived': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  // Service handlers
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        const updated = await updateService(editingService.id, serviceForm);
        if (updated) {
          toast.success('Service updated successfully');
          await loadData();
        }
      } else {
        const added = await addService(serviceForm);
        if (added) {
          toast.success('Service added successfully');
          await loadData();
        }
      }
      resetServiceForm();
    } catch (error) {
      toast.error('Failed to save service');
      console.error('Error saving service:', error);
    }
  };

  const handleServiceDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const deleted = await deleteService(id);
        if (deleted) {
          toast.success('Service deleted successfully');
          await loadData();
        }
      } catch (error) {
        toast.error('Failed to delete service');
        console.error('Error deleting service:', error);
      }
    }
  };

  const resetServiceForm = () => {
    setServiceForm({ name: '', price: '', description: '' });
    setEditingService(null);
    setShowServiceDialog(false);
  };

  const openServiceDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        price: service.price,
        description: service.description
      });
    } else {
      resetServiceForm();
    }
    setShowServiceDialog(true);
  };

  // Project handlers
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const updated = await updateProject(editingProject.id, projectForm);
        if (updated) {
          toast.success('Project updated successfully');
          await loadData();
        }
      } else {
        const added = await addProject(projectForm);
        if (added) {
          toast.success('Project added successfully');
          await loadData();
        }
      }
      resetProjectForm();
    } catch (error) {
      toast.error('Failed to save project');
      console.error('Error saving project:', error);
    }
  };

  const handleProjectDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const deleted = await deleteProject(id);
        if (deleted) {
          toast.success('Project deleted successfully');
          await loadData();
        }
      } catch (error) {
        toast.error('Failed to delete project');
        console.error('Error deleting project:', error);
      }
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      name: '',
      description: '',
      is_live: false,
      link: '',
      image: '',
      technology: '',
      official_link: ''
    });
    setEditingProject(null);
    setShowProjectDialog(false);
  };

  const openProjectDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        name: project.name,
        description: project.description,
        is_live: project.is_live,
        link: project.link || '',
        image: project.image || '',
        technology: project.technology,
        official_link: project.official_link || ''
      });
    } else {
      resetProjectForm();
    }
    setShowProjectDialog(true);
  };

  // Order handlers
  const handleOrderStatusUpdate = async (orderId: number, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      await loadData();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  const handleOrderDelete = async (orderId: number) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId);
        toast.success('Order deleted successfully');
        await loadData();
      } catch (error) {
        toast.error('Failed to delete order');
        console.error('Error deleting order:', error);
      }
    }
  };

  const openOrderDialog = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600';
      case 'confirmed': return 'bg-blue-600';
      case 'processing': return 'bg-purple-600';
      case 'shipped': return 'bg-orange-600';
      case 'delivered': return 'bg-green-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-xl border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </button>
              <div className="w-px h-6 bg-border"></div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={loadData}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="relative overflow-hidden"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: darkMode ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.div>
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Contacts</CardTitle>
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{contacts.length}</div>
                <p className="text-xs text-muted-foreground">
                  {contacts.filter(c => c.status === 'new').length} new messages
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{orders.length}</div>
                <p className="text-xs text-muted-foreground">
                  {orders.filter(o => o.status === 'pending').length} pending orders
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Services</CardTitle>
                <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{services.length}</div>
                <p className="text-xs text-muted-foreground">Active service offerings</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Projects</CardTitle>
                <Globe className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{projects.length}</div>
                <p className="text-xs text-muted-foreground">
                  {projects.filter(p => p.is_live).length} live projects
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setActiveTab('contacts')}
            variant={activeTab === 'contacts' ? 'default' : 'outline'}
            className={activeTab === 'contacts'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : ''
            }
          >
            <Mail className="w-4 h-4 mr-2" />
            Contacts
          </Button>
          <Button
            onClick={() => setActiveTab('orders')}
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            className={activeTab === 'orders'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : ''
            }
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Orders
          </Button>
          <Button
            onClick={() => setActiveTab('services')}
            variant={activeTab === 'services' ? 'default' : 'outline'}
            className={activeTab === 'services'
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : ''
            }
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Services
          </Button>
          <Button
            onClick={() => setActiveTab('projects')}
            variant={activeTab === 'projects' ? 'default' : 'outline'}
            className={activeTab === 'projects'
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : ''
            }
          >
            <Globe className="w-4 h-4 mr-2" />
            Projects
          </Button>
          <Button
            onClick={() => setActiveTab('settings')}
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            className={activeTab === 'settings'
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : ''
            }
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'contacts' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="contacts"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Contact Messages</h2>
              <div className="text-sm text-muted-foreground">
                {contacts.filter(c => c.status === 'new').length} new messages
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading contacts...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-foreground flex items-center gap-2">
                          {contact.name}
                          <Badge className={`${getContactStatusColor(contact.status)} text-white`}>
                            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {contact.email} • {contact.phone || 'No phone'}
                        </CardDescription>
                        <CardDescription className="text-xs text-muted-foreground/70">
                          {new Date(contact.created_at).toLocaleDateString()} at {new Date(contact.created_at).toLocaleTimeString()}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => openContactDialog(contact)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select
                          value={contact.status}
                          onValueChange={(value) => handleContactStatusUpdate(contact.id, value as Contact['status'])}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="replied">Replied</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={() => handleContactDelete(contact.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        <p className="line-clamp-2">{contact.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {contacts.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No contact messages yet</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : activeTab === 'orders' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="orders"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Orders Management</h2>
              <div className="text-sm text-muted-foreground">
                {orders.filter(o => o.status === 'pending').length} pending orders
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading orders...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <Card key={order.id} className="bg-card/50 border-border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                          <CardTitle className="text-foreground flex items-center gap-2">
                            Order #{order.order_id}
                            <Badge className={`${getStatusColor(order.status)} text-white flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {order.customer_name} • {order.customer_email}
                          </CardDescription>
                          <CardDescription className="text-xs text-muted-foreground/70">
                            {new Date(order.created_at).toLocaleDateString()} • Total: ${order.total.toFixed(2)}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => openOrderDialog(order)}
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleOrderStatusUpdate(order.id, value as Order['status'])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => handleOrderDelete(order.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          <p>{order.items.length} item(s) • Subtotal: ${order.subtotal.toFixed(2)} • Tax: ${order.tax.toFixed(2)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {orders.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No orders yet</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : activeTab === 'services' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="services"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Services Management</h2>
              <Button onClick={() => openServiceDialog()} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading services...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {services.map((service) => (
                  <Card key={service.id} className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-foreground">{service.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {service.price}
                        </CardDescription>
                        <CardDescription className="text-xs text-muted-foreground/70">
                          Created: {new Date(service.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => openServiceDialog(service)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleServiceDelete(service.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        <p className="line-clamp-2">{service.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {services.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No services yet</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : activeTab === 'projects' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="projects"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Projects Management</h2>
              <Button onClick={() => openProjectDialog()} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading projects...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-foreground flex items-center gap-2">
                          {project.name}
                          {project.is_live && (
                            <Badge className="bg-green-600 text-white">
                              Live
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {project.technology}
                        </CardDescription>
                        <CardDescription className="text-xs text-muted-foreground/70">
                          Created: {new Date(project.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        {project.link && (
                          <Button
                            onClick={() => window.open(project.link, '_blank')}
                            size="sm"
                            variant="outline"
                          >
                            <Globe className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => openProjectDialog(project)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleProjectDelete(project.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        <p className="line-clamp-2">{project.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No projects yet</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : activeTab === 'settings' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="settings"
          >
            <AdminSettings />
          </motion.div>
        ) : null}
      </div>

      {/* Service Dialog */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              {editingService ? 'Update service information' : 'Create a new service offering'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleServiceSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Service Name</label>
              <Input
                value={serviceForm.name}
                onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter service name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price</label>
              <Input
                value={serviceForm.price}
                onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="e.g., $500-$2000"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={serviceForm.description}
                onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the service"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetServiceForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingService ? 'Update' : 'Create'} Service
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Project Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            <DialogDescription>
              {editingProject ? 'Update project information' : 'Create a new project entry'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProjectSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  value={projectForm.name}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Technology Stack</label>
                <Input
                  value={projectForm.technology}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, technology: e.target.value }))}
                  placeholder="React, TypeScript, etc."
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the project"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Project Link</label>
                <Input
                  value={projectForm.link}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://project-url.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={projectForm.image}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://image-url.com/image.jpg"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_live"
                checked={projectForm.is_live}
                onChange={(e) => setProjectForm(prev => ({ ...prev, is_live: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="is_live" className="text-sm font-medium">Project is live</label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetProjectForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingProject ? 'Update' : 'Create'} Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Order #{selectedOrder.order_id}
                  <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Placed on {new Date(selectedOrder.created_at).toLocaleDateString()} at {new Date(selectedOrder.created_at).toLocaleTimeString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Customer Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Customer Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{selectedOrder.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${selectedOrder.customer_email}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                          {selectedOrder.customer_email}
                        </a>
                      </div>
                      {selectedOrder.customer_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href={`tel:${selectedOrder.customer_phone}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                            {selectedOrder.customer_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {selectedOrder.address_street && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Shipping Address</h3>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                        <div className="text-foreground">
                          <p>{selectedOrder.address_street}</p>
                          <p>{selectedOrder.address_city} {selectedOrder.address_postal}</p>
                          <p>{selectedOrder.address_country}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <p className="text-xs text-muted-foreground">Category: {item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                          <p className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Order Summary</h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                      <span>Total:</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(`mailto:${selectedOrder.customer_email}?subject=Order Update - ${selectedOrder.order_id}`, '_blank')}
                    variant="outline"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Customer
                  </Button>
                  {selectedOrder.customer_phone && (
                    <Button
                      onClick={() => window.open(`tel:${selectedOrder.customer_phone}`, '_blank')}
                      variant="outline"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Customer
                    </Button>
                  )}
                </div>
                <Button
                  onClick={() => setShowOrderDialog(false)}
                  variant="secondary"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Details Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedContact && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Contact Message from {selectedContact.name}
                  <Badge className={`${getContactStatusColor(selectedContact.status)} text-white`}>
                    {selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Received on {new Date(selectedContact.created_at).toLocaleDateString()} at {new Date(selectedContact.created_at).toLocaleTimeString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedContact.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${selectedContact.email}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                        {selectedContact.email}
                      </a>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${selectedContact.phone}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Message</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: Your Contact Form Message`, '_blank')}
                    variant="outline"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reply via Email
                  </Button>
                  {selectedContact.phone && (
                    <Button
                      onClick={() => window.open(`tel:${selectedContact.phone}`, '_blank')}
                      variant="outline"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  )}
                </div>
                <Button
                  onClick={() => setShowContactDialog(false)}
                  variant="secondary"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;