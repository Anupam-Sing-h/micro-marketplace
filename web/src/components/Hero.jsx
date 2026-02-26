import { Button } from './Button';
import { motion } from 'framer-motion';

export function Hero() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground mb-12">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1574&q=80')] bg-cover bg-center opacity-10"></div>
            <div className="relative px-8 py-24 md:py-32 max-w-2xl">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
                >
                    Discover Unique <br />
                    <span className="text-blue-200">Micro-Products</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-lg"
                >
                    The marketplace for developers, creators, and innovators. Find the components you need to build faster.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all">
                        Explore Collection
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
