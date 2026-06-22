import { useEffect, useState } from 'react';

import type { CategoryFilter, ProductFilters, ProductSortBy } from './types';

const searchDelay = 500;

const initialFilters: ProductFilters = {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'Relevance',
};

const areProductFiltersEqual = (
    firstFilters: ProductFilters,
    secondFilters: ProductFilters,
) => (
    firstFilters.search === secondFilters.search
    && firstFilters.category === secondFilters.category
    && firstFilters.minPrice === secondFilters.minPrice
    && firstFilters.maxPrice === secondFilters.maxPrice
    && firstFilters.sortBy === secondFilters.sortBy
);

export const useProductFilters = () => {
    const [search, setSearch] = useState<string>(initialFilters.search);
    const [category, setCategory] = useState<CategoryFilter>(initialFilters.category);
    const [minPrice, setMinPrice] = useState<string>(initialFilters.minPrice);
    const [maxPrice, setMaxPrice] = useState<string>(initialFilters.maxPrice);
    const [sortBy, setSortBy] = useState<ProductSortBy>(initialFilters.sortBy);
    const [debouncedFilters, setDebouncedFilters] = useState<ProductFilters>(initialFilters);

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    const handleMinPriceChange = (value: string) => {
        setMinPrice(value);
    };

    const handleMaxPriceChange = (value: string) => {
        setMaxPrice(value);
    };

    const handleCategoryChange = (value: CategoryFilter) => {
        setCategory(value);
        setDebouncedFilters((currentFilters) => ({
            ...currentFilters,
            category: value,
        }));
    };

    const handleSortChange = (value: ProductSortBy) => {
        setSortBy(value);
        setDebouncedFilters((currentFilters) => ({
            ...currentFilters,
            sortBy: value,
        }));
    };

    const handleSearchSubmit = () => {
        setDebouncedFilters({
            search,
            category,
            minPrice,
            maxPrice,
            sortBy,
        });
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedFilters((currentFilters) => {
                const nextFilters = {
                    ...currentFilters,
                    search,
                    minPrice,
                    maxPrice,
                };

                if (areProductFiltersEqual(currentFilters, nextFilters)) {
                    return currentFilters;
                }

                return nextFilters;
            });
        }, searchDelay);

        return () => window.clearTimeout(timeoutId);
    }, [maxPrice, minPrice, search]);

    return {
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
        debouncedFilters,
        handleSearchChange,
        handleMinPriceChange,
        handleMaxPriceChange,
        handleCategoryChange,
        handleSortChange,
        handleSearchSubmit,
    };
};
