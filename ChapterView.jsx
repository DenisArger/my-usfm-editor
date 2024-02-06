import { useEffect, useState } from "react";
import { Proskomma } from "proskomma-core";
import axios from "axios";

function ChapterView({ url, chapterNumber }) {
  const [versesData, setVersesData] = useState([]);
  const [pk, setPk] = useState(new Proskomma());
  const [chapterCache, setChapterCache] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newPk = new Proskomma();
        const data = await axios.get(url).then((response) => response.data);
        newPk.importDocument({ abbr: "rlob", lang: "rus" }, "usfm", data);
        setPk(newPk);
      } catch (error) {
        console.error("An error occurred while importing document:", error);
      }
    };

    fetchData();
  }, [url]);

  useEffect(() => {
    const fetchVerses = async () => {
      try {
        if (chapterCache[chapterNumber]) {
          // Если глава уже есть в кеше, используем ее данные
          setVersesData(chapterCache[chapterNumber]);
        } else {
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

          // Кешируем данные главы
          setChapterCache({
            ...chapterCache,
            [chapterNumber]: versesArray,
          });

          setVersesData(versesArray);
          console.log(versesArray);
        }
      } catch (error) {
        console.error("An error occurred while fetching verses:", error);
      }
    };

    fetchVerses();
  }, [pk, chapterNumber, chapterCache]);

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
