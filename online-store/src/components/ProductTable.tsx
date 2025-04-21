import { Product } from '../types/products.ts';
import { Link } from "react-router-dom";
import { DeleteButton } from "./DeleteButton.tsx";

type ProductTableProps = {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
};

const formatNumber = (value: number | undefined, decimals = 2) => {
    if (value === undefined || isNaN(value)) return 'N/A';
    return value.toFixed(decimals);
};

export const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
    return (
        <div className="table-container">
            <table className="product-table">
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>
                            <Link to={`/products/${product.id}`}>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="product-thumbnail"
                                />
                            </Link>
                        </td>
                        <td>
                            <Link to={`/products/${product.id}`}>
                                {product.title}
                            </Link>
                        </td>
                        <td>${formatNumber(product.price)}</td>
                        <td>{formatNumber(product.stock, 0)}</td>
                        <td>{product.category}</td>
                        <td className="actions">
                            <button
                                onClick={() => onEdit(product)}
                                className="edit-button"
                            >
                                Edit
                            </button>
                            <DeleteButton
                                onDelete={() => onDelete(product.id)}
                                className="delete-button"
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};