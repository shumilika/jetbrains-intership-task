import React, { useEffect, useMemo, useState } from "react";
import CategoryChart from "./CategoryChart";
import DifficultyChart from "./DifficultyChart";
import { API_URL } from "../constants";
import { processQuestions } from "../service/DataService";

const Home = () => {
  const [fullData, setFullData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchQuestions = (url) => {
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        console.log("data");
        if (data.response_code !== 0) {
          const codeMap = {
            1: "No results could be returned. Please try again with different parameters.",
            2: "Invalid Parameter was passed. Your request is malformed.",
          };
          throw new Error(
            codeMap[data.response_code] || "API returned an error code."
          );
        }

        const processedQuestions = processQuestions(data.results);
        setFullData(processedQuestions);

        const uniqueCategoriesList = [
          ...new Set(processedQuestions.map((item) => item.category)),
        ];
        setCategories(uniqueCategoriesList);

        if (
          selectedCategory !== "All" &&
          !uniqueCategoriesList.includes(selectedCategory)
        ) {
          setSelectedCategory("All");
        }
      })
      .catch((e) => {
        console.error("Failed to fetch questions:", e);
        setError(`Failed to load trivia data: ${e.message}`);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (fullData.length > 0) return;
    fetchQuestions(API_URL);
  }, [fullData]);

  const filteredQuestions = useMemo(() => {
    if (selectedCategory === "All") {
      return fullData;
    }
    return fullData.filter((q) => q.category === selectedCategory);
  }, [fullData, selectedCategory]);

  const categoryData = Object.entries(
    filteredQuestions.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({ category, count }));

  const difficultyData = Object.entries(
    filteredQuestions.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
      return acc;
    }, {})
  ).map(([difficulty, count]) => ({ difficulty, count }));

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-t-4 border-indigo-500">
      <header className="mb-8 text-center flex justify-center items-center">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Trivia Statistics
        </h1>
      </header>
      <div className="mb-10 text-center flex items-center justify-center space-x-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200 shadow-inner">
        <label htmlFor="categories" className="text-indigo-800 font-semibold">
          Category:{" "}
        </label>
        <select
          id="categories"
          className="p-2 border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white font-medium transition duration-150"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryChart chartData={categoryData} />
        <DifficultyChart chartData={difficultyData} />
      </div>
    </div>
  );
};

export default Home;
