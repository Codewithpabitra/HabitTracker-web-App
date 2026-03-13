import { useState, useEffect } from "react";
import { getClassifiedWords } from "../utils/paranoia.js";

export const useParanoiaMode = (containerText) => {
  const [redactedWords, setRedactedWords] = useState([]);

  useEffect(() => {
    if (!containerText) return;
    getClassifiedWords(containerText).then(setRedactedWords).catch(console.error);
  }, [containerText]);

  return redactedWords; // string[]
};