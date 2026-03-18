import { Link } from 'react-router-dom';
import { products, mockImage } from '../data/products';
import ProductCard from '../Components/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function Home() {
    const featuredProducts = products.slice(0, 4);

    return (
        <div className="space-y-24 pb-24">
            {/* Hero Section */}
            <section className="relative h-[90vh] w-full overflow-hidden">
                <img
                    src={mockImage}
                    alt="Hero"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div className="max-w-3xl px-4">
                        <h1 className="mb-6 font-serif text-5xl font-black tracking-tighter text-white sm:text-7xl">
                            Elevate Your <br /> Living Space
                        </h1>
                        <p className="mb-10 text-lg font-medium text-stone-200">
                            Discover our curated collection of artisanal furniture, designed for the modern home with a focus on quality and timeless design.
                        </p>
                        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                            <Link
                                to="/store/products"
                                className="inline-flex items-center space-x-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-stone-900 transition-all hover:bg-stone-100 active:scale-95"
                            >
                                <span>Shop Collection</span>
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex items-center space-x-2 rounded-full border border-white/50 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                            >
                                <span>Our Story</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            

            {/* Category Section */}
            <section className="bg-stone-300 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="mb-12 text-center text-3xl font-serif font-black tracking-tighter text-stone-900">Browse by Room(unimplemented)</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            { name: 'Living Room', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
                            { name: 'Bedroom', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800' },
                            { name: 'Office', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800' }
                        ].map((cat) => (
                            <Link
                                key={cat.name}
                                to={`/products?category=${cat.name}`}
                                className="group relative h-96 overflow-hidden rounded-2xl"
                            >
                                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
                                <div className="absolute inset-0 flex items-center justify-center text-center">
                                    <h3 className="text-2xl font-serif font-bold text-white tracking-tight">{cat.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
