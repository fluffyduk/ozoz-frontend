import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import type { Product } from '../../../entities/product';
import { productCategoryOptions } from '../../../entities/product';
import type { ProductDraft } from '../model/types';
import styles from '../admin.module.scss';

const editableCategoryOptions = productCategoryOptions.filter((option) => option.value !== '');

type Props = {
    product: Product;
    draft: ProductDraft;
    isPending: boolean;
    onDraftChange: (productId: string, field: keyof ProductDraft, value: string) => void;
    onSave: (product: Product) => void;
    onDelete: (product: Product) => void;
};

export const AdminProductCard = ({
    product,
    draft,
    isPending,
    onDraftChange,
    onSave,
    onDelete,
}: Props) => (
    <Card className={styles.card}>
        <div className={styles['card-header']}>
            <div>
                <h2>{product.name}</h2>
                <p>ID: {product.id}</p>
            </div>
            <strong>
                {product.price.toLocaleString('ru-RU', {
                    maximumFractionDigits: 2,
                })} ₽
            </strong>
        </div>

        <div className={styles.form}>
            <label className={styles.field}>
                <span>Название</span>
                <InputText
                    value={draft.name}
                    onChange={(event) => onDraftChange(product.id, 'name', event.target.value)}
                />
            </label>

            <label className={styles.field}>
                <span>Описание</span>
                <InputText
                    value={draft.description}
                    onChange={(event) => onDraftChange(product.id, 'description', event.target.value)}
                />
            </label>

            <label className={styles.field}>
                <span>Категория</span>
                <Dropdown
                    value={draft.category}
                    options={editableCategoryOptions}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(event) => onDraftChange(product.id, 'category', String(event.value))}
                />
            </label>

            <label className={styles.field}>
                <span>Вес</span>
                <InputText
                    type="number"
                    min="0"
                    value={draft.weight}
                    onChange={(event) => onDraftChange(product.id, 'weight', event.target.value)}
                />
            </label>

            <label className={styles.field}>
                <span>Цена</span>
                <InputText
                    type="number"
                    min="0"
                    value={draft.price}
                    onChange={(event) => onDraftChange(product.id, 'price', event.target.value)}
                />
            </label>
        </div>

        <div className={styles.actions}>
            <Button
                label="Сохранить"
                disabled={isPending}
                onClick={() => onSave(product)}
            />
            <Button
                label="Удалить"
                outlined
                severity="danger"
                disabled={isPending}
                onClick={() => onDelete(product)}
            />
        </div>
    </Card>
);
