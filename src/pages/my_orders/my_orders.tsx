import styles from './my_orders.module.scss';
import { useOrders } from './model/useOrders';
import { OrdersHeader } from './ui/OrdersHeader';
import { OrdersList } from './ui/OrdersList';
import { OrdersPagination } from './ui/OrdersPagination';
import { OrdersStatus } from './ui/OrdersStatus';

export const MyOrdersPage = () => {
    const {
        orders,
        detailsByOrderId,
        pageIndex,
        isLoading,
        loadingOrderId,
        error,
        loadOrderDetails,
        handlePreviousPage,
        handleNextPage,
    } = useOrders();

    return (
        <section className={styles['page-wrapper']}>
            <OrdersHeader />

            <OrdersStatus
                isLoading={isLoading}
                error={error}
                hasOrders={orders.length > 0}
            />

            <OrdersList
                orders={orders}
                detailsByOrderId={detailsByOrderId}
                loadingOrderId={loadingOrderId}
                onLoadDetails={loadOrderDetails}
            />

            <OrdersPagination
                pageIndex={pageIndex}
                isLoading={isLoading}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
            />
        </section>
    );
};
