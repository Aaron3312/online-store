// Products.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { FilterSidebar } from '../components/FilterSidebar';
import { Pagination } from '../components/Pagination';
import { Product } from '../types/products';
import { fetchProducts } from '../services/productService';

export const Products = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);

    const [showMobileFilters, setShowMobileFilters] = useState(false);

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
                    source: 'products'
                });
                setProducts(data);
                setTotalPages(totalPages);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError('Failed to load products: ' + errorMessage);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [page, category, searchQuery]);

    const resetFilters = () => {
        window.location.href = '/products';
    };

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="container">
                <h1 className="page-title">
                    {category ? `${category} Products` : 'All Products'}
                </h1>

                <div className="products-header">
                    <SearchBar initialValue={searchQuery} />
                    <button
                        className="mobile-filter-button"
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        aria-expanded={showMobileFilters}
                        aria-controls="filter-container"
                    >
                        {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                <div className="products-layout">
                    <div 
                        id="filter-container"
                        className={`filter-container ${showMobileFilters ? 'mobile-visible' : ''}`}
                    >
                        <button
                            className="close-mobile-filters"
                            onClick={() => setShowMobileFilters(false)}
                            aria-label="Close filters"
                        >
                            &times;
                        </button>
                        <FilterSidebar
                            currentCategory={category}
                            className="desktop-filters"
                        />
                    </div>

                    <main className="products-grid-container">
                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Loading products...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="products-grid">
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    maxVisible={5}
                                />
                            </>
                        ) : (
                            <div className="no-results">
                                <p>No products found matching your criteria.</p>
                                <button
                                    onClick={resetFilters}
                                    className="reset-filters"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
