import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import { productCategoryOptions } from '../../../entities/product';
import type { CategoryFilter, ProductSortBy } from '../model/types';
import { productSortOptions } from '../model/types';
import styles from '../home.module.scss';

type Props = {
    search: string;
    category: CategoryFilter;
    minPrice: string;
    maxPrice: string;
    sortBy: ProductSortBy;
    isSearchDisabled: boolean;
    onSearchChange: (value: string) => void;
    onMinPriceChange: (value: string) => void;
    onMaxPriceChange: (value: string) => void;
    onCategoryChange: (value: CategoryFilter) => void;
    onSortChange: (value: ProductSortBy) => void;
    onSearchSubmit: () => void;
};

export const ProductFilters = ({
    search,
    category,
    minPrice,
    maxPrice,
    sortBy,
    isSearchDisabled,
    onSearchChange,
    onMinPriceChange,
    onMaxPriceChange,
    onCategoryChange,
    onSortChange,
    onSearchSubmit,
}: Props) => (
    <>
        <div className={styles.filters}>
            <label className={styles.filter}>
                <span>Категория</span>
                <Dropdown
                    value={category}
                    options={productCategoryOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Все категории"
                    onChange={(event) => onCategoryChange(event.value as CategoryFilter)}
                />
            </label>

            <label className={styles.filter}>
                <span>Минимальная цена</span>
                <InputText
                    type="number"
                    min="0"
                    value={minPrice}
                    placeholder="от"
                    onChange={(event) => onMinPriceChange(event.target.value)}
                />
            </label>

            <label className={styles.filter}>
                <span>Максимальная цена</span>
                <InputText
                    type="number"
                    min="0"
                    value={maxPrice}
                    placeholder="до"
                    onChange={(event) => onMaxPriceChange(event.target.value)}
                />
            </label>

            <label className={styles.filter}>
                <span>Сортировка</span>
                <Dropdown
                    value={sortBy}
                    options={productSortOptions}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(event) => onSortChange(event.value as ProductSortBy)}
                />
            </label>
        </div>

        <div className={styles.search}>
            <InputText
                value={search}
                placeholder="Найти товар"
                onChange={(event) => onSearchChange(event.target.value)}
            />
            <Button disabled={isSearchDisabled} onClick={onSearchSubmit}>
                Поиск
            </Button>
        </div>
    </>
);
