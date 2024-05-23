/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_order_details } from "../../../store/reducers/order.reducers";
import { formatDate, formateCurrency } from "../../../utils/formate";
import { Badge } from "flowbite-react";

const OrderDetails = () => {
  const dispath = useDispatch();
  const { orderId } = useParams();
  const { userInfo } = useSelector((state) => state.customer);
  const { order_details } = useSelector((state) => state.order);

  console.log(orderId);

  useEffect(() => {
    dispath(get_order_details(orderId));
  }, [orderId]);

  return (
    <div className="bg-white p-5">
      <h1 className="text-2xl font-semibold text-center mb-2">
        Chi tiết đơn hàng
      </h1>
      <h2 className="text-red-600 font-semibold">
        <span> Mã đơn hàng: #{order_details._id}</span>
        <h2 className="text-green-500">
          Ngày đặt hàng: <span>{formatDate(order_details.createdAt)}</span>
        </h2>
      </h2>
      <div className="grid grid-cols-1 gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-slate-600 font-semibold">
            Giao hàng đến: {order_details.customer_name}
          </h2>
          <p>
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
          <p className="text-slate-600 text-sm font-semibold">
            Email: {userInfo.email}
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
                return <Badge color="success">Đã giao</Badge>;
              } else if (order_details.delivery_status === "processing") {
                return (
                  <Badge className="" color="warning">
                    Đang xử lý
                  </Badge>
                );
              } else if (order_details.delivery_status === "shipping") {
                return <Badge color="purple">Vận chuyển</Badge>;
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
            <Link key={p._id} to={`/home/product-details/${p._id}`}>
              <div className="flex gap-5 justify-start items-center text-slate-600">
                <div className="flex gap-2">
                  <img
                    className="w-[55px] h-[55px]"
                    src={p.images[0]}
                    alt="image"
                  />
                  <div className="flex text-sm flex-col justify-start items-start line-clamp-2">
                    <span>{p.product_name}</span>
                    <p>
                      <span className="text-sm text-blue-600 font-medium">
                        Thương hiệu : {p.brand_name}
                      </span>
                      <h2>Số lượng: {p.quantity}</h2>
                    </p>
                  </div>
                  <div className="pl-4 flex justify-end">
                    <span className="text-base text-sm line-through">
                      {formateCurrency(p.price)}
                    </span>
                    <span className="text-red-500 font-semibold ml-2">
                      {formateCurrency(p.price - (p.price * p.discount) / 100)}
                    </span>
                    <p className="ml-4 font-mono text-red-500">
                      (Giảm {p.discount}%)
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
