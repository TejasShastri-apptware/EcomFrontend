import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../Components/ProductCard';
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck, Tag, Ruler, Palette, Layers } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [product, setProduct] = useState(null);
    const [tags, setTags] = useState([]);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [adding, setAdding] = useState(false);
    const [addedMsg, setAddedMsg] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        setProduct(null);
        setRelated([]);

        Promise.all([
            apiFetch(`/products/${id}`),
            apiFetch(`/products/${id}/tags`),
        ])
            .then(([prod, tgs]) => {
                setProduct(prod);
                setTags(tgs);
            })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    // Fetch related products once product is known
    useEffect(() => {
        if (!product) return;
        apiFetch('/products/')
            .then(all => {
                const rel = all.filter(p =>
                    p.category_id === product.category_id && p.product_id !== product.product_id
                ).slice(0, 4);
                setRelated(rel);
            })
            .catch(() => { }); // silently ignore related failure
    }, [product]);

    const handleAddToCart = async () => {
        if (!product || product.stock_quantity === 0 || adding) return;

        // Guest check
        if (!localStorage.getItem('user_id')) {
            navigate('/signin', { state: { from: location } });
            return;
        }

        setAdding(true);
        try {
            await addToCart(product.product_id, 1);
            setAddedMsg('Added to cart!');
            setTimeout(() => setAddedMsg(''), 2000);
        } catch (e) {
            setAddedMsg('Failed to add — please try again.');
            setTimeout(() => setAddedMsg(''), 3000);
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 animate-pulse">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                    <div className="aspect-[4/5] rounded-3xl bg-stone-100" />
                    <div className="space-y-6 pt-4">
                        <div className="h-4 w-32 rounded bg-stone-100" />
                        <div className="h-12 w-3/4 rounded bg-stone-100" />
                        <div className="h-8 w-24 rounded bg-stone-100" />
                        <div className="space-y-2">
                            <div className="h-4 w-full rounded bg-stone-100" />
                            <div className="h-4 w-5/6 rounded bg-stone-100" />
                            <div className="h-4 w-4/6 rounded bg-stone-100" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-serif font-black text-stone-900">Piece not found</h2>
                <p className="mt-2 text-stone-500 text-sm">{error}</p>
                <Link to="/store/products" className="mt-4 text-stone-500 underline underline-offset-4">Return to collection</Link>
            </div>
        );
    }

    const outOfStock = product.stock_quantity === 0;
    const effectivePrice = product.discount_price || product.price;

    return (
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Link to="/store/products" className="mb-12 inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-900">
                <ChevronLeft size={16} />
                <span>Back to collection</span>
            </Link>

            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                {/* Image */}
                <div className="overflow-hidden rounded-3xl bg-stone-100 aspect-[4/5] relative">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-stone-300">
                            <img src='https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800' />
                        </div>
                    )}
                    {outOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="rounded-full bg-white/90 px-6 py-2 text-sm font-bold uppercase tracking-widest text-stone-900">Out of Stock</span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{product.category_name}</span>
                        <h1 className="mt-2 text-4xl font-serif font-black tracking-tighter text-stone-900 sm:text-5xl">{product.name}</h1>

                        {/* Price */}
                        <div className="mt-4 flex items-baseline gap-3">
                            <p className="text-2xl font-bold text-stone-900">₹{Number(effectivePrice).toLocaleString('en-IN')}</p>
                            {product.discount_price && (
                                <p className="text-lg line-through text-stone-400">₹{Number(product.price).toLocaleString('en-IN')}</p>
                            )}
                        </div>

                        {/* Stock indicator */}
                        <p className={`mt-2 text-sm font-semibold ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
                            {outOfStock ? 'Out of Stock' : `${product.stock_quantity} in stock`}
                        </p>
                    </div>

                    {/* Description */}
                    {product.description && (
                        <p className="mb-8 text-stone-600 leading-relaxed">{product.description}</p>
                    )}

                    {/* Specs grid */}
                    {(product.material || product.color || product.length || product.width || product.height) && (
                        <div className="mb-8 grid grid-cols-2 gap-3">
                            {product.material && (
                                <div className="flex items-center gap-2 rounded-xl bg-stone-50 p-3">
                                    <Layers size={14} className="text-stone-400 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Material</p>
                                        <p className="text-sm font-semibold text-stone-700">{product.material}</p>
                                    </div>
                                </div>
                            )}
                            {product.color && (
                                <div className="flex items-center gap-2 rounded-xl bg-stone-50 p-3">
                                    <Palette size={14} className="text-stone-400 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Color</p>
                                        <p className="text-sm font-semibold text-stone-700">{product.color}</p>
                                    </div>
                                </div>
                            )}
                            {(product.length || product.width || product.height) && (
                                <div className="col-span-2 flex items-center gap-2 rounded-xl bg-stone-50 p-3">
                                    <Ruler size={14} className="text-stone-400 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Dimensions (L × W × H cm)</p>
                                        <p className="text-sm font-semibold text-stone-700">
                                            {[product.length, product.width, product.height].map(v => v ?? '—').join(' × ')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <span key={tag.tag_id} className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600">
                                    <Tag size={10} /> {tag.tag_name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Badges */}
                    <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-center space-x-4 rounded-2xl bg-stone-50 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm">
                                <Truck size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-900">Fast Delivery</p>
                                <p className="text-xs text-stone-500">Free on orders over ₹500</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 rounded-2xl bg-stone-50 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-900">Warranty</p>
                                <p className="text-xs text-stone-500">2-Year Structural Warranty</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="space-y-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={outOfStock || adding}
                            className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-stone-900 py-6 text-lg font-bold text-white transition-all hover:bg-stone-800 active:scale-95 disabled:bg-stone-300 disabled:cursor-not-allowed"
                        >
                            {adding ? (
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <>
                                    <ShoppingBag size={20} />
                                    <span>{outOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                                </>
                            )}
                        </button>
                        {addedMsg && (
                            <p className={`text-center text-sm font-semibold ${addedMsg.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>
                                {addedMsg}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {related.length > 0 && (
                <section className="mt-32">
                    <h2 className="mb-12 font-serif text-3xl font-black tracking-tighter text-stone-900">You May Also Like</h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {related.map(p => <ProductCard key={p.product_id} product={p} />)}
                    </div>
                </section>
            )}
        </div>
    );
}
