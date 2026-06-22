import styles from './admin.module.scss';
import { useAdminProducts } from './model/useAdminProducts';
import { AdminHeader } from './ui/AdminHeader';
import { AdminPagination } from './ui/AdminPagination';
import { AdminProductsList } from './ui/AdminProductsList';
import { AdminSearch } from './ui/AdminSearch';
import { AdminStatus } from './ui/AdminStatus';

export const AdminPage = () => {
    const {
        search,
        page,
        products,
        draftsByProductId,
        isLoading,
        pendingProductId,
        error,
        successMessage,
        handleSearchChange,
        handleSearchSubmit,
        handleDraftChange,
        handleSaveProduct,
        handleDeleteProduct,
        handlePreviousPage,
        handleNextPage,
    } = useAdminProducts();

    return (
        <section className={styles['page-wrapper']}>
            <AdminHeader />

            <AdminSearch
                search={search}
                isLoading={isLoading}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
            />

            <AdminStatus
                isLoading={isLoading}
                error={error}
                successMessage={successMessage}
                hasProducts={products.length > 0}
            />

            <AdminProductsList
                products={products}
                draftsByProductId={draftsByProductId}
                pendingProductId={pendingProductId}
                onDraftChange={handleDraftChange}
                onSave={handleSaveProduct}
                onDelete={handleDeleteProduct}
            />

            <AdminPagination
                page={page}
                isLoading={isLoading}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
            />
        </section>
    );
};
