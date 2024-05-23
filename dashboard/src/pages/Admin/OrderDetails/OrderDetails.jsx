import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { formatDate, formateCurrency } from "../../../utils/formate";
import { Badge } from "flowbite-react";
import { get_order_details_to_admin } from "../../../store/reducers/order.reducers";

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { order_details } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(get_order_details_to_admin(orderId));
  }, [orderId]);
  return (
    <div className="bg-white">
      <div className="p-5">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Chi tiết đơn hàng
        </h1>
        <h2 className="text-red-600 font-semibold">
          <span> Mã đơn hàng: #{order_details._id}</span>
          <h2 className="text-green-500 mt-1">
            Ngày đặt hàng: <span>{formatDate(order_details.createdAt)}</span>
          </h2>
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-600 font-semibold mt-1">
              Giao hàng đến: {order_details.customer_name}
            </h2>
            <p className="mb-1">
              <span className="bg-red-500 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                Nhà riêng
              </span>
              <span className="text-slate-600 text-sm">
                {order_details.delivery_address?.address}, {""}
                {order_details.delivery_address?.ward}, {""}
                {order_details.delivery_address?.district}, {""}
                {order_details.delivery_address?.province}
              </span>
            </p>
          </div>
        </div>
        <div className="text-slate-600">
          <p>
            Đơn giá:{" "}
            <span className="text-base text-red-500 font-bold">
              {formateCurrency(order_details.price)}
            </span>
          </p>
          <p className="my-1">
            Trạng thái thanh toán:{" "}
            <span>
              {order_details.payment_status === "paid" ? (
                <Badge color="success" className="inline-block px-2 py-1">
                  Đã thanh toán
                </Badge>
              ) : (
                <Badge color="failure" className="inline-block px-2 py-1">
                  Chưa thanh toán
                </Badge>
              )}
            </span>
          </p>
          <p>
            <span className="flex justify-start items-center">
              Tình trạng đơn hàng:{" "}
              {(() => {
                if (order_details.delivery_status === "delivered") {
                  return <Badge color="success">Đã nhận</Badge>;
                } else if (order_details.delivery_status === "processing") {
                  return (
                    <Badge className="" color="warning">
                      Đang xử lý
                    </Badge>
                  );
                } else {
                  return <Badge color="failure">Đã hủy</Badge>;
                }
              })(order_details.delivery_status)}
            </span>
          </p>
        </div>
        <div className="mt-3">
          <h2 className="text-slate-600 text-lg pb-2 font-semibold">
            Sản phẩm đã mua
          </h2>
          <div className="flex gap-5 flex-col">
            {order_details.products?.map((p) => (
              <div key={p._id}>
                <div className="flex gap-5 justify-start items-center text-slate-600">
                  <div className="flex gap-2">
                    <img
                      className="w-[55px] h-[55px]"
                      src={p.images[0]}
                      alt="image"
                    />
                    <div className="flex text-sm flex-col justify-start items-start line-clamp-2">
                      <div>{p.product_name}</div>
                      <p>
                        <span className="text-sm text-blue-600 font-semibold">
                          Thương hiệu : {p.brand_name}
                        </span>
                        <h2>Số lượng: {p.quantity}</h2>
                      </p>
                    </div>
                    <div className="pl-4 flex justify-end">
                      <span className="text-sm line-through">
                        {formateCurrency(p.price)}
                      </span>
                      <span className="text-red-500 font-semibold ml-2">
                        {formateCurrency(
                          p.price - (p.price * p.discount) / 100
                        )}
                      </span>
                      <p className="ml-4 font-mono text-red-500">
                        (Giảm {p.discount}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-2">
        <div className="w-full border border-black mb-2"></div>
        <div className="flex flex-col text-sm">
          {order_details?.sellerOfOrder?.map((o) => (
            <div key={o._id} className="my-2">
              <div className="flex justify-start items-center font-semibold my-1">
                <span className="mr-1">Đơn hàng của shop:</span>
                {o.products.map((p) => (
                  <div key={p._id}>
                    <span> {p.shop_name}</span>
                  </div>
                ))}
              </div>
              <span className="text-red-500 font-semibold my-1">
                Mã seller: #{o?.sellerId}
              </span>
              <div className="text-green-500 font-semibold my-1">
                Mã đơn hàng của người bán: #{o?._id}
              </div>
              <div className="flex gap-5 flex-col">
                {o.products?.map((p) => (
                  <div key={p._id}>
                    <div className="flex gap-5 justify-start items-center text-slate-600">
                      <div className="flex gap-2">
                        <img
                          className="w-[55px] h-[55px]"
                          src={p.images[0]}
                          alt="image"
                        />
                        <div className="flex text-sm flex-col justify-start items-start line-clamp-2">
                          <div>{p.product_name}</div>
                          <p>
                            <span className="text-sm text-blue-600 font-semibold">
                              Thương hiệu : {p.brand_name}
                            </span>
                            <h2>Số lượng: {p.quantity}</h2>
                          </p>
                        </div>
                        <div className="pl-4 flex justify-end">
                          <span className="text-sm line-through">
                            {formateCurrency(p.price)}
                          </span>
                          <span className="text-red-500 font-semibold ml-2">
                            {formateCurrency(
                              p.price - (p.price * p.discount) / 100
                            )}
                          </span>
                          <p className="ml-4 font-mono text-red-500">
                            (Giảm {p.discount}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <ul className="timeline">
                <span className="mt-1 font-semibold">Trạng thái đơn hàng:</span>
                <li>
                  <div className="timeline-start text-xs">
                    {formatDate(o.createdAt)}
                  </div>
                  <div className="timeline-end timeline-box">Đang xử lý</div>
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-primary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {o.delivery_status === "processing" ? (
                    <hr />
                  ) : (
                    <hr className="bg-primary" />
                  )}
                </li>
                <li>
                  {o.delivery_status === "shipping" ? (
                    <>
                      <hr className="bg-primary" />
                      <div className="timeline-start text-xs">
                        {formatDate(o.changeStatusDate)}
                      </div>
                      <div className="timeline-middle">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5 text-primary"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <>
                      {o.delivery_status === "delivered" ? (
                        <>
                          <hr className="bg-primary" />
                          <div className="timeline-start text-xs">
                            {formatDate(o.changeStatusDate)}
                          </div>
                          <div className="timeline-middle">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-5 h-5 text-primary"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </>
                      ) : (
                        <>
                          <hr />
                          <div className="timeline-middle">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  <div className="timeline-end timeline-box">
                    Đang vận chuyển
                  </div>
                  {o.delivery_status === "delivered" ? (
                    <hr className="bg-primary" />
                  ) : (
                    <hr />
                  )}
                </li>

                <li>
                  {o.delivery_status === "delivered" ? (
                    <>
                      <hr className="bg-primary" />
                      <div className="timeline-start text-xs">
                        {formatDate(o.updatedAt)}
                      </div>
                      <div className="timeline-end timeline-box">Đã giao</div>
                      <div className="timeline-middle">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5 text-primary"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <>
                      <hr />
                      <div className="timeline-end timeline-box">Đã giao</div>
                      <div className="timeline-middle">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </>
                  )}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
