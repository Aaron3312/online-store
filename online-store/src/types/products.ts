// src/types/products.ts
export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    image: string;
    rating: number;
    category: string;
    stock: number;
    createdAt: Date;
};

export interface AdminContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;
};

export interface ProductsResponse {
    data: Product[];
    totalPages: number;
    currentPage: number;
}