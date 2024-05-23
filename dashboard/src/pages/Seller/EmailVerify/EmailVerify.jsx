import { Card } from "flowbite-react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  message_clear,
  verify_email,
} from "../../../store/reducers/auth.reducers";
import { toast } from "react-toastify";
import path from "../../../constants/path";

const EmailVerify = () => {
  const { emailToken } = useParams();
  const dispatch = useDispatch();
  const { success_message, error_message } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(verify_email(emailToken));
  }, [emailToken]);

  useEffect(() => {
    if (success_message) {
      toast.success(success_message);
      dispatch(message_clear());
    }

    if (error_message) {
      toast.error(error_message);
      dispatch(message_clear());
    }
  }, [success_message, error_message]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-sm">
        <div className="flex flex-col items-center pb-10">
          <img
            alt="Bonnie image"
            height="96"
            src="/src/assets/img/success.png"
            width="96"
            className="mb-3 rounded-full shadow-lg"
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Email Đã Được Xác Thực
          </h5>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <Link
              to={path.seller_login}
              className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmailVerify;
