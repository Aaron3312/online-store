import { Product } from "../types/products";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../services/productService";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { RatingStars } from "../components/RatingStars";

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        if (id) {
          const fetchedProduct = await fetchProductById(id);
          if (fetchedProduct) {
            setProduct(fetchedProduct);
          } else {
            setError("Product not found");
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError("Failed to Load Product. " + errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <a href="/products" className="back-button">Back to Products</a>
      </div>
    );
  }

  return (
    <div className="product-details">
      <Breadcrumbs
        entries={[
          { name: "Products", path: "/products" },
          { name: product.title, path: "" },
        ]}
      />
      <div className="product-container">
        <div className="product-gallery">
          <img 
            src={product.image} 
            alt={`${product.title}`} 
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h1>{product.title}</h1>
          <div className="rating-container">
            <RatingStars rating={product.rating} />
            <span className="review-count">({product.reviews || 0} reviews)</span>
          </div>
          <p className="price">${product.price.toFixed(2)}</p>
          <div className="product-description">
            <p>{product.description}</p>
          </div>
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};