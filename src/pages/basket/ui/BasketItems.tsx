import type { CartItem } from '../../../shared/lib/cart';
import styles from '../basket.module.scss';
import { BasketItemCard } from './BasketItemCard';

type Props = {
    items: CartItem[];
    onQuantityChange: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
};

export const BasketItems = ({ items, onQuantityChange, onRemove }: Props) => (
    <div className={styles.items}>
        {items.map((item) => (
            <BasketItemCard
                key={item.productId}
                item={item}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
            />
        ))}
    </div>
);
