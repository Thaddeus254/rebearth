import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import ScrollToTop from './components/ScrollToTop';
import ScrollIndicator from './components/ScrollIndicator';
import Cart from './components/Cart';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    rotateX: 10
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0
  },
  out: {
    opacity: 0,
    y: -50,
    scale: 1.05,
    rotateX: -10
  }
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.8
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ transformOrigin: 'center center' }}
            >
              <Home />
            </motion.div>
          } 
        />
        <Route 
          path="/about" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ transformOrigin: 'center center' }}
            >
              <About />
            </motion.div>
          } 
        />
        <Route 
          path="/products" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ transformOrigin: 'center center' }}
            >
              <Products />
            </motion.div>
          } 
        />
        <Route 
          path="/services" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ transformOrigin: 'center center' }}
            >
              <Services />
            </motion.div>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ transformOrigin: 'center center' }}
            >
              <Contact />
            </motion.div>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ transformOrigin: 'center center' }}
            >
              <Checkout />
            </motion.div>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ transformOrigin: 'center center' }}
            >
              <Payment />
            </motion.div>
          } 
        />
        <Route 
          path="/login" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ transformOrigin: 'center center' }}
            >
              <Login />
            </motion.div>
          } 
        />
        <Route 
          path="/register" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ transformOrigin: 'center center' }}
            >
              <Register />
            </motion.div>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ transformOrigin: 'center center' }}
            >
              <Profile />
            </motion.div>
          } 
        />
        <Route 
          path="*" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ transformOrigin: 'center center' }}
            >
              <NotFound />
            </motion.div>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-pattern">
            <Header />
            <main className="pt-16">
              <AnimatedRoutes />
            </main>
            <Footer />
            <ChatBot />
            <ScrollToTop />
            <ScrollIndicator />
            <Cart />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;