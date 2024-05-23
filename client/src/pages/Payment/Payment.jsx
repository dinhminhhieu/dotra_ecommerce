/* eslint-disable no-unused-vars */

import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Stripe from "../../components/Stripe";
import { formateCurrency } from "../../utils/formate";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const {
    state: { orderId, price, items },
  } = useLocation();

  return (
    <div>
      <Header />
      <section className="bg-[#eeeeee]">
        <div className="w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 mt-4">
          <div className="flex flex-wrap md:flex-col-reverse">
            <div className="w-7/12 md:w-full">
              <div className="pr-2 md:pr-0">
                <div className="flex flex-wrap">
                  <div
                    onClick={() => setPaymentMethod("stripe")}
                    className={`w-[20%] border-r cursor-pointer py-8 px-12 ${
                      paymentMethod === "stripe" ? "bg-white" : "bg-slate-100"
                    }`}
                  >
                    <div className="flex flex-col gap-[3px] justify-center items-center">
                      <img src="/src/assets/img/stripe.png" alt="stripe" />
                      <span className="text-slate-600">Stripe</span>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("VnPay")}
                    className={`w-[20%] border-r cursor-pointer py-8 px-12 ${
                      paymentMethod === "VnPay" ? "bg-white" : "bg-slate-100"
                    }`}
                  >
                    <div className="flex flex-col gap-[3px] justify-center items-center">
                      <img src="/src/assets/img/vnpay.png" alt="VnPay" />
                      <span className="text-slate-600">VnPay</span>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("MoMo")}
                    className={`w-[20%] border-r cursor-pointer py-8 px-12 ${
                      paymentMethod === "MoMo" ? "bg-white" : "bg-slate-100"
                    }`}
                  >
                    <div className="flex flex-col gap-[3px] justify-center items-center">
                      <img src="/src/assets/img/momo.png" alt="MoMo" />
                      <span className="text-slate-600">MoMo</span>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("PayPal")}
                    className={`w-[20%] border-r cursor-pointer py-8 px-12 ${
                      paymentMethod === "PayPal" ? "bg-white" : "bg-slate-100"
                    }`}
                  >
                    <div className="flex flex-col gap-[3px] justify-center items-center">
                      <img src="/src/assets/img/paypal.png" alt="PayPal" />
                      <span className="text-slate-600">PayPal</span>
                    </div>
                  </div>
                </div>
                {paymentMethod === "stripe" && (
                  <div className="w-full px-4 py-8 bg-white shadow-sm">
                    <Stripe orderId={orderId} />
                  </div>
                )}
                {paymentMethod === "MoMo" && (
                  <div className="w-full px-4 py-8 bg-white shadow-sm">
                    <button className="px-10 py-[6px] rounded-sm hover:shadow-wrange-500/20 hover:shadow-lg bg-pink-600 text-white">
                      Thanh toán ngay
                    </button>
                  </div>
                )}
                {paymentMethod === "PayPal" && (
                  <div className="w-full px-4 py-8 bg-white shadow-sm">
                    <button className="px-10 py-[6px] rounded-sm hover:shadow-wrange-500/20 hover:shadow-lg bg-blue-600 text-white">
                      Thanh toán ngay
                    </button>
                  </div>
                )}
                {paymentMethod === "VnPay" && (
                  <div className="w-full px-4 py-8 bg-white shadow-sm">
                    <button className="px-10 py-[6px] rounded-sm hover:shadow-wrange-500/20 hover:shadow-lg bg-orange-600 text-white">
                      Thanh toán ngay
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-5/12 md:w-full">
              <div className="pl-2 md:pl-0 md:mb-0">
                <div className="bg-white shadow p-5 text-slate-600 flex flex-col gap-3">
                  <h2 className="text-xl font-bold">Tóm Tắt Đơn Hàng</h2>
                  <div className="flex justify-between items-center">
                    <span>({items}) sản phẩm + phí vận chuyển</span>
                    <span className="text-lg font-bold ml-2">
                      {formateCurrency(price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-xl">Tổng cộng</span>
                    <span className="text-xl font-bold text-red-500 ml-2">
                      {formateCurrency(price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Payment;
