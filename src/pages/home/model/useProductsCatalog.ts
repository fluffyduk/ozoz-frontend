import { useCallback, useEffect, useState } from 'react';

import type { Product } from '../../../entities/product';
import type { ProductFilters } from './types';

const apiBaseUrl = import.meta.env.VITE_DOMAIN;
const productsPageSize = 21;

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

const getProductsUrl = (pageNumber: number, filters: ProductFilters) => {
    if (!apiBaseUrl) {
        throw new Error('Не задан VITE_DOMAIN в .env');
    }

    const url = new URL('/api/v1/products', apiBaseUrl);

    url.searchParams.set('SearchTerm', filters.search);
    url.searchParams.set('PageNumber', String(pageNumber));
    url.searchParams.set('PageSize', String(productsPageSize));
    url.searchParams.set('SortBy', filters.sortBy);

    if (filters.minPrice !== '') {
        url.searchParams.set('MinPrice', filters.minPrice);
    }

    if (filters.maxPrice !== '') {
        url.searchParams.set('MaxPrice', filters.maxPrice);
    }

    if (filters.category !== '') {
        url.searchParams.set('Category', filters.category);
    }

    return url;
};

export const useProductsCatalog = (filters: ProductFilters) => {
    const [page, setPage] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const loadProducts = useCallback(async (pageNumber: number, nextFilters: ProductFilters) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(getProductsUrl(pageNumber, nextFilters));

            if (!response.ok) {
                throw new Error('Не удалось загрузить товары');
            }

            const data: unknown = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Сервер вернул данные в неожиданном формате');
            }

            return data as Product[];
        } catch (requestError) {
            const message = requestError instanceof Error
                ? requestError.message
                : 'Не удалось загрузить товары';

            setError(message);

            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handlePreviousPage = async () => {
        if (page <= 1) {
            return;
        }

        const previousPage = page - 1;
        const loadedProducts = await loadProducts(previousPage, filters);

        if (loadedProducts === null) {
            return;
        }

        setProducts(loadedProducts);
        setPage(previousPage);
        setHasSearched(true);
        scrollToTop();
    };

    const handleNextPage = async () => {
        const nextPage = page + 1;
        const loadedProducts = await loadProducts(nextPage, filters);

        if (loadedProducts === null || loadedProducts.length === 0) {
            return;
        }

        setProducts(loadedProducts);
        setPage(nextPage);
        setHasSearched(true);
        scrollToTop();
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(async () => {
            const loadedProducts = await loadProducts(1, filters);

            if (loadedProducts === null) {
                return;
            }

            setProducts(loadedProducts);
            setPage(1);
            setHasSearched(true);
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [filters, loadProducts]);

    return {
        products,
        page,
        isLoading,
        hasSearched,
        error,
        handlePreviousPage,
        handleNextPage,
    };
};
