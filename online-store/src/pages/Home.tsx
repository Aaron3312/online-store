import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { useEffect, useState } from 'react';
import { Product } from "../types/products.ts";
import { fetchProducts } from '../services/api';
import { useSearchParams } from "react-router-dom";
import { Pagination } from "../components/Pagination";

export const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams] = useSearchParams();

    // Get query parameters
    const category = searchParams.get('category') || '';
    const searchQuery = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const { data, totalPages } = await fetchProducts({
                    page,
                    category,
                    query: searchQuery,
                    source: 'home'  // Added the source parameter
                });
                setProducts(data);
                setTotalPages(totalPages);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [page, category, searchQuery]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="home-page">
            <div className="home-header">
                <h1>Featured Products</h1>
                <SearchBar 
                    searchTerm={searchTerm} 
                    onSearch={setSearchTerm} 
                    onSearchSubmit={() => {
                        // Update URL with search parameters
                        const params = new URLSearchParams();
                        if (searchTerm) params.set('q', searchTerm);
                        if (category) params.set('category', category);
                        window.history.pushState({}, '', `?${params.toString()}`);
                    }}
                />
            </div>

            <div className="products-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="no-results">
                        <p>No products found matching your search.</p>
                    </div>
                )}
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage: number) => {
                    // Update URL with new page parameter
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('page', newPage.toString());
                    window.history.pushState({}, '', `?${params.toString()}`);
                }}
            />
        </div>
    );
}