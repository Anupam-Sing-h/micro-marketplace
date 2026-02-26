import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/Button';
import { ChevronLeft, ShoppingBag, Star, Truck, ShieldCheck, Share2 } from 'lucide-react';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error("Failed to fetch product", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto py-12 px-4 animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
                <div className="aspect-square bg-muted rounded-2xl"></div>
                <div className="space-y-6 pt-12">
                    <div className="h-12 w-3/4 bg-muted rounded"></div>
                    <div className="h-6 w-1/4 bg-muted rounded"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!product) return <div className="text-center py-24 text-xl">Product not found</div>;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                className="mb-8 pl-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to result
            </Button>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
                {/* Product Image */}
                <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100 sticky top-24">
                    <img
                        src={product.image || 'https://placehold.co/600'}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Info */}
                <div className="space-y-8 pt-4">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">New Arrival</span>
                            <button className="text-muted-foreground hover:text-primary"><Share2 className="w-5 h-5" /></button>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">{product.title}</h1>
                        <div className="mt-4 flex items-center space-x-4">
                            <div className="flex items-center text-yellow-500">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current text-gray-300" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">4.8 (120 reviews)</span>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4 border-b pb-8">
                        <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                        <span className="text-lg text-muted-foreground line-through">${(product.price * 1.2).toFixed(2)}</span>
                    </div>

                    <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none">
                        <p>{product.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <Truck className="w-6 h-6 text-primary" />
                            <div>
                                <p className="font-semibold text-sm">Free Shipping</p>
                                <p className="text-xs text-muted-foreground">On orders over $100</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            <div>
                                <p className="font-semibold text-sm">2 Year Warranty</p>
                                <p className="text-xs text-muted-foreground">Full coverage</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                        <Button size="lg" className="flex-1 text-lg h-14 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 w-14 rounded-full p-0 flex items-center justify-center border-gray-300">
                            <Star className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
