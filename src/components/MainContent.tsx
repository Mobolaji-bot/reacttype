import { useEffect, useState } from "react";
import { FilterProvider, useFilter } from "./FilterContext";
import { Tally3 } from "lucide-react";
import axios from "axios";
import BookCard from "./BookCard";

const MainContent = () => {
  const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } 
    useFilter(); // this retrieves these variables and makes them usable
  const [products, setProducts] = useState<any[]>([]); //so it updates the product by having an empty array as it default and the any attribute makes it that any attribute can be stored in an array
  const [filter, setFilter] = useState("all"); //it updates the filter and having all as its default which makes it keep track of all the filler options
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const itemPerPage = 12;

  useEffect(() => {
    let url = `https://dummyjson.com/products?limit=${itemPerPage}&skip=${
      (currentPage - 1) * itemPerPage
    }`;
    if (keyword) {
      url = `https://dummyjson.com/products/search?q=${keyword}`;
    } // so it automatically updates the link based on the user input
    axios
      .get(url)
      .then((response) => {
        setProducts(response.data.products);
        console.log(response.data.products);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [currentPage, keyword]); // this sends the request url to the api and it updates itself when successful based on the keywords category or current page

  const getFilteredProducts = () => {
    let filteredProducts = products;
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      ); // this lets it that when a category has been selected it only brings the products related to that category
    }
    if (minPrice != undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice
      );
    } // this checks if min price has a valid value and if it does it will bring up products which have the same price or more than the price that the user typed

    if (maxPrice != undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= maxPrice
      );
    }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case "expensive":
        return filteredProducts.sort((a, b) => b.price - a.price);
      case "cheap":
        return filteredProducts.sort((a, b) => a.price - b.price);
      case "popular":
        return filteredProducts.sort((a, b) => b.rating - a.rating);
      default:
        return filteredProducts;
    }
  };

  const filteredProducts = getFilteredProducts();

  console.log(filteredProducts);

  const totalProducts = 100;
  const totalPages = Math.ceil(totalProducts / itemPerPage)

  const handlePageChange = (page:number) => {
  if (page > 0 && page <= totalPages){
    setCurrentPage(page);
  }
  }

  const getPageinationButtons = () => {
    const buttons: number[] = []
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, currentPage + 2)

    if(currentPage - 2 < 1){
      endPage = Math.min(totalPages, endPage + (2 - currentPage - 1))
    }

      if (currentPage + 2 > 1) {
        startPage = Math.min(1, startPage - (2 - totalPages - currentPage));
      }

      for(let page = startPage; page <= endPage; page++){
        buttons.push(page)
      }

      return buttons
  }

  return (
    <section className="xl:w-[55rem] lg:w-[55rem] sm:w-[40rem] xs:w-[20rem] p-5">
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row justify-between item-center">
          <div className="relative mb-5 mt-5">
            <button className="border px-4 py-2 rounded-full flex item-center">
              <Tally3 className="mr-2" />
              {filter === "all"
                ? "Filter"
                : filter.charAt(0).toLocaleLowerCase() + filter.slice(1)}
            </button>{" "}
            {/* when filter is directly equals to all it will give Filter but if not it will turn the first letter to small letter */}
            {dropdownOpen && (
              <div className="absolute bg-white border border-gray-300 rounded mt-2 w-full sm:w-40">
                <button
                  onClick={() => setFilter("cheap")}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                >
                  Cheap
                </button>

                <button
                  onClick={() => setFilter("expensive")}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                >
                  Expensive
                </button>

                <button
                  onClick={() => setFilter("popular")}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                >
                  Popular
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <BookCard
              key={product.id}
              id={product.id}
              title={product.title}
              image={product.thumbnail}
              price={product.price}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-5">
          {/* prev but */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border px-4 py-2 mx-2 rounded-full"
          >
            Previous
          </button>

          {/* 1  2 3 */}
          <div className="flex flex-wrap justify-center">
            {/*pageination button */}
            {getPageinationButtons().map(page =>(
              <button key={page} onClick={() => handlePageChange(page)} className={`border px-4 py-2 mx-1 rounded-full ${page === currentPage ? "bg-black text-white": ""}`}>{page}</button>
            ))}
          </div>

          {/* next but */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border px-4 py-2 mx-2 rounded-full"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default MainContent;
