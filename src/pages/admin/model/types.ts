import type { Product } from '../../../entities/product';

export type ProductDraft = {
    name: string;
    description: string;
    weight: string;
    category: string;
    price: string;
};

export const getProductDraft = (product: Product): ProductDraft => ({
    name: product.name,
    description: product.description,
    weight: String(product.weight),
    category: product.category,
    price: String(product.price),
});

export const getProductUpdatePayload = (product: Product, draft: ProductDraft) => ({
    id: product.id,
    name: draft.name,
    description: draft.description,
    weight: Number(draft.weight) || 0,
    category: draft.category,
    price: Number(draft.price) || 0,
});
