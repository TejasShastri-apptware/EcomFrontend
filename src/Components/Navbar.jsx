import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Search, Menu, LayoutDashboard, LogIn, LogOut, ClipboardList } from 'lucide-react';

export default function Navbar() {
    const { cartCount } = useCart();
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/store" className="text-2xl font-serif font-black tracking-tighter text-stone-900">
                    FURN
                </Link>

                <div className="hidden md:flex space-x-10 text-sm font-semibold uppercase tracking-widest text-stone-500">
                    <Link to="/store" className="hover:text-stone-900 transition-colors">Home</Link>
                    <Link to="/store/products" className="hover:text-stone-900 transition-colors">Collection</Link>
                    <Link to="/store/about" className="hover:text-stone-900 transition-colors">About</Link>
                    {user && !isAdmin && (
                        <Link to="/store/orders" className="hover:text-stone-900 transition-colors">My Orders</Link>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <button className="text-stone-500 hover:text-stone-900 transition-transform active:scale-95">
                        <Search size={22} />
                    </button>

                    <Link to="/store/cart" className="group relative text-stone-500 hover:text-stone-900 transition-transform active:scale-95">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white shadow-lg">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-2">
                            {isAdmin ? (
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-all"
                                >
                                    <LayoutDashboard size={14} />
                                    <span className="hidden sm:inline">Admin</span>
                                </Link>
                            ) : (
                                <Link
                                    to="/store/orders"
                                    title="My Orders"
                                    className="flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-all"
                                >
                                    <ClipboardList size={14} />
                                    <span className="hidden sm:inline">My Orders</span>
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                title="Sign Out"
                                className="text-stone-400 hover:text-stone-900 transition-colors active:scale-95"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/signin"
                            className="flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-700 transition-all active:scale-95"
                        >
                            <LogIn size={14} />
                            Sign In
                        </Link>
                    )}

                    <button className="md:hidden text-stone-500">
                        <Menu size={22} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
