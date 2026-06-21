import { Route, Routes } from "react-router";
import { HomePage } from "./pages/home/home";
import { MainLayout } from "./layouts/main/layout";
import { BasketPage } from "./pages/basket/basket";
import { MyOrdersPage } from "./pages/my_orders/my_orders";
import { useEffect } from "react";
import { getUserId } from "./shared/lib/user_id";

export const App = () => {
    useEffect(() => {
        getUserId();
    }, []);

    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/basket" element={<BasketPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
            </Route>
        </Routes>
    );
}
