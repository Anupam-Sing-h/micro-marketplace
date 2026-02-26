import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import api from '../services/api';

const FavoriteButton = ({ isFavorite, onToggle }) => (
    <motion.button
        whileTap={{ scale: 0.8 }}
        animate={{ scale: isFavorite ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={onToggle}
        className="p-2 rounded-full bg-gray-100 absolute top-2 right-2 z-10 shadow-sm"
    >
        <span style={{ color: isFavorite ? 'red' : 'gray', fontSize: '1.5rem', lineHeight: 1, display: 'block' }}>
            ♥
        </span>
    </motion.button>
);

export function ProductCard({ product }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        try {
            await api.post(`/products/${product.id}/favorite`);
        } catch (err) {
            setIsFavorite(prev => !prev);
        }
    };

    return (
        <Link to={`/product/${product.id}`} className="group block rounded-2xl bg-white text-card-foreground shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden duration-300">
            <div className="aspect-[4/3] w-full relative bg-gray-100">
                <img
                    src={product.image || 'https://placehold.co/400'}
                    alt={product.title}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <FavoriteButton isFavorite={isFavorite} onToggle={handleFavorite} />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2 h-10">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">${product.price}</span>
                    <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">View</Button>
                </div>
            </div>
        </Link>
    );
}
