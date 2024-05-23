/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

const Search = ({ setParPage, searchValue, setSearchValue }) => {
  return (
    <div className="flex justify-start">
      <select
        onChange={(e) => setParPage(parseInt(e.target.value))}
        required
        className="mr-5 rounded-md"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
      <input
        type="text"
        placeholder="Tìm kiếm..."
        className="input input-bordered w-[450px] input-md"
        onChange={(event) => setSearchValue(event.target.value)}
        value={searchValue}
      />
    </div>
  );
};

export default Search;
