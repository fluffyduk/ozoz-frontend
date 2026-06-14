import { Route, Routes } from "react-router";
import { HomePage } from "./pages/home/home";
import { MainLayout } from "./layouts/main/layout";

export const App = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/basket" element={<HomePage />} />
                <Route path="/my-orders" element={<HomePage />} />
            </Route>
        </Routes>
    );
}
