// src/services/api.ts
import { Product, ProductsResponse } from '../types/products';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { app } from '../firebase/config'; // Make sure to import your Firebase app


// Initialize Firestore
const db = getFirestore(app);

// Generate 10 products for simulation
const products = [
  { 
    title: "Wireless Mouse", 
    description: "Ergonomic wireless mouse with long battery life.", 
    price: 25.99, 
    category: "Electronics", 
    image: "https://www.keychron.mx/cdn/shop/files/Lemokey-G1-wireless-mouse-black.jpg?v=1724653193", 
    stock: 50, 
    rating: 4.5, 
    createdAt: new Date() 
  } as Product,
  { 
    title: "Mechanical Keyboard", 
    description: "RGB mechanical keyboard with blue switches.", 
    price: 79.99, 
    category: "Electronics", 
    image: "https://media.wired.com/photos/65b0438c22aa647640de5c75/master/w_2560%2Cc_limit/Mechanical-Keyboard-Guide-Gear-GettyImages-1313504623.jpg", 
    stock: 30, 
    rating: 4.7, 
    createdAt: new Date() 
  } as Product,
  { 
    title: "Gaming Headset", 
    description: "Surround sound gaming headset with noise cancellation.", 
    price: 49.99, 
    category: "Accessories", 
    image: "https://assets2.razerzone.com/images/pnx.assets/57c2af30b5d9a2b699b3e896b788e00f/headset-landingpg-500x500-blacksharkv2pro2023.jpg", 
    stock: 20, 
    rating: 4.6, 
    createdAt: new Date() 
  } as Product,
  { 
    title: "Smartphone Stand", 
    description: "Adjustable smartphone stand for desk use.", 
    price: 15.99, 
    category: "Accessories", 
    image: "https://www.apps2car.com/cdn/shop/products/tripod-phone-stand.jpg?v=1652323294", 
    stock: 100, 
    rating: 4.3, 
    createdAt: new Date() 
  } as Product,
  { 
    title: "Bluetooth Speaker", 
    description: "Portable Bluetooth speaker with deep bass.", 
    price: 39.99, 
    category: "Audio", 
    image: "https://cdn.thewirecutter.com/wp-content/media/2024/11/portablebluetoothspeakers-2048px-9481.jpg?auto=webp&quality=75&width=1024", 
    stock: 25, 
    rating: 4.8, 
    createdAt: new Date() 
  } as Product,
  { 
    title: "USB-C Hub", 
    description: "5-in-1 USB-C hub with HDMI and SD card reader.", 
    price: 29.99, 
    category: "Electronics", 
    image: "https://m.media-amazon.com/images/I/61Bm+9UTP6L._AC_UF1000,1000_QL80_.jpg", 
    stock: 40, 
    rating: 4.5, 
    createdAt: new Date() 
  } as Product,
  { 
    title: "Laptop Stand", 
    description: "Aluminum laptop stand for better ergonomics.", 
    price: 34.99, 
    category: "Office", 
    image: "https://m.media-amazon.com/images/I/71xlXzGX9aL._AC_SL1500_.jpg", 
    stock: 60, 
    rating: 4.7, 
    createdAt: new Date() 
  } as Product,
  { 
    title: "Wireless Charger", 
    description: "Fast wireless charger for Qi-compatible devices.", 
    price: 19.99, 
    category: "Accessories", 
    image: "https://www.ikea.com/mx/en/images/products/livboj-wireless-charger-white__0721950_pe733427_s5.jpg?f=s", 
    stock: 35, 
    rating: 4.6, 
    createdAt: new Date() 
  } as Product,
  { 
    title: "Noise Cancelling Earbuds", 
    description: "Wireless earbuds with active noise cancellation.", 
    price: 89.99, 
    category: "Audio", 
    image: "https://cdn.thewirecutter.com/wp-content/media/2023/09/noise-cancelling-headphone-2048px-0872.jpg", 
    stock: 15, 
    rating: 4.9, 
    createdAt: new Date() 
  } as Product,
  { 
    title: "4K Monitor", 
    description: "27-inch 4K UHD monitor with HDR support.", 
    price: 299.99, 
    category: "Electronics", 
    image: "https://assets-prd.ignimgs.com/2024/10/08/alienware-aw3225qf-1718732594021-1728418469322.jpg", 
    stock: 10, 
    rating: 4.8, 
    createdAt: new Date() 
  } as Product
];

// Function to initialize products in Firestore
export const initializeProducts = async () => {
  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);
    if (snapshot.size === 0) {
      for (const product of products) {
        await addDoc(productsCollection, product);
        console.log(`Added: ${product.title}`);
      }
      console.log("All products added successfully.");
    }
  } catch (error) {
    console.error("Error initializing products: ", error);
  }
};

// Function to get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      title: doc.data().title,
      description: doc.data().description,
      price: doc.data().price,
      category: doc.data().category,
      image: doc.data().image,
      stock: doc.data().stock,
      rating: doc.data().rating,
      createdAt: doc.data().createdAt
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Function to fetch products with pagination, filtering, and search
export const fetchProducts = async (params: {
  page: number;
  perPage?: number;
  category?: string;
  query?: string;
  source: string;
}): Promise<ProductsResponse> => {
  try {
    const allProducts = await getProducts();
    
    // Filter by category if provided
    let filteredProducts = allProducts;
    if (params.category) {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === params.category.toLowerCase()
      );
    }

    // Filter by search query if provided
    if (params.query) {
      const query = params.query.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Calculate pagination
    const perPage = params.perPage || 10;
    const start = (params.page - 1) * perPage;
    const end = start + perPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    return {
      data: paginatedProducts,
      totalPages: Math.ceil(filteredProducts.length / perPage),
      currentPage: params.page
    } as ProductsResponse;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Utility function for single product fetch
export const fetchProductById = async (id: number): Promise<Product | undefined> => {
  const allProducts = await getProducts();
  return allProducts.find(p => p.id === id);
};

// Function to add a new product
export const addProduct = async (product: Omit<Product, 'id'>): Promise<number> => {
  try {
    // Get the current highest ID
    const allProducts = await getProducts();
    const maxId = allProducts.reduce((max, p) => Math.max(max, p.id || 0), 0);
    
    // Create new product with incremented ID
    const newProduct = {
      ...product,
      id: maxId + 1,
      createdAt: new Date()
    };
    
    // Add to Firestore
    const productsCollection = collection(db, "products");
    await addDoc(productsCollection, newProduct);
    
    return newProduct.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Function to update a product
export const updateProduct = async (product: Product): Promise<void> => {
  try {
    // Find the Firestore document with the matching product ID
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);
    
    const docToUpdate = snapshot.docs.find(doc => {
      const data = doc.data();
      return data.id === product.id;
    });
    
    if (docToUpdate) {
      const productRef = doc(db, "products", docToUpdate.id);
      await updateDoc(productRef, { ...product });
    } else {
      throw new Error(`Product with ID ${product.id} not found`);
    }
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Function to delete a product
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    // Find the Firestore document with the matching product ID
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);
    
    const docToDelete = snapshot.docs.find(doc => {
      const data = doc.data();
      return data.id === id;
    });
    
    if (docToDelete) {
      const productRef = doc(db, "products", docToDelete.id);
      await deleteDoc(productRef);
    } else {
      throw new Error(`Product with ID ${id} not found`);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};