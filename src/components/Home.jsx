import React, { useEffect, useMemo, useState } from "react";
import CategoryChart from "./CategoryChart";
import DifficultyChart from "./DifficultyChart";
import { API_URL } from "../constants";
import { processQuestions } from "../service/DataService";
import StatisticIcon from "../icons/StatisticIcon";
import FilterIcon from "../icons/FilterIcon";
import RefreshIcon from "../icons/RefreshIcon";

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
        if (data.response_code !== 0) {
          const codeMap = {
            1: "No Results Could not return results. The API doesn't have enough questions for your query.",
            2: "Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid.",
            3: "Token Not Found Session Token does not exist.",
            4: "Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.",
            5: "Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.",
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
      .finally(() => {
        setLoading(false);
      });
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

  if (loading && fullData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] bg-gray-100">
        <div className="flex flex-col items-center space-y-3 text-gray-700 p-8 bg-white rounded-xl shadow-lg">
          <RefreshIcon className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-xl font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (fullData.length === 0 && error) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] bg-gray-100 p-4">
        <div className="p-8 bg-white border border-red-200 text-red-700 rounded-xl shadow-lg max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Error Loading Data</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => fetchQuestions()}
            className="px-6 py-2 bg-red-700 text-white rounded-lg shadow-md hover:bg-red-800 transition duration-150"
          >
            Try Reloading Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-t-4 border-indigo-800">
      <header className="mb-8 flex justify-center items-center gap-2 w-full">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center mx-auto">
          <StatisticIcon className="w-7 h-7 mr-2 text-indigo-800" />
          Trivia Statistics
        </h1>
      </header>
      <div className="mb-10 text-center flex items-center justify-center space-x-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200 shadow-inner">
        <FilterIcon className="w-5 h-5 text-indigo-800" />
        <label htmlFor="categories" className="text-indigo-800 font-semibold">
          Category:
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
