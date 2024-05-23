/* eslint-disable react/prop-types */
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const Stripe = ({ orderId }) => {
  const createCheckoutSession = async () => {
    const stripe = await loadStripe(
      "pk_test_51PGcpoAJsOUKToQLHups3zsNbtCzQpk5WDl0epa8oj5U7NGXXbY5tQK57QJFE8pXB5S4d8a5dclPqBRoe1Gz8ZWi00ZHKVWu8L"
    );
    localStorage.setItem("orderId", orderId);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        {
          orderId,
        },
        {
          withCredentials: true,
        }
      );
      const sessionId = response.data.sessionId;
      stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={createCheckoutSession}
        className="px-10 py-[6px] rounded-sm hover:shadow-wrange-500/20 hover:shadow-lg bg-red-600 text-white"
      >
        Bắt đầu thanh toán
      </button>
    </div>
  );
};

export default Stripe;
