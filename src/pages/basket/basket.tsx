import { useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';

import type { CartItem } from '../../shared/lib/cart';
import {
    clearCart,
    getCartItems,
    removeCartItem,
    updateCartItemQuantity,
} from '../../shared/lib/cart';
import { getUserId } from '../../shared/lib/user_id';
import styles from './basket.module.scss';

const ordersApiBaseUrl = import.meta.env.VITE_ORDERS_API_URL;

const getOrdersUrl = () => {
    if (!ordersApiBaseUrl) {
        throw new Error('Не задан VITE_ORDERS_API_URL в .env');
    }

    return new URL('/api/v1/orders', ordersApiBaseUrl);
};

export const BasketPage = () => {
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

    return (
        <section className={styles['page-wrapper']}>
            <div className={styles.header}>
                <h1>Корзина</h1>
                <strong>{totalPrice.toLocaleString('ru-RU')} ₽</strong>
            </div>

            {items.length === 0 && successMessage === '' && (
                <p className={styles.message}>Корзина пока пустая.</p>
            )}

            {successMessage !== '' && (
                <p className={styles.success}>{successMessage}</p>
            )}

            {error !== '' && (
                <p className={styles.error}>{error}</p>
            )}

            <div className={styles.items}>
                {items.map((item) => (
                    <Card key={item.productId} className={styles.card}>
                        <div className={styles['item-info']}>
                            <div>
                                <h2>{item.title}</h2>
                                <p>{item.category}</p>
                            </div>
                            <strong>{item.price.toLocaleString('ru-RU')} ₽</strong>
                        </div>

                        <div className={styles['item-controls']}>
                            <div className={styles.quantity}>
                                <Button
                                    label="-"
                                    outlined
                                    disabled={item.quantity <= 1}
                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                />
                                <InputText
                                    type="number"
                                    min="1"
                                    value={String(item.quantity)}
                                    onChange={(event) => handleQuantityChange(
                                        item.productId,
                                        Number(event.target.value) || 1,
                                    )}
                                />
                                <Button
                                    label="+"
                                    outlined
                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                />
                            </div>

                            <Button
                                label="Удалить"
                                outlined
                                severity="danger"
                                onClick={() => handleRemove(item.productId)}
                            />
                        </div>
                    </Card>
                ))}
            </div>

            <div className={styles.checkout}>
                <Button
                    label="Оформить заказ"
                    disabled={items.length === 0 || isLoading}
                    onClick={handleCheckout}
                />
            </div>
        </section>
    );
};
