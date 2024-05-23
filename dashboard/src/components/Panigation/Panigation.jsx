/* eslint-disable react/prop-types */

import icons from "../../assets/icons";

const Panigation = ({
  currentPageNumber,
  setCurrentPageNumber,
  totalItem,
  parPage,
  showItem,
}) => {
  const { FaChevronLeft, FaChevronRight } = icons;

  let totalPage = Math.ceil(totalItem / parPage);
  let startPage = currentPageNumber;
  let dif = totalPage - currentPageNumber;

  if (dif <= showItem) {
    startPage = totalPage - showItem;
  }

  let endPage = startPage < 0 ? showItem : showItem + startPage;

  if (startPage <= 0) {
    startPage = 1;
  }

  const createBtn = () => {
    const btns = [];
    for (let i = startPage; i < endPage; i++) {
      btns.push(
        <li
          className={`${
            currentPageNumber === i
              ? "bg-gray-600 shadow-lg shadow-gray-600/50 text-white"
              : "bg-white hover:bg-gray-600 shadow-lg hover:shadow-gray-600/50 hover:text-white"
          } w-[45px] h-[40px] flex justify-center items-center cursor-pointer`}
          onClick={() => setCurrentPageNumber(i)}
        >
          {i}
        </li>
      );
    }
    return btns;
  };
  return (
    <ul className="flex">
      {currentPageNumber > 1 && (
        <li
          onClick={() => setCurrentPageNumber(currentPageNumber - 1)}
          className="w-[45px] h-[40px] flex justify-center items-center bg-white text-white cursor-pointer"
        >
          <FaChevronLeft color="black" />
        </li>
      )}
      {createBtn()}
      {currentPageNumber < totalPage && (
        <li
          onClick={() => setCurrentPageNumber(currentPageNumber + 1)}
          className="w-[45px] h-[40px] flex justify-center items-center bg-white text-white cursor-pointer"
        >
          <FaChevronRight color="black" />
        </li>
      )}
    </ul>
  );
};

export default Panigation;
