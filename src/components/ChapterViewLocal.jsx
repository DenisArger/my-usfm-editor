import { useEffect, useState } from 'react'
import { Proskomma } from 'proskomma-core'

function ChapterViewLocal({ pathName, chapterNumber }) {
  const [versesData, setVersesData] = useState([])
  const [pk, setPk] = useState(new Proskomma())
  const [chapterCache, setChapterCache] = useState({})
  const [header, setHeader] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newPk = new Proskomma()

        const response = await fetch(pathName) // асинхронно получаем файл по пути
        const data = await response.text() // получаем текст из ответа

        newPk.importDocument({ abbr: 'rlob', lang: 'rus' }, 'usfm', data)
        setPk(newPk)
      } catch (error) {
        console.error('An error occurred while importing document:', error)
      }
    }

    fetchData()
  }, [pathName])

  useEffect(() => {
    const fetchVerses = async () => {
      try {
        if (chapterCache[chapterNumber]) {
          // Если глава уже есть в кеше, используем ее данные
          setVersesData(chapterCache[chapterNumber])
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
          }`)
          console.log(res, 48)
          if (res?.data?.documents[0]?.cvIndex) {
            const versesArray = res.data.documents[0].cvIndex.verses.map((verse) => ({
              verseRange: verse.verse[0]?.verseRange || '',
              text: verse.verse[0]?.text || '',
            }))

            // Кешируем данные главы
            setChapterCache({
              ...chapterCache,
              [chapterNumber]: versesArray,
            })

            setVersesData(versesArray)
          }
        }
      } catch (error) {
        console.error('An error occurred while fetching verses:', error)
      }
    }

    fetchVerses()
  }, [pk, chapterNumber, chapterCache])

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        if (chapterCache[chapterNumber]) {
          // Если глава уже есть в кеше, используем ее данные
          setHeader(chapterCache[chapterNumber])
        } else {
          const headers = await pk.gqlQuerySync(`{
            documents {
              header: header(id:"h"),
              toc: header(id:"toc"),
            }
          }`)

          if (headers?.data?.documents[0]) {
            setHeader(headers.data.documents[0].toc)
          }
        }
      } catch (error) {
        console.error('An error occurred while fetching headers:', error)
      }
    }

    fetchHeaders()
  }, [pk, chapterNumber, chapterCache])

  return (
    <div>
      <h1>{header && header.title}</h1>
      {versesData?.map((verse, index) => (
        <div key={index}>
          <strong>{verse.verseRange}</strong> {verse.text}
        </div>
      ))}
    </div>
  )
}

export default ChapterViewLocal
