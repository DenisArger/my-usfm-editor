import { useEffect, useState } from 'react'
import ChapterView from './components/ChapterView'
import ChapterViewLocal from './components/ChapterViewLocal'
import { versefication } from '../helpers/versification'

function App() {
  const [chapterNumber, setChapterNumber] = useState(2)

  const handleNextChapter = () => {
    setChapterNumber((prevChapterNumber) => prevChapterNumber + 1)
  }

  const handlePrevChapter = () => {
    if (chapterNumber > 1) {
      setChapterNumber((prevChapterNumber) => prevChapterNumber - 1)
    }
  }

  // const pathName = '../data/01-GEN.usfm'
  const pathName = '../data/web_psa.usx'

  const url0 =
    'https://git.door43.org/STR/ru_rsb/raw/bfb6f3be9e4c9d69c2300b8ceb2e8aaca714111c/01-GEN.usfm'

  const url1 =
    'https://git.door43.org/ru_gl/ru_rlob/raw/078d6c572bacf26d628b6bc563950f4167535af3/01-GEN.usfm'

  const url2 =
    'https://git.door43.org/ru_gl/ru_rsob/raw/5aafe5f1e534b6b3d6f1cba3eaedc83cb54c425b/01-GEN.usfm'

  useEffect(() => {
    const performVersefication = async () => {
      // Вызываем versefication и дожидаемся выполнения
      const mappedCvsTestFunction = await versefication()

      // Вызываем mappedCvsTestFunction
      try {
        await mappedCvsTestFunction()
      } catch (err) {
        console.log(err)
      }
    }

    performVersefication()
  }, []) // [] чтобы выполнить useEffect только после монтирования компонента

  return (
    <div className="m-5">
      <div className="flex justify-between mb-4">
        <button className="bg-slate-400 rounded-md p-2" onClick={handlePrevChapter}>
          Previous Chapter
        </button>
        <span className="bg-blue-400 rounded-md p-2"> Chapter {chapterNumber} </span>
        <button className="bg-slate-400 rounded-md p-2" onClick={handleNextChapter}>
          Next Chapter
        </button>
      </div>
      <div className="flex space-x-5">
        <div className="max-w-md bg-white border border-gray-300 rounded-md overflow-hidden shadow-md">
          <ChapterViewLocal pathName={pathName} chapterNumber={chapterNumber} />
        </div>
        {/* <div className="max-w-md bg-white border border-gray-300 rounded-md overflow-hidden shadow-md">
          <ChapterView url={url1} chapterNumber={chapterNumber} />
        </div>
        <div className="max-w-md bg-white border border-gray-300 rounded-md overflow-hidden shadow-md">
          <ChapterView url={url2} chapterNumber={chapterNumber} />
        </div> */}
      </div>
    </div>
  )
}

export default App
