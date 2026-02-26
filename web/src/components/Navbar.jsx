import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { Input } from './Input';
import { Search, ShoppingBag, User } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?q=${encodeURIComponent(searchTerm)}`);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" />
                    <span>MicroMarket</span>
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search for products..."
                        className="pl-10 w-full bg-secondary/50 border-transparent focus:bg-white transition-all rounded-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium hidden sm:inline-block">
                                Hi, {user.name?.split(' ')[0] || 'User'}
                            </span>
                            <Button size="sm" variant="outline" onClick={logout} className="rounded-full">
                                Logout
                            </Button>
                            <Button size="icon" variant="ghost" className="rounded-full">
                                <User className="w-5 h-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost" className="rounded-full">Log in</Button>
                            </Link>
                            <Link to="/register">
                                <Button className="rounded-full px-6">Sign up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
