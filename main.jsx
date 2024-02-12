import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import ChapterView from "./ChapterView";
import ChapterSofriaView from "./ChapterSofriaView";
import "./styles.css";

const App = () => {
  const [chapterNumber, setChapterNumber] = useState(2);

  const handleNextChapter = () => {
    setChapterNumber((prevChapterNumber) => prevChapterNumber + 1);
  };

  const handlePrevChapter = () => {
    if (chapterNumber > 1) {
      setChapterNumber((prevChapterNumber) => prevChapterNumber - 1);
    }
  };

  const url =
    "https://git.door43.org/ru_gl/ru_rlob/raw/078d6c572bacf26d628b6bc563950f4167535af3/01-GEN.usfm";

  return (
    <React.StrictMode>
      <div>
        <button onClick={handlePrevChapter}>Previous Chapter</button>
        <span> Chapter {chapterNumber} </span>
        <button onClick={handleNextChapter}>Next Chapter</button>
      </div>
      {/* <ChapterView url={url} chapterNumber={chapterNumber} /> */}
      <ChapterSofriaView url={url} chapterNumber={chapterNumber} />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
