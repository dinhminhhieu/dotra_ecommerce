import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Shipping from "./pages/Shipping/Shipping";
import CategoryShop from "./pages/CategoryShop";
import SearchProducts from "./pages/SearchProducts";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import OauthGoogle from "./pages/OauthGoogle";
import Payment from "./pages/Payment/Payment";
import ProtectUser from "./routes/ProtectUser";
import Dashboard from "./pages/Dashboard/Dashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import MyOrders from "./components/CustomerDashboard/MyOrders";
import MyWishList from "./components/CustomerDashboard/MyWishList";
import Chat from "./components/CustomerDashboard/Chat";
import OrderDetails from "./components/CustomerDashboard/OrderDetails/OrderDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/home/product-details/:productId"
          element={<ProductDetails />}
        />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/products?" element={<CategoryShop />} />
        <Route path="/products/search?" element={<SearchProducts />} />
        <Route
          path="/verify-email-customer/:email_token"
          element={<VerifyEmail />}
        />
        <Route path="/oauth/google-login" element={<OauthGoogle />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment/payment-error" element={<PaymentError />} />

        <Route path="/dashboard" element={<ProtectUser />}>
          <Route path="" element={<Dashboard />}>
            <Route path="" element={<CustomerDashboard />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="my-wishlist" element={<MyWishList />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:sellerId" element={<Chat />} />
            <Route
              path="my-orders/get-order-details/:orderId"
              element={<OrderDetails />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
