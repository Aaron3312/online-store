import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import {CartProvider} from "./context/CartContext.tsx";
import {OrderProvider} from "./context/OrderContext.tsx";
import {AdminProvider} from "./context/AdminContext.tsx";
import {initializeProducts} from "./services/productService";
import {AuthProvider} from "./context/AuthContext.tsx";

// Initialize products in Firestore
await initializeProducts();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
        <CartProvider>
            <OrderProvider>
                <AdminProvider>
                    <App />
                </AdminProvider>
            </OrderProvider>
        </CartProvider>
        </AuthProvider>
    </React.StrictMode>
);