import type { Product } from '../../../entities/product';
import styles from '../home.module.scss';
import { ProductCard } from './ProductCard';

type Props = {
    products: Product[];
    onAddToCart: (product: Product) => void;
};

export const ProductsGrid = ({ products, onAddToCart }: Props) => (
    <div className={styles.grid}>
        {products.map((product) => (
            <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
            />
        ))}
    </div>
);
