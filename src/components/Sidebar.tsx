import { useEffect, useState } from "react"; // 
import { useFilter } from "./FilterContext";
interface Product {
  category: string;
}

interface FetchResponse {
  products: Product[];
}
const Sidebar = () => {
  const { //This is where i will use the files or data that i exported from the context api
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setselectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    keyword,
    setKeyword,
  } = useFilter();
  const [categories, setCategories] = useState<string[]>([]); //This allows strings but in arrays 
  const [keywords] = useState<string[]>([
    // This allows these keywords in arrays as well
    "apple",
    "watch",
    "Fashion",
    "trend",
    "shoes",
    "shirt",
  ]);
  useEffect(() => {
    const fetchCategories = async () => {
      // Allows me to run the api in the background
      try {
        const response = await fetch("https://dummyjson.com/products"); // This helps me fetch or get the api from the site
        const data: FetchResponse = await response.json(); // the response.json converts the http to a javascript object and the await waits for it to finish and the fetch response is a product with an empty array which is const data
        const uniqueCategories = Array.from(
          new Set(data.products.map((product) => product.category))
        ); // The data.products.map((product) => product.category) part makes sure that they are all in an array and not in array of objects and the set makes sure that they are no duplicate sof the same word and it also converts the array to object and the array converts it back to arrays
        setCategories(uniqueCategories);
        console.log(data);
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };
    fetchCategories();
  }, []);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value ? parseFloat(value) : undefined);
  }; // this updates the minprice so that the user types something it will convert it to a float number or if the user does not type anything it will remain undefined
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value ? parseFloat(value) : undefined);
  };
  const handleRadioChangeCategories = (category: string) => {
    setselectedCategory(category);
  };
  const handleKeywordClick = (keyword: string) => {
    setKeyword(keyword);
  };
  const handleReset = () => {
    setSearchQuery("");
    setselectedCategory("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setKeyword("");
  };

  return (
    <div className="w-64 p-5 h-screen">
      <h1 className="text-2xl font-bold mb-10 mt-4">React store</h1>

      <section>
        <input
          type="text"
          className="border-2 rounded px-2 sm:mb-0"
          placeholder="Search Product"
          value={searchQuery} // This makes the input field be in sync with the searchQuery
          onChange={(e) => setSearchQuery(e.target.value)} //This updates the searchQuery with everything the user types in the input type
        />

        <div className="flex justify-center items-center">
          <input
            type="text"
            className="border-2 mr-2 px-5 py-3 mb-3 w-full"
            placeholder="min"
            value={minPrice ?? ""} //This makes the minPrice to be in sync with the input filed if defined if not then it will return to null
            onChange={handleMinPriceChange}
          />
          <input
            type="text"
            className="border-2 mr-2 px-5 py-3 mb-3 w-full"
            placeholder="max"
            value={maxPrice ?? ""}
            onChange={handleMaxPriceChange}
          />
        </div>

        {/* category section */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold mb-3">Categories</h2>

          <section>
            {categories.map((category, index) => (
              <label key={index} className="block mb-2">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  className="mr-2 w-[16px] h-[16px]"
                  onChange={() => handleRadioChangeCategories(category)}
                  checked={selectedCategory === category}
                />
                {category.toUpperCase()}
              </label>
            ))}
          </section>
        </div>

        {/*keywords */}
        <div className="mb-5 mt-4">
          <h2 className="text-xl font-semibold mb-3">Keywords</h2>
          <div>
            {keywords.map((keyword, index) => (
              <button
                key={index}
                onClick={() => handleKeywordClick(keyword)}
                className="block mb-2 px-4 py-2 w-full text-left border rounded hover:bg-gray-200"
              >
                {keyword.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="w-full mb-[4rem] py-2 bg-black text-white rounded mt-5"
        >
          Reset Filters
        </button>
      </section>
    </div>
  );
};

export default Sidebar;
