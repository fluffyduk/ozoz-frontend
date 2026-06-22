import { useCallback, useEffect, useState } from 'react';

import type { Product } from '../../../entities/product';
import { appConfig } from '../../../shared/config/app_config';
import type { ProductDraft } from './types';
import { getProductDraft, getProductUpdatePayload } from './types';

const productsPageSize = 20;
const defaultGenerateCount = '1';

const getProductsUrl = (pageNumber: number, search: string) => {
    if (!appConfig.productsApiUrl) {
        throw new Error('Не задан VITE_DOMAIN в .env');
    }

    const url = new URL('/api/v1/products', appConfig.productsApiUrl);

    url.searchParams.set('SearchTerm', search);
    url.searchParams.set('PageNumber', String(pageNumber));
    url.searchParams.set('PageSize', String(productsPageSize));
    url.searchParams.set('SortBy', 'Relevance');

    return url;
};

const getProductUrl = (productId: string) => {
    if (!appConfig.productsApiUrl) {
        throw new Error('Не задан VITE_DOMAIN в .env');
    }

    return new URL(`/api/v1/products/${productId}`, appConfig.productsApiUrl);
};

const getGenerateFakeProductsUrl = (count: string) => {
    if (!appConfig.productsApiUrl) {
        throw new Error('Не задан VITE_DOMAIN в .env');
    }

    const url = new URL('/api/v1/dev-tools/generate-fake-products', appConfig.productsApiUrl);

    url.searchParams.set('count', count);

    return url;
};

const isProduct = (value: unknown): value is Product => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const product = value as Record<string, unknown>;

    return (
        typeof product.id === 'string'
        && typeof product.name === 'string'
        && typeof product.description === 'string'
        && typeof product.category === 'string'
        && typeof product.weight === 'number'
        && typeof product.price === 'number'
        && typeof product.createdAt === 'string'
        && typeof product.updatedAt === 'string'
    );
};

export const useAdminProducts = () => {
    const [search, setSearch] = useState<string>('');
    const [appliedSearch, setAppliedSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [draftsByProductId, setDraftsByProductId] = useState<Record<string, ProductDraft>>({});
    const [generateCount, setGenerateCount] = useState<string>(defaultGenerateCount);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [pendingProductId, setPendingProductId] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const syncDrafts = useCallback((nextProducts: Product[]) => {
        setDraftsByProductId(Object.fromEntries(
            nextProducts.map((product) => [product.id, getProductDraft(product)]),
        ));
    }, []);

    const fetchProducts = useCallback(async (nextPage: number, nextSearch: string) => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(getProductsUrl(nextPage, nextSearch));

            if (!response.ok) {
                throw new Error('Не удалось загрузить товары');
            }

            const data: unknown = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Сервер вернул данные в неожиданном формате');
            }

            const loadedProducts = data.filter(isProduct);

            return loadedProducts;
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

    const applyProductsPage = useCallback((nextProducts: Product[], nextPage: number) => {
        setProducts(nextProducts);
        syncDrafts(nextProducts);
        setPage(nextPage);
    }, [syncDrafts]);

    const loadProducts = useCallback(async (nextPage: number, nextSearch: string) => {
        const loadedProducts = await fetchProducts(nextPage, nextSearch);

        if (loadedProducts !== null) {
            applyProductsPage(loadedProducts, nextPage);
        }

        return loadedProducts;
    }, [applyProductsPage, fetchProducts]);

    const handleSearchSubmit = () => {
        if (search === appliedSearch) {
            loadProducts(1, search);

            return;
        }

        setAppliedSearch(search);
    };

    const handleGenerateCountChange = (value: string) => {
        setGenerateCount(value);
        setSuccessMessage('');
    };

    const handleGenerateProducts = async () => {
        const normalizedCount = Math.max(1, Number(generateCount) || 1);

        setIsGenerating(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(getGenerateFakeProductsUrl(String(normalizedCount)), {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Не удалось создать товары');
            }

            setGenerateCount(String(normalizedCount));
            setSuccessMessage(`Создано товаров: ${normalizedCount}`);
            await loadProducts(page, appliedSearch);
        } catch (requestError) {
            const message = requestError instanceof Error
                ? requestError.message
                : 'Не удалось создать товары';

            setError(message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDraftChange = (productId: string, field: keyof ProductDraft, value: string) => {
        setDraftsByProductId((currentDrafts) => ({
            ...currentDrafts,
            [productId]: {
                ...currentDrafts[productId],
                [field]: value,
            },
        }));
        setSuccessMessage('');
    };

    const handleSaveProduct = async (product: Product) => {
        const draft = draftsByProductId[product.id];

        if (!draft) {
            return;
        }

        setPendingProductId(product.id);
        setError('');
        setSuccessMessage('');

        try {
            const payload = getProductUpdatePayload(product, draft);
            const response = await fetch(getProductUrl(product.id), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Не удалось сохранить товар');
            }

            const data: unknown = await response.json().catch(() => null);
            const updatedProduct = isProduct(data)
                ? data
                : {
                    ...product,
                    ...payload,
                };

            setProducts((currentProducts) => currentProducts.map((currentProduct) => {
                if (currentProduct.id !== product.id) {
                    return currentProduct;
                }

                return updatedProduct;
            }));
            setDraftsByProductId((currentDrafts) => ({
                ...currentDrafts,
                [product.id]: getProductDraft(updatedProduct),
            }));
            setSuccessMessage(`Товар «${updatedProduct.name}» сохранён`);
        } catch (requestError) {
            const message = requestError instanceof Error
                ? requestError.message
                : 'Не удалось сохранить товар';

            setError(message);
        } finally {
            setPendingProductId('');
        }
    };

    const handleDeleteProduct = async (product: Product) => {
        const shouldDelete = window.confirm(`Удалить товар «${product.name}»?`);

        if (!shouldDelete) {
            return;
        }

        setPendingProductId(product.id);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(getProductUrl(product.id), {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Не удалось удалить товар');
            }

            setProducts((currentProducts) => (
                currentProducts.filter((currentProduct) => currentProduct.id !== product.id)
            ));
            setDraftsByProductId((currentDrafts) => {
                const nextDrafts = { ...currentDrafts };

                delete nextDrafts[product.id];

                return nextDrafts;
            });
            setSuccessMessage(`Товар «${product.name}» удалён`);
        } catch (requestError) {
            const message = requestError instanceof Error
                ? requestError.message
                : 'Не удалось удалить товар';

            setError(message);
        } finally {
            setPendingProductId('');
        }
    };

    const handlePreviousPage = () => {
        if (page <= 1) {
            return;
        }

        loadProducts(page - 1, appliedSearch);
    };

    const handleNextPage = async () => {
        const nextPage = page + 1;
        const loadedProducts = await fetchProducts(nextPage, appliedSearch);

        if (loadedProducts !== null && loadedProducts.length > 0) {
            applyProductsPage(loadedProducts, nextPage);
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadProducts(1, appliedSearch);
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [appliedSearch, loadProducts]);

    return {
        search,
        page,
        products,
        draftsByProductId,
        generateCount,
        isLoading,
        isGenerating,
        pendingProductId,
        error,
        successMessage,
        handleSearchChange: setSearch,
        handleSearchSubmit,
        handleGenerateCountChange,
        handleGenerateProducts,
        handleDraftChange,
        handleSaveProduct,
        handleDeleteProduct,
        handlePreviousPage,
        handleNextPage,
    };
};
