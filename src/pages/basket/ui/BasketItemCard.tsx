import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';

import type { CartItem } from '../../../shared/lib/cart';
import styles from '../basket.module.scss';

type Props = {
    item: CartItem;
    onQuantityChange: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
};

export const BasketItemCard = ({ item, onQuantityChange, onRemove }: Props) => (
    <Card className={styles.card}>
        <div className={styles['item-info']}>
            <div>
                <h2>{item.title}</h2>
                <p>{item.category}</p>
            </div>
            <strong>{item.price.toLocaleString('ru-RU')} ₽</strong>
        </div>

        <div className={styles['item-controls']}>
            <div className={styles.quantity}>
                <Button
                    label="-"
                    outlined
                    disabled={item.quantity <= 1}
                    onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
                />
                <InputText
                    type="number"
                    min="1"
                    value={String(item.quantity)}
                    onChange={(event) => onQuantityChange(
                        item.productId,
                        Number(event.target.value) || 1,
                    )}
                />
                <Button
                    label="+"
                    outlined
                    onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                />
            </div>

            <Button
                label="Удалить"
                outlined
                severity="danger"
                onClick={() => onRemove(item.productId)}
            />
        </div>
    </Card>
);
