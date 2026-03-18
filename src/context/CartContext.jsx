import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api/api';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);

    // Cart item shape from backend:
    // { cart_item_id, product_id, name, price, image_url, quantity, item_total }

    const refreshCart = useCallback(async () => {
        const userId = localStorage.getItem('user_id');
        const orgId = localStorage.getItem('org_id');
        if (!userId || !orgId) {
            setCart([]);
            return;
        }
        try {
            setCartLoading(true);
            const items = await apiFetch('/cart/');
            setCart(items);
        } catch (e) {
            console.error('[CartContext] Failed to fetch cart:', e.message);
            setCart([]);
        } finally {
            setCartLoading(false);
        }
    }, []);

    // Hydrate on mount + listen for login/logout events to ensure session isolation
    useEffect(() => {
        refreshCart();

        const onLogin = () => {
            console.log('[CartContext] Auth login detected, refreshing cart');
            refreshCart();
        };
        const onLogout = () => {
            console.log('[CartContext] Auth logout detected, clearing cart');
            setCart([]);
        };

        window.addEventListener('auth:login', onLogin);
        window.addEventListener('auth:logout', onLogout);
        return () => {
            window.removeEventListener('auth:login', onLogin);
            window.removeEventListener('auth:logout', onLogout);
        };
    }, [refreshCart]);

    /**
     * addToCart — sends product_id + quantity to the backend.
     * The backend uses ON DUPLICATE KEY UPDATE, so adding the same product
     * multiple times increments quantity rather than duplicating.
     * 
     * @param {number} product_id
     * @param {number} quantity  (defaults to 1)
     */
    const addToCart = async (product_id, quantity = 1) => {
        await apiFetch('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ product_id, quantity }),
        });
        await refreshCart();
    };

    /**
     * removeFromCart — deletes by cart_item_id.
     * @param {number} cart_item_id
     */
    const removeFromCart = async (cart_item_id) => {
        await apiFetch(`/cart/remove/${cart_item_id}`, { method: 'DELETE' });
        // Optimistic local update for instant UI response
        setCart(prev => prev.filter(i => i.cart_item_id !== cart_item_id));
    };

    /**
     * updateQuantity — sets a specific cart row to a new quantity.
     * @param {number} cart_item_id
     * @param {number} quantity  — must be >= 1 (enforced by backend)
     */
    const updateQuantity = async (cart_item_id, quantity) => {
        if (quantity < 1) return;
        // Optimistic update
        setCart(prev =>
            prev.map(i =>
                i.cart_item_id === cart_item_id
                    ? { ...i, quantity, item_total: i.price * quantity }
                    : i
            )
        );
        try {
            await apiFetch(`/cart/update/${cart_item_id}`, {
                method: 'PUT',
                body: JSON.stringify({ quantity }),
            });
        } catch (e) {
            // Revert on failure
            console.error('[CartContext] Update quantity failed, reverting:', e.message);
            await refreshCart();
        }
    };

    /**
     * clearCart — called after a successful order placement.
     * The backend already deletes cart rows inside placeOrder's transaction,
     * so we just reset local state and re-sync to confirm.
     */
    const clearCart = async () => {
        setCart([]);
        // Small delay to let the server-side deletion complete before re-fetching
        setTimeout(refreshCart, 300);
    };

    const cartTotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                cartLoading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                refreshCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};