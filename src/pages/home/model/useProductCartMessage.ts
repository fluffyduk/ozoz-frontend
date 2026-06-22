import { useCallback, useState } from 'react';

import type { Product } from '../../../entities/product';
import { getProductCategoryLabel } from '../../../entities/product';
import { addProductToCart } from '../../../shared/lib/cart';

export const useProductCartMessage = () => {
    const [cartMessage, setCartMessage] = useState<string>('');

    const handleAddToCart = useCallback((product: Product) => {
        addProductToCart({
            ...product,
            category: getProductCategoryLabel(product.category),
        });
        setCartMessage(`Товар «${product.name}» добавлен в корзину`);
    }, []);

    return {
        cartMessage,
        handleAddToCart,
    };
};
