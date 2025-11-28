import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Button } from './components/ui/button';
// Badge import removed - not used in this file
import { Separator } from './components/ui/separator';
import { Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Components
import Layout from './components/Layout';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import DatabaseDebug from './components/DatabaseDebug';
import SimpleTest from './components/SimpleTest';
import EmailTest from './components/EmailTest';
import DatabaseTest from './components/DatabaseTest';

interface CartItem {
  id: string;
  title: string;
  description: string;
  price: string;
  quantity: number;
  category: string;
}

const AppRouter: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  const addToCart = (service: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        return prev.map(item =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Extract price number from price string
      const priceMatch = service.price.match(/\$(\d+)/);
      const priceNum = priceMatch ? parseInt(priceMatch[1]) : 0;
      return [...prev, { ...service, quantity: 1, price: priceNum }];
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseInt(item.price.replace(/\D/g, '')) : item.price;
    return sum + (price * item.quantity);
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Main portfolio routes with Layout */}
        <Route path="/" element={
          <Layout darkMode={darkMode} setDarkMode={setDarkMode} cart={cart} onCartClick={() => setShowCart(true)}>
            <Home />
          </Layout>
        } />

        <Route path="/about" element={
          <Layout darkMode={darkMode} setDarkMode={setDarkMode} cart={cart} onCartClick={() => setShowCart(true)}>
            <About />
          </Layout>
        } />

        <Route path="/projects" element={
          <Layout darkMode={darkMode} setDarkMode={setDarkMode} cart={cart} onCartClick={() => setShowCart(true)}>
            <Projects />
          </Layout>
        } />

        <Route path="/services" element={
          <Layout darkMode={darkMode} setDarkMode={setDarkMode} cart={cart} onCartClick={() => setShowCart(true)}>
            <Services onAddToCart={addToCart} />
          </Layout>
        } />

        <Route path="/contact" element={
          <Layout darkMode={darkMode} setDarkMode={setDarkMode} cart={cart} onCartClick={() => setShowCart(true)}>
            <Contact />
          </Layout>
        } />

        <Route path="/testimonials" element={
          <Layout darkMode={darkMode} setDarkMode={setDarkMode} cart={cart} onCartClick={() => setShowCart(true)}>
            <Testimonials />
          </Layout>
        } />

        <Route path="/faq" element={
          <Layout darkMode={darkMode} setDarkMode={setDarkMode} cart={cart} onCartClick={() => setShowCart(true)}>
            <FAQ />
          </Layout>
        } />

        <Route path="/privacy" element={
          <Layout darkMode={darkMode} setDarkMode={setDarkMode} cart={cart} onCartClick={() => setShowCart(true)}>
            <Privacy />
          </Layout>
        } />

        <Route path="/terms" element={
          <Layout darkMode={darkMode} setDarkMode={setDarkMode} cart={cart} onCartClick={() => setShowCart(true)}>
            <Terms />
          </Layout>
        } />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            isAuthenticated ?
              <Navigate to="/admin/dashboard" replace /> :
              <AdminLogin onLogin={handleLogin} />
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated ?
              <AdminDashboard onLogout={handleLogout} /> :
              <Navigate to="/admin" replace />
          }
        />

        {/* Debug routes */}
        <Route path="/debug" element={<DatabaseDebug />} />
        <Route path="/test" element={<SimpleTest />} />
        <Route path="/email-test" element={<EmailTest />} />
        <Route path="/db-test" element={<DatabaseTest />} />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* WhatsApp Float Button */}
      <motion.a
        href="https://wa.me/601725889925"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50 group"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <MessageCircle className="w-7 h-7" />
        </motion.div>
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
      </motion.a>

      {/* Cart Dialog */}
      <AnimatePresence>
        {showCart && (
          <Dialog open={showCart} onOpenChange={setShowCart}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Shopping Cart</DialogTitle>
                <DialogDescription>
                  {cart.length === 0 ? 'Your cart is empty' : `${cart.reduce((sum, item) => sum + item.quantity, 0)} item(s) in cart`}
                </DialogDescription>
              </DialogHeader>

              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 text-center text-muted-foreground"
                >
                  Your cart is empty
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-4 border rounded-lg bg-card/50"
                    >
                      <div className="flex-1">
                        <h4>{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{typeof item.price === 'string' ? item.price : `$${item.price}`}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Shipping:</span>
                      <span>FREE 🎉</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setShowCart(false)}
                      className="w-full bg-gradient-to-r from-primary to-primary/80"
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Router>
  );
};

export default AppRouter;