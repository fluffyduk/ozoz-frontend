export type Product = {
    id: string;
    name: string;
    description: string;
    weight: number;
    category: string;
    price: number;
    createdAt: string;
    updatedAt: string;
};

export const productCategories = [
    'ELECTRONICS',
    'HOME_APPLIANCES',
    'CLOTHING_AND_SHOES',
    'HEALTH_AND_BEAUTY',
    'JEWELRY_AND_WATCHES',
    'CHILDREN_GOODS',
    'SPORTS_AND_OUTDOORS',
    'GROCERIES',
] as const;

export type ProductCategory = (typeof productCategories)[number];

export const productCategoryLabels: Record<ProductCategory, string> = {
    ELECTRONICS: 'Электроника',
    HOME_APPLIANCES: 'Бытовая техника',
    CLOTHING_AND_SHOES: 'Одежда и обувь',
    HEALTH_AND_BEAUTY: 'Здоровье и красота',
    JEWELRY_AND_WATCHES: 'Украшения и часы',
    CHILDREN_GOODS: 'Детские товары',
    SPORTS_AND_OUTDOORS: 'Спорт и отдых',
    GROCERIES: 'Продукты',
};

export const productCategoryOptions = [
    {
        label: 'Все категории',
        value: '',
    },
    ...productCategories.map((categoryName) => ({
        label: productCategoryLabels[categoryName],
        value: categoryName,
    })),
];

const isProductCategory = (value: string): value is ProductCategory => (
    productCategories.some((categoryName) => categoryName === value)
);

export const getProductCategoryLabel = (category: string) => {
    if (isProductCategory(category)) {
        return productCategoryLabels[category];
    }

    return category;
};
