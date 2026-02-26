import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Hero } from '../components/Hero';
import api from '../services/api';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Accessories', 'Home & Office'];

export default function DashboardPage() {
    const [products, setProducts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    // Filter States
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [maxPrice, setMaxPrice] = useState(500);

    useEffect(() => {
        fetchProducts();
    }, [page, searchQuery, selectedCategories, maxPrice]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                limit: 9,
                maxPrice: maxPrice
            });

            if (searchQuery) params.append('q', searchQuery);

            // Append categories
            selectedCategories.forEach(cat => params.append('category', cat));

            const response = await api.get(`/products?${params.toString()}`);

            if (response.data.products) {
                setTotalPages(response.data.totalPages || 1);
                setProducts(response.data.products);
            } else {
                setProducts(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (category) => {
        setPage(1);
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setMaxPrice(500);
        setPage(1);
        setSearchParams({});
    };

    return (
        <>
            <Hero />

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
                    <div className="sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Filters</h3>
                            {(selectedCategories.length > 0 || maxPrice < 500) && (
                                <button onClick={clearFilters} className="text-sm text-red-500 hover:underline flex items-center">
                                    <X className="w-3 h-3 mr-1" /> Clear
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-medium mb-3 text-sm">Categories</h4>
                                <div className="space-y-2">
                                    {CATEGORIES.map((cat) => (
                                        <label key={cat} className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleCategory(cat)}
                                            />
                                            <span>{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-3 text-sm">Max Price: ${maxPrice}</h4>
                                <input
                                    type="range"
                                    min="0"
                                    max="500"
                                    step="10"
                                    value={maxPrice}
                                    onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>$0</span>
                                    <span>$500+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            {searchQuery ? `Results for "${searchQuery}"` : "New Arrivals"}
                        </h2>
                        <span className="text-sm text-muted-foreground">{products.length} items</span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse"></div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 text-muted-foreground bg-white rounded-xl border border-dashed">
                            <p className="text-lg">No products found matching your filters</p>
                            <Button variant="outline" onClick={clearFilters} className="mt-4">
                                Clear Filters
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-4 mt-12">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="rounded-full w-10 h-10"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= totalPages}
                                className="rounded-full w-10 h-10"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
