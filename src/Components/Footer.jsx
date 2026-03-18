import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-stone-200 bg-stone-50 pt-20 pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="space-y-6">
                        <Link to="/store" className="text-2xl font-serif font-black tracking-tighter text-stone-900">
                            FURN
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-stone-500">
                            Crafting timeless furniture pieces that blend minimalist aesthetics with modern comfort.
                        </p>
                        <div className="flex space-x-5 text-stone-400">
                            <a href="#" className="hover:text-stone-900 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-stone-900 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-stone-900 transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-900">Shop</h4>
                        <ul className="space-y-4 text-sm text-stone-500">
                            <li><Link to="/store/products" className="hover:text-stone-900 transition-colors">All Collections</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-900">Information</h4>
                        <ul className="space-y-4 text-sm text-stone-500">
                            <li><Link to="/about" className="hover:text-stone-900 transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-900">RandomBox</h4>
                        <p className="mb-4 text-sm text-stone-500">To fill in space. Will add something here later</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full border-b border-stone-300 bg-transparent py-2 text-sm focus:border-stone-900 focus:outline-none"
                            />
                            <button type="submit" className="ml-4 text-stone-900 hover:text-stone-600 transition-colors">
                                <Mail size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-20 border-t border-stone-200 pt-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    © 2026 FURN. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
