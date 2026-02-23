import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import AskAi from "./components/AskAI";
import SearchResults from "./components/SearchResults";
import Order from "./components/Order";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import Register from "./components/Register";
import OTPVerify from "./components/OTPVerify";
import ForgotPassword from "./components/ForgotPassword";

// Create a separate component that uses useLocation
function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const location = useLocation();
  
  const hideNavbarRoutes = ["/login", "/register", "/otp-verify", "/forgot-password"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  return (
    <>
      <ToastContainer autoClose={2000} hideProgressBar={true} />
      {!shouldHideNavbar && <Navbar onSelectCategory={handleCategorySelect} />}
      
      <div className="min-vh-100 bg-light">
        <Routes>
          <Route
            path="/"
            element={<Home selectedCategory={selectedCategory} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verify" element={<OTPVerify />} />
          <Route path="/add_product" element={<AddProduct />} />
          <Route path="/product" element={<Product />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/update/:id" element={<UpdateProduct />} />
          <Route path="/askai" element={<AskAi />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/orders" element={<Order />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;