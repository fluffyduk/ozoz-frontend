import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';

import type { Product } from '../../../entities/product';
import { getProductCategoryLabel } from '../../../entities/product';
import styles from '../home.module.scss';

type Props = {
    product: Product;
    onAddToCart: (product: Product) => void;
};

export const ProductCard = ({ product, onAddToCart }: Props) => (
    <Card className={styles.card}>
        <div className={styles['product-preview']}>
            <span>{getProductCategoryLabel(product.category)}</span>
        </div>
        <div className={styles['product-content']}>
            <Link className={styles['product-link']} to={`/products/${product.id}`}>
                {product.name}
            </Link>
            <p>{product.description}</p>
            <span>{product.weight.toLocaleString('ru-RU')} кг</span>
            <div className={styles['product-footer']}>
                <strong>{product.price.toLocaleString('ru-RU', {
                    maximumFractionDigits: 2,
                })} ₽</strong>
                <Button
                    label="В корзину"
                    outlined
                    onClick={() => onAddToCart(product)}
                />
            </div>
        </div>
    </Card>
);
