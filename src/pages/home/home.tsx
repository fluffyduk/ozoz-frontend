import styles from './home.module.scss';

import { useProductCartMessage } from './model/useProductCartMessage';
import { useProductFilters } from './model/useProductFilters';
import { useProductsCatalog } from './model/useProductsCatalog';
import { CatalogPagination } from './ui/CatalogPagination';
import { CatalogStatus } from './ui/CatalogStatus';
import { ProductFilters } from './ui/ProductFilters';
import { ProductsGrid } from './ui/ProductsGrid';

export const HomePage = () => {
    const productFilters = useProductFilters();
    const {
        products,
        page,
        isLoading,
        hasSearched,
        error,
        handlePreviousPage,
        handleNextPage,
    } = useProductsCatalog(productFilters.debouncedFilters);
    const { cartMessage, handleAddToCart } = useProductCartMessage();

    return (
        <section className={styles['page-wrapper']}>
            <ProductFilters
                search={productFilters.search}
                category={productFilters.category}
                minPrice={productFilters.minPrice}
                maxPrice={productFilters.maxPrice}
                sortBy={productFilters.sortBy}
                isSearchDisabled={isLoading}
                onSearchChange={productFilters.handleSearchChange}
                onMinPriceChange={productFilters.handleMinPriceChange}
                onMaxPriceChange={productFilters.handleMaxPriceChange}
                onCategoryChange={productFilters.handleCategoryChange}
                onSortChange={productFilters.handleSortChange}
                onSearchSubmit={productFilters.handleSearchSubmit}
            />

            <div className={styles.catalog}>
                <ProductsGrid products={products} onAddToCart={handleAddToCart} />

                <CatalogStatus
                    isLoading={isLoading}
                    error={error}
                    cartMessage={cartMessage}
                    hasSearched={hasSearched}
                    hasProducts={products.length > 0}
                />

                <CatalogPagination
                    page={page}
                    isLoading={isLoading}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                />
            </div>
        </section>
    );
};
