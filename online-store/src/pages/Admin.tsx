import { useState, useEffect } from 'react';
import { ProductForm } from '../components/ProductForm';
import { ProductTable } from '../components/ProductTable';
import { Product } from '../types/products';
import { db } from '../services/firebaseConfig';
import { collection, getDocs, doc, deleteDoc} from 'firebase/firestore';
import { PlusCircle, Package, Search, RefreshCw } from 'lucide-react';
import '../admin.css';


export const Admin = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch products from Firestore
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const productsCollection = collection(db, 'products');
            const snapshot = await getDocs(productsCollection);
            const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
            setProducts(productsData);
        } catch (err) {
            setError('Failed to fetch products');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Add product to Firestore
    const addProduct = async (product: Product) => {
        try {
            setLoading(true);
            setProducts([...products, product]);
            return product;
        } catch (err) {
            setError('Failed to add product');
            console.error('Error adding product:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update product in Firestore
    const updateProduct = async (product: Product) => {
        try {
            setLoading(true);
            setProducts(products.map(p => p.id === product.id ? product : p));
        } catch (err) {
            setError('Failed to update product');
            console.error('Error updating product:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete product from Firestore
    const deleteProduct = async (productId: string) => {
        try {
            setLoading(true);
            await deleteDoc(doc(db, 'products', productId));
            setProducts(products.filter(p => p.id !== productId));
        } catch (err) {
            setError('Failed to delete product');
            console.error('Error deleting product:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (productData: Omit<Product, 'id'>) => {
        try {
            if (editingProduct) {
                await updateProduct({ ...productData, id: editingProduct.id });
            } else {
                await addProduct(productData as Product);
            }
            setEditingProduct(null);
        } catch (err) {
            // Error is already handled in individual functions
            console.log(err);
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <RefreshCw className="spin-animation" size={36} />
                </div>
                <p>Cargando productos...</p>
            </div>
        );
    }

    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="admin-header-content">
                    <h1><Package className="header-icon" /> Panel de Administración</h1>
                    <div className="admin-actions">
                        <button 
                            className="refresh-button" 
                            onClick={fetchProducts}
                            disabled={loading}
                        >
                            <RefreshCw size={16} />
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="container">
                {error && (
                    <div className="error-banner">
                        <div className="error-content">
                            <span>{error}</span>
                            <button onClick={() => setError(null)} className="dismiss-button">Cerrar</button>
                        </div>
                    </div>
                )}

                <div className="admin-layout">
                    <div className="admin-sidebar">
                        <div className="sidebar-header">
                            <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                            {editingProduct && (
                                <button 
                                    className="cancel-edit-button" 
                                    onClick={() => setEditingProduct(null)}
                                >
                                    Cancelar Edición
                                </button>
                            )}
                        </div>
                        <div className="form-container">
                            <ProductForm
                                product={editingProduct}
                                onSubmit={handleFormSubmit}
                                onCancel={() => setEditingProduct(null)}
                            />
                        </div>
                    </div>

                    <div className="admin-content">
                        <div className="inventory-header">
                            <h2><Package size={20} /> Inventario de Productos</h2>
                            <div className="search-container">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>
                        
                        {products.length === 0 ? (
                            <div className="no-products">
                                <div className="empty-state">
                                    <Package size={48} />
                                    <h3>No hay productos</h3>
                                    <p>Agrega tu primer producto utilizando el formulario</p>
                                    <button 
                                        className="add-first-product"
                                        onClick={() => document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        <PlusCircle size={16} />
                                        Agregar Producto
                                    </button>
                                </div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="no-search-results">
                                <h3>No se encontraron resultados para "{searchTerm}"</h3>
                                <button onClick={() => setSearchTerm('')} className="clear-search">
                                    Limpiar búsqueda
                                </button>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <ProductTable
                                    products={filteredProducts}
                                    onEdit={setEditingProduct}
                                    onDelete={deleteProduct}
                                />
                                <div className="product-count">
                                    Mostrando {filteredProducts.length} de {products.length} productos
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};