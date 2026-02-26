const sequelize = require('./config/database');
const { User, Product } = require('./models');

const products = [
    { title: "Vintage Camera", price: 120, image: "https://placehold.co/400?text=Camera", description: "Classic film camera.", category: "Electronics" },
    { title: "Wireless Headphones", price: 250, image: "https://placehold.co/400?text=Headphones", description: "Noise cancelling.", category: "Electronics" },
    { title: "Mechanical Keyboard", price: 150, image: "https://placehold.co/400?text=Keyboard", description: "Clicky switches.", category: "Electronics" },
    { title: "Smart Watch", price: 199, image: "https://placehold.co/400?text=Watch", description: "Tracks health metrics.", category: "Electronics" },
    { title: "Leather Bag", price: 80, image: "https://placehold.co/400?text=Bag", description: "Genuine leather.", category: "Accessories" },
    { title: "Ceramic Mug", price: 20, image: "https://placehold.co/400?text=Mug", description: "Handmade ceramic.", category: "Home & Office" },
    { title: "Desk Lamp", price: 45, image: "https://placehold.co/400?text=Lamp", description: "Adjustable LED.", category: "Home & Office" },
    { title: "Running Shoes", price: 110, image: "https://placehold.co/400?text=Shoes", description: "Lightweight mesh.", category: "Accessories" },
    { title: "Gaming Mouse", price: 60, image: "https://placehold.co/400?text=Mouse", description: "High DPI sensor.", category: "Electronics" },
    { title: "Succulent Plant", price: 15, image: "https://placehold.co/400?text=Plant", description: "Easy to care for.", category: "Home & Office" }
];

const seed = async () => {
    try {
        await sequelize.sync({ force: true }); // Reset database

        // Create Users (using emails as usernames to match user request intent)
        await User.create({ username: 'user@test.com', password: 'password123' });
        await User.create({ username: 'admin@test.com', password: 'password123' }); // Using same password hash for simplicity in this adaptation

        // Create Products
        await Product.bulkCreate(products);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seed();
