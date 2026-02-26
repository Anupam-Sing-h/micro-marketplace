import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-foreground flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto py-8 px-4 w-full max-w-7xl">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
