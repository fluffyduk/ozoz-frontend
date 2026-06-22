import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import type { Product } from '../../entities/product';
import { getProductCategoryLabel } from '../../entities/product';
import { appConfig } from '../../shared/config/app_config';
import { addProductToCart } from '../../shared/lib/cart';
import styles from './product.module.scss';

export const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [cartMessage, setCartMessage] = useState<string>('');

    const getProductUrl = useCallback(() => {
        if (!appConfig.productsApiUrl) {
            throw new Error('Не задан VITE_DOMAIN в .env');
        }

        if (!id) {
            throw new Error('Не передан идентификатор товара');
        }

        return new URL(`/api/v1/products/${id}`, appConfig.productsApiUrl);
    }, [id]);

    const loadProduct = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(getProductUrl());

            if (!response.ok) {
                throw new Error('Не удалось загрузить товар');
            }

            const data: unknown = await response.json();

            setProduct(data as Product);
        } catch (requestError) {
            const message = requestError instanceof Error
                ? requestError.message
                : 'Не удалось загрузить товар';

            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [getProductUrl]);

    const handleAddToCart = () => {
        if (!product) {
            return;
        }

        addProductToCart({
            ...product,
            category: getProductCategoryLabel(product.category),
        });
        setCartMessage(`Товар «${product.name}» добавлен в корзину`);
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadProduct();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [loadProduct]);

    return (
        <section className={styles['page-wrapper']}>
            {isLoading && (
                <p className={styles.message}>Загрузка товара...</p>
            )}

            {error !== '' && (
                <p className={styles.error}>{error}</p>
            )}

            {cartMessage !== '' && (
                <p className={styles.success}>{cartMessage}</p>
            )}

            {product && (
                <Card className={styles.card}>
                    <div className={styles.preview}>
                        <span>{getProductCategoryLabel(product.category)}</span>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.header}>
                            <div>
                                <h1>{product.name}</h1>
                                <p>{product.description}</p>
                            </div>
                            <strong>
                                {product.price.toLocaleString('ru-RU', {
                                    maximumFractionDigits: 2,
                                })} ₽
                            </strong>
                        </div>

                        <dl className={styles.meta}>
                            <div>
                                <dt>Вес</dt>
                                <dd>{product.weight.toLocaleString('ru-RU')} кг</dd>
                            </div>
                            <div>
                                <dt>Создан</dt>
                                <dd>{new Date(product.createdAt).toLocaleString('ru-RU')}</dd>
                            </div>
                            <div>
                                <dt>Обновлён</dt>
                                <dd>{new Date(product.updatedAt).toLocaleString('ru-RU')}</dd>
                            </div>
                        </dl>

                        <div className={styles.actions}>
                            <Button label="В корзину" onClick={handleAddToCart} />
                        </div>
                    </div>
                </Card>
            )}
        </section>
    );
};
