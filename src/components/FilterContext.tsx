import { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
    searchQuery: string
    setSearchQuery: (query:string) => void; // this allows it to accept a string therefore updating it and it does nothing with it for now
    selectedCategory: string;
    setselectedCategory:(category: string) => void;
    minPrice: number | undefined;
    setMinPrice: (price:number | undefined) => void; // this allows it to accept a parameter of a number and if i want to reset it it can go to undefined for flexibility
    maxPrice: number | undefined;
    setMaxPrice: (price:number | undefined) => void;
    keyword: string;
    setKeyword: (keyword:string) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined) // This helps to create a React context which we can pass data through other components. The default value is undefined and the <FilterContextType | undefined> makes it 
export const FilterProvider: React.FC<{children:ReactNode}> = ({children}) => { 
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setselectedCategory] = useState<string>("") // this updates the selected Category with an empty string and it ensures that initially it starts with an empty string and only a string can be fitted into it
    const [minPrice, setMinPrice] = useState<number| undefined>(undefined) // this updates the min price, originally initialized  as undefined but it can take a number or undefined when it will be reseted
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
    const [keyword, setKeyword] = useState<string>("")

    return <FilterContext.Provider value={{ //This makes me export the data from this file and makes me use it oin other components 
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setselectedCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        keyword,
        setKeyword
    }}>
        {children}
    </FilterContext.Provider>
}
export const useFilter = () => {
    const context = useContext(FilterContext)
    if(context === undefined) {
        throw new Error("UserFilter must be used within a FilterProvider")
    }
    return context
}