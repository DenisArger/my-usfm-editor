import { useEffect, useState } from "react";
import { Proskomma } from "proskomma-core";
import axios from "axios";

function ChapterView({ url, chapterNumber }) {
  const [versesData, setVersesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pk = new Proskomma();
        const data = await axios.get(url).then((response) => response.data);
        pk.importDocument({ abbr: "rlob", lang: "rus" }, "usfm", data);

        const res = await pk.gqlQuerySync(`{
          documents {
              cvIndex(chapter:${chapterNumber}) {
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

    fetchData();
  }, [url, chapterNumber]);

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
