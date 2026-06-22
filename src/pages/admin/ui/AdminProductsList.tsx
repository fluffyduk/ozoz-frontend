import type { Product } from '../../../entities/product';
import type { ProductDraft } from '../model/types';
import styles from '../admin.module.scss';
import { AdminProductCard } from './AdminProductCard';

type Props = {
    products: Product[];
    draftsByProductId: Record<string, ProductDraft>;
    pendingProductId: string;
    onDraftChange: (productId: string, field: keyof ProductDraft, value: string) => void;
    onSave: (product: Product) => void;
    onDelete: (product: Product) => void;
};

export const AdminProductsList = ({
    products,
    draftsByProductId,
    pendingProductId,
    onDraftChange,
    onSave,
    onDelete,
}: Props) => (
    <div className={styles.products}>
        {products.map((product) => {
            const draft = draftsByProductId[product.id];

            if (!draft) {
                return null;
            }

            return (
                <AdminProductCard
                    key={product.id}
                    product={product}
                    draft={draft}
                    isPending={pendingProductId === product.id}
                    onDraftChange={onDraftChange}
                    onSave={onSave}
                    onDelete={onDelete}
                />
            );
        })}
    </div>
);
