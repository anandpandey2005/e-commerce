import React, { useEffect, useState } from "react";
import axios from "axios";
import { CategoryCard } from "../../handler";
export default function Categories() {
  const [Categories, setCategories] = useState(null);

  useEffect(() => {
    axios.get()
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col">
      <h1 className="w-full text-center text-white font-bold p-5 bg-yellow-500">
        Category
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4  mx-auto overflow-x-auto">
        {" "}
        <CategoryCard />
      </div>
    </div>
  );
}
