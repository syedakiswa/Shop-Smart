import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ProductList } from './pages/ProductList';
import { AddProduct } from './pages/AddProduct';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-500">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <ProductList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/add"
                  element={
                    <ProtectedRoute>
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <ProtectedRoute>
                      <ProductDetail />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Toaster position="top-center" richColors theme="dark" />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
