export function Footer() {
    return (
        <footer className="bg-white border-t py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">MicroMarket</h3>
                        <p className="text-muted-foreground text-sm">
                            The best place to find unique items from independent sellers.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground">All Products</a></li>
                            <li><a href="#" className="hover:text-foreground">Featured</a></li>
                            <li><a href="#" className="hover:text-foreground">New Arrivals</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                            <li><a href="#" className="hover:text-foreground">Safety Center</a></li>
                            <li><a href="#" className="hover:text-foreground">Community Guidelines</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} MicroMarket. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
