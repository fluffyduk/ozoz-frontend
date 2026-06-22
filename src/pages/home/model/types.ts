import type { ProductCategory } from '../../../entities/product';

export type CategoryFilter = ProductCategory | '';

export const productSortValues = [
    'Relevance',
    'PriceAsc',
    'PriceDesc',
    'Newest',
] as const;

export type ProductSortBy = (typeof productSortValues)[number];

export type ProductFilters = {
    search: string;
    category: CategoryFilter;
    minPrice: string;
    maxPrice: string;
    sortBy: ProductSortBy;
};

const sortLabels: Record<ProductSortBy, string> = {
    Relevance: 'По релевантности',
    PriceAsc: 'Сначала дешевле',
    PriceDesc: 'Сначала дороже',
    Newest: 'Сначала новые',
};

export const productSortOptions = productSortValues.map((sortValue) => ({
    label: sortLabels[sortValue],
    value: sortValue,
}));
