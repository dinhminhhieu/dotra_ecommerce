/* eslint-disable no-unused-vars */
import { Badge, Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  add_coupons,
  delete_coupons,
  get_coupon,
  get_coupons,
  message_clear,
  update_coupons,
} from "../../../store/reducers/coupons.reducers";
import { toast } from "react-toastify";
import {
  formatDate,
  formatDateTimeLocal,
  formateCurrency,
} from "../../../utils/formate";
import ClipLoader from "react-spinners/ClipLoader";
import Panigation from "../../../components/Panigation";
import Search from "../../../components/Search";
import icons from "../../../assets/icons";

const Coupons = () => {
  const { BsTrash, FaEdit, HiOutlineExclamationCircle } = icons;
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [parPage, setParPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [updateCouponsId, setUpdateCouponsId] = useState("");
  const [deleteCouponsId, setDeleteCouponsId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const [state, setState] = useState({
    coupons_name: "",
    coupons_code: "",
    coupons_price: "",
    start_day: "",
    end_date: "",
  });

  const [stateUpdateCoupons, setStateUpdateCoupons] = useState({
    coupons_name: "",
    coupons_code: "",
    coupons_price: "",
    start_day: "",
    end_date: "",
  });

  const {
    loading,
    success_message,
    error_message,
    totalCoupons,
    coupons,
    coupon,
  } = useSelector((state) => state.coupons);

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddCoupons = (event) => {
    event.preventDefault();
    dispatch(add_coupons(state));
  };

  const handleInputUpdateCoupons = (event) => {
    setStateUpdateCoupons({
      ...stateUpdateCoupons,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (updateCouponsId) {
      dispatch(get_coupon(updateCouponsId));
    }
  }, [updateCouponsId]);

  useEffect(() => {
    if (coupon) {
      setStateUpdateCoupons({
        coupons_name: coupon.coupons_name,
        coupons_code: coupon.coupons_code,
        coupons_price: coupon.coupons_price,
        start_day: formatDateTimeLocal(coupon.start_day),
        end_date: formatDateTimeLocal(coupon.end_date),
      });
    }
  }, [coupon]);

  const handleUpdateCoupons = (event) => {
    event.preventDefault();
    const data = {
      coupons_name: stateUpdateCoupons.coupons_name,
      coupons_code: stateUpdateCoupons.coupons_code,
      coupons_price: stateUpdateCoupons.coupons_price,
      start_day: stateUpdateCoupons.start_day,
      end_date: stateUpdateCoupons.end_date,
      coupons_id: updateCouponsId,
    };
    dispatch(update_coupons(data));
  };

  useEffect(() => {
    if (deleteCouponsId) {
      dispatch(delete_coupons(deleteCouponsId));
    }
  }, [deleteCouponsId]);

  useEffect(() => {
    if (success_message) {
      toast.success(success_message);
      dispatch(message_clear());
      setOpenModal(false);
      setState({
        coupons_name: "",
        coupons_code: "",
        coupons_price: "",
        start_day: "",
        end_date: "",
      });
      setStateUpdateCoupons({
        coupons_name: "",
        coupons_code: "",
        coupons_price: "",
        start_day: "",
        end_date: "",
      });
      setOpenEditModal(false);
    }
    if (error_message) {
      toast.error(error_message);
      dispatch(message_clear());
    }
  }, [success_message, error_message]);

  useEffect(() => {
    const data = {
      page: currentPageNumber,
      parPage: parPage,
      searchValue: searchValue,
    };
    dispatch(get_coupons(data));
  }, [currentPageNumber, parPage, searchValue]);

  return (
    <div className="px-2 md:px-7 py-5 bg-[#dae1e7]">
      <h1 className="text-xl font-bold uppercase my-4">Mã giảm giá</h1>
      <div className="bg-white p-4 flex justify-between items-center rounded-lg">
        <Search
          setParPage={setParPage}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <Button color="success" size="lg" onClick={() => setOpenModal(true)}>
          Thêm mã giảm giá
        </Button>
        <Modal size="3xl" show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Thêm mã giảm giá</Modal.Header>
          <form onSubmit={handleAddCoupons}>
            <Modal.Body>
              <div className="flex justify-start items-center">
                <label htmlFor="coupons_name" className="w-[25%]">
                  Tên mã giảm giá:
                </label>
                <input
                  type="text"
                  name="coupons_name"
                  onChange={handleInputChange}
                  value={state.coupons_name}
                  placeholder="Nhập tên mã giảm giá..."
                  className="input input-bordered w-[75%]"
                />
              </div>
              <div className="flex justify-start items-center mt-4">
                <label htmlFor="coupons_code" className="w-[25%]">
                  Mã code:
                </label>
                <input
                  type="text"
                  name="coupons_code"
                  onChange={handleInputChange}
                  value={state.coupons_code}
                  placeholder="Nhập mã giảm giá..."
                  className="input input-bordered w-[75%]"
                />
              </div>
              <div className="flex justify-start items-center mt-4">
                <label htmlFor="coupons_price" className="w-[25%]">
                  Giá giảm:
                </label>
                <input
                  type="number"
                  name="coupons_price"
                  onChange={handleInputChange}
                  value={state.coupons_price}
                  placeholder="Nhập giá giảm..."
                  className="input input-bordered w-[75%]"
                />
              </div>
              <div className="flex justify-start items-center mt-4">
                <label htmlFor="time" className="w-[25%]">
                  Thời gian:
                </label>
                <div className="flex items-center">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <input
                      name="start_day"
                      type="datetime-local"
                      onChange={handleInputChange}
                      value={state.start_day}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <span className="mx-4 text-gray-500">to</span>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <input
                      name="end_date"
                      type="datetime-local"
                      onChange={handleInputChange}
                      value={state.end_date}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="submit"
                color="success"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <ClipLoader color="white" size={10} className="p-2" />
                ) : (
                  "Xác nhận"
                )}
              </Button>
              <Button color="failure" onClick={() => setOpenModal(false)}>
                Hủy bỏ
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
      <div className="overflow-x-auto mt-5">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>STT</Table.HeadCell>
            <Table.HeadCell>Tên mã giảm giá</Table.HeadCell>
            <Table.HeadCell>Mã code</Table.HeadCell>
            <Table.HeadCell>Giá giảm</Table.HeadCell>
            <Table.HeadCell>Ngày bắt đầu</Table.HeadCell>
            <Table.HeadCell>Ngày kết thúc</Table.HeadCell>
            <Table.HeadCell>Trạng thái</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {Array.isArray(coupons) &&
              coupons.map((c, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {c.coupons_name}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {c.coupons_code}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {formateCurrency(c.coupons_price)}
                  </Table.Cell>
                  <Table.Cell>{formatDate(c.start_day)}</Table.Cell>
                  <Table.Cell>{formatDate(c.end_date)}</Table.Cell>
                  <Table.Cell>
                    {c.isExpired ? (
                      <Badge color="failure" className="inline-block px-2 py-1">
                        Hết hạn
                      </Badge>
                    ) : (
                      <Badge color="success" className="inline-block px-2 py-1">
                        Hoạt động
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-warp gap-4">
                      <FaEdit
                        onClick={() => {
                          setOpenEditModal(true);
                          setUpdateCouponsId(c._id);
                        }}
                        size={16}
                        className="text-yellow-400 cursor-pointer"
                      />
                      <Modal
                        size="3xl"
                        show={openEditModal}
                        onClose={() => setOpenEditModal(false)}
                      >
                        <Modal.Header>Chỉnh sửa mã giảm giá</Modal.Header>
                        <form onSubmit={handleUpdateCoupons}>
                          <Modal.Body>
                            <div className="flex justify-start items-center">
                              <label htmlFor="coupons_name" className="w-[25%]">
                                Tên mã giảm giá:
                              </label>
                              <input
                                type="text"
                                name="coupons_name"
                                onChange={handleInputUpdateCoupons}
                                value={stateUpdateCoupons.coupons_name}
                                placeholder="Nhập tên mã giảm giá..."
                                className="input input-bordered w-[75%]"
                              />
                            </div>
                            <div className="flex justify-start items-center mt-4">
                              <label htmlFor="coupons_code" className="w-[25%]">
                                Mã code:
                              </label>
                              <input
                                type="text"
                                name="coupons_code"
                                onChange={handleInputUpdateCoupons}
                                value={stateUpdateCoupons.coupons_code}
                                placeholder="Nhập mã giảm giá..."
                                className="input input-bordered w-[75%]"
                              />
                            </div>
                            <div className="flex justify-start items-center mt-4">
                              <label
                                htmlFor="coupons_price"
                                className="w-[25%]"
                              >
                                Giá giảm:
                              </label>
                              <input
                                type="number"
                                name="coupons_price"
                                onChange={handleInputUpdateCoupons}
                                value={stateUpdateCoupons.coupons_price}
                                placeholder="Nhập giá giảm..."
                                className="input input-bordered w-[75%]"
                              />
                            </div>
                            <div className="flex justify-start items-center mt-4">
                              <label htmlFor="time" className="w-[25%]">
                                Thời gian:
                              </label>
                              <div className="flex items-center">
                                <div className="relative">
                                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg
                                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                    </svg>
                                  </div>
                                  <input
                                    name="start_day"
                                    type="datetime-local"
                                    onChange={handleInputUpdateCoupons}
                                    value={stateUpdateCoupons.start_day}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  />
                                </div>
                                <span className="mx-4 text-gray-500">to</span>
                                <div className="relative">
                                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg
                                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                    </svg>
                                  </div>
                                  <input
                                    name="end_date"
                                    type="datetime-local"
                                    onChange={handleInputUpdateCoupons}
                                    value={stateUpdateCoupons.end_date}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              type="submit"
                              color="success"
                              disabled={loading ? true : false}
                            >
                              {loading ? (
                                <ClipLoader
                                  color="white"
                                  size={10}
                                  className="p-2"
                                />
                              ) : (
                                "Xác nhận"
                              )}
                            </Button>
                            <Button
                              color="failure"
                              onClick={() => setOpenEditModal(false)}
                            >
                              Hủy bỏ
                            </Button>
                          </Modal.Footer>
                        </form>
                      </Modal>
                      <BsTrash
                        onClick={() => {
                          setOpenDeleteModal(true);
                        }}
                        size={16}
                        className="text-red-500 cursor-pointer"
                      />
                      <Modal
                        show={openDeleteModal}
                        size="md"
                        onClose={() => setOpenDeleteModal(false)}
                        popup
                      >
                        <Modal.Header />
                        <Modal.Body>
                          <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                              Bạn muốn xóa mã giảm giá này?
                            </h3>
                            <div className="flex justify-center gap-4">
                              <Button
                                color="failure"
                                onClick={() => {
                                  setDeleteCouponsId(c._id);
                                  setOpenDeleteModal(false);
                                }}
                              >
                                Xác nhận
                              </Button>
                              <Button
                                color="gray"
                                onClick={() => setOpenDeleteModal(false)}
                              >
                                Hủy bỏ
                              </Button>
                            </div>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        {totalCoupons > parPage && (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Panigation
              currentPageNumber={currentPageNumber}
              setCurrentPageNumber={setCurrentPageNumber}
              totalItem={totalCoupons}
              parPage={parPage}
              showItem={Math.floor(totalCoupons / parPage)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;
