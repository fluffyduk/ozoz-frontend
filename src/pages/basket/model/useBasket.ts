import { useMemo, useState } from 'react';

import type { CartItem } from '../../../shared/lib/cart';
import {
    clearCart,
    getCartItems,
    removeCartItem,
    updateCartItemQuantity,
} from '../../../shared/lib/cart';
import { getUserId } from '../../../shared/lib/user_id';

const ordersApiBaseUrl = import.meta.env.VITE_ORDERS_API_URL;

const getOrdersUrl = () => {
    if (!ordersApiBaseUrl) {
        throw new Error('Не задан VITE_ORDERS_API_URL в .env');
    }

    return new URL('/api/v1/orders', ordersApiBaseUrl);
};

export const useBasket = () => {
    const [items, setItems] = useState<CartItem[]>(() => getCartItems());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const totalPrice = useMemo(() => (
        items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    ), [items]);

    const handleQuantityChange = (productId: string, quantity: number) => {
        setItems(updateCartItemQuantity(productId, quantity));
        setSuccessMessage('');
    };

    const handleRemove = (productId: string) => {
        setItems(removeCartItem(productId));
        setSuccessMessage('');
    };

    const handleCheckout = async () => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(getOrdersUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: getUserId(),
                    items: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Не удалось оформить заказ');
            }

            clearCart();
            setItems([]);
            setSuccessMessage('Заказ успешно оформлен');
        } catch (requestError) {
            const message = requestError instanceof Error
                ? requestError.message
                : 'Не удалось оформить заказ';

            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        items,
        totalPrice,
        isLoading,
        error,
        successMessage,
        handleQuantityChange,
        handleRemove,
        handleCheckout,
    };
};
