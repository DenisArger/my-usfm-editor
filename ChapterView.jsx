import { useEffect, useState } from "react";
import { Proskomma } from "proskomma-core";
import axios from "axios";

const URL =
  "https://git.door43.org/ru_gl/ru_rlob/raw/078d6c572bacf26d628b6bc563950f4167535af3/65-3JN.usfm";

const fetchData = (url) => {
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

function ChapterView() {
  const [versesData, setVersesData] = useState([]);

  useEffect(() => {
    const parseData = async () => {
      try {
        const pk = new Proskomma();
        const data = await fetchData(URL);
        pk.importDocument({ abbr: "rlob", lang: "rus" }, "usfm", data);
        const res = await pk.gqlQuerySync(`{
          documents {
              cvIndex(chapter:1) {
                 verses {
                    verse {
                       verseRange
                       text
                    }
                 }
              }
           }
        }`);

        const versesArray = res.data.documents[0].cvIndex.verses.map(
          (verse) => ({
            verseRange: verse.verse[0]?.verseRange || "",
            text: verse.verse[0]?.text || "",
          })
        );

        setVersesData(versesArray);

        console.log(versesArray);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    parseData();
  }, []);

  return (
    <div>
      {versesData.map((verse, index) => (
        <div key={index}>
          <strong>{verse.verseRange}</strong> {verse.text}
        </div>
      ))}
    </div>
  );
}

export default ChapterView;
