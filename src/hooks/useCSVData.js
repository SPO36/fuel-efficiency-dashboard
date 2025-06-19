import Papa from "papaparse";
import { useEffect, useState } from "react";

export const useCSVData = (csvPath) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCSV = async () => {
      try {
        const response = await fetch(csvPath);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          delimitersToGuess: [",", "\t", "|", ";"],
          complete: (results) => {
            // 헤더 공백 제거
            const cleanedData = results.data.map((row) => {
              const cleanedRow = {};
              Object.keys(row).forEach((key) => {
                const cleanKey = key.trim();
                cleanedRow[cleanKey] = row[key];
              });
              return cleanedRow;
            });

            setData(cleanedData);
            setLoading(false);
          },
          error: (err) => {
            setError(err);
            setLoading(false);
          },
        });
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (csvPath) {
      loadCSV();
    }
  }, [csvPath]);

  return { data, loading, error };
};
