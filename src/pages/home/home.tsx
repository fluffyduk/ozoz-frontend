import styles from './home.module.scss';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import { useCallback, useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

import { addProductToCart } from '../../shared/lib/cart';

type Product = {
    id: string;
    name: string;
    description: string;
    weight: number;
    category: string;
    price: number;
    createdAt: string;
    updatedAt: string;
};

const productCategories = [
    'ELECTRONICS',
    'HOME_APPLIANCES',
    'CLOTHING_AND_SHOES',
    'HEALTH_AND_BEAUTY',
    'JEWELRY_AND_WATCHES',
    'CHILDREN_GOODS',
    'SPORTS_AND_OUTDOORS',
    'GROCERIES',
] as const;

type ProductCategory = (typeof productCategories)[number];
type CategoryFilter = ProductCategory | '';

const categoryLabels: Record<ProductCategory, string> = {
    ELECTRONICS: 'Электроника',
    HOME_APPLIANCES: 'Бытовая техника',
    CLOTHING_AND_SHOES: 'Одежда и обувь',
    HEALTH_AND_BEAUTY: 'Здоровье и красота',
    JEWELRY_AND_WATCHES: 'Украшения и часы',
    CHILDREN_GOODS: 'Детские товары',
    SPORTS_AND_OUTDOORS: 'Спорт и отдых',
    GROCERIES: 'Продукты',
};

const categoryOptions = [
    {
        label: 'Все категории',
        value: '',
    },
    ...productCategories.map((categoryName) => ({
        label: categoryLabels[categoryName],
        value: categoryName,
    })),
];

const apiBaseUrl = import.meta.env.VITE_DOMAIN;
const productsPageSize = 21;

const isProductCategory = (value: string): value is ProductCategory => (
    productCategories.some((categoryName) => categoryName === value)
);

const getCategoryLabel = (category: string) => {
    if (isProductCategory(category)) {
        return categoryLabels[category];
    }

    return category;
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

export const HomePage = () => {
    const [search, setSearch] = useState<string>('');
    const [category, setCategory] = useState<CategoryFilter>('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [cartMessage, setCartMessage] = useState<string>('');

    const handleFilterChange = (filterSetter: (value: string) => void, value: string) => {
        filterSetter(value);
        setPage(1);
    };

    const handleCategoryChange = (value: CategoryFilter) => {
        setCategory(value);
        setPage(1);
    };

    const getProductsUrl = useCallback((pageNumber: number) => {
        if (!apiBaseUrl) {
            throw new Error('Не задан VITE_DOMAIN в .env');
        }

        const url = new URL('/api/v1/products', apiBaseUrl);

        url.searchParams.set('SearchTerm', search);
        url.searchParams.set('PageNumber', String(pageNumber));
        url.searchParams.set('PageSize', String(productsPageSize));

        if (minPrice !== '') {
            url.searchParams.set('MinPrice', minPrice);
        }

        if (maxPrice !== '') {
            url.searchParams.set('MaxPrice', maxPrice);
        }

        if (category !== '') {
            url.searchParams.set('Category', category);
        }

        return url;
    }, [category, maxPrice, minPrice, search]);

    const loadProducts = useCallback(async (pageNumber: number) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(getProductsUrl(pageNumber));

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
    }, [getProductsUrl]);

    const handleSearch = async () => {
        const loadedProducts = await loadProducts(1);

        if (loadedProducts === null) {
            return;
        }

        setProducts(loadedProducts);
        setPage(1);
        setHasSearched(true);
    };

    const handlePreviousPage = async () => {
        if (page <= 1) {
            return;
        }

        const previousPage = page - 1;
        const loadedProducts = await loadProducts(previousPage);

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
        const loadedProducts = await loadProducts(nextPage);

        if (loadedProducts === null || loadedProducts.length === 0) {
            return;
        }

        setProducts(loadedProducts);
        setPage(nextPage);
        setHasSearched(true);
        scrollToTop();
    };

    const handleAddToCart = (product: Product) => {
        addProductToCart({
            ...product,
            category: getCategoryLabel(product.category),
        });
        setCartMessage(`Товар «${product.name}» добавлен в корзину`);
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(async () => {
            const loadedProducts = await loadProducts(1);

            if (loadedProducts === null) {
                return;
            }

            setProducts(loadedProducts);
            setPage(1);
            setHasSearched(true);
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [loadProducts]);

    return (
        <section className={styles['page-wrapper']}>
            <div className={styles.filters}>
                <label className={styles.filter}>
                    <span>Категория</span>
                    <Dropdown
                        value={category}
                        options={categoryOptions}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Все категории"
                        onChange={(event) => handleCategoryChange(event.value as CategoryFilter)}
                    />
                </label>

                <label className={styles.filter}>
                    <span>Минимальная цена</span>
                    <InputText
                        type="number"
                        min="0"
                        value={minPrice}
                        placeholder="от"
                        onChange={(event) => handleFilterChange(setMinPrice, event.target.value)}
                    />
                </label>

                <label className={styles.filter}>
                    <span>Максимальная цена</span>
                    <InputText
                        type="number"
                        min="0"
                        value={maxPrice}
                        placeholder="до"
                        onChange={(event) => handleFilterChange(setMaxPrice, event.target.value)}
                    />
                </label>
            </div>

            <div className={styles.search}>
                <InputText
                    value={search}
                    placeholder="Найти товар"
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                />
                <Button disabled={isLoading} onClick={handleSearch}>
                    Поиск
                </Button>
            </div>

            <div className={styles.catalog}>
                <div className={styles.grid}>
                    {products.map((product) => (
                        <Card key={product.id} className={styles.card}>
                            <div className={styles['product-preview']}>
                                <span>{getCategoryLabel(product.category)}</span>
                            </div>
                            <div className={styles['product-content']}>
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <span>{product.weight.toLocaleString('ru-RU')} кг</span>
                                <div className={styles['product-footer']}>
                                    <strong>{product.price.toLocaleString('ru-RU', {
                                        maximumFractionDigits: 2,
                                    })} ₽</strong>
                                    <Button
                                        label="В корзину"
                                        outlined
                                        onClick={() => handleAddToCart(product)}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {isLoading && (
                    <p className={styles.empty}>Загрузка товаров...</p>
                )}

                {error !== '' && (
                    <p className={styles.error}>{error}</p>
                )}

                {cartMessage !== '' && (
                    <p className={styles.success}>{cartMessage}</p>
                )}

                {hasSearched && products.length === 0 && !isLoading && error === '' && (
                    <p className={styles.empty}>По выбранным фильтрам ничего не найдено.</p>
                )}

                <div className={styles.pagination}>
                    <Button
                        label="Предыдущая"
                        outlined
                        disabled={page === 1 || isLoading}
                        onClick={handlePreviousPage}
                    />
                    <span>{page}</span>
                    <Button
                        label="Следующая"
                        outlined
                        disabled={isLoading}
                        onClick={handleNextPage}
                    />
                </div>
            </div>
        </section>
    );
};
