const decodeString = (str) => {
  try {
    const parser = new DOMParser();
    const decoded = parser.parseFromString(str, "text/html").documentElement
      .textContent;
    return decoded;
  } catch (e) {
    console.error("Failed to decode string:", str, e);
    return str;
  }
};

export const processQuestions = (results) => {
  return results.map((q) => ({
    ...q,
    category: decodeString(q.category),
    question: decodeString(q.question),
    correct_answer: decodeString(q.correct_answer),
  }));
};
