import { useEffect, useState } from 'react'
import { Proskomma } from 'proskomma-core'
import axios from 'axios'
import { SofriaRenderFromProskomma, render } from 'proskomma-json-tools'
import cheerio from 'cheerio'

function ChapterSofriaView({ url, chapterNumber }) {
  const [versesData, setVersesData] = useState([])
  const [pk, setPk] = useState(new Proskomma())
  const [header, setHeader] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newPk = new Proskomma()
        const data = await axios.get(url).then((response) => response.data)
        newPk.importDocument({ abbr: 'rlob', lang: 'rus' }, 'usfm', data)
        setPk(newPk)
      } catch (error) {
        console.error('An error occurred while importing document:', error)
      }
    }

    fetchData()
  }, [url])

  const parseUsfmText = (usfmText) => {
    const $ = cheerio.load(usfmText)
    const verses = []

    // Ищем все элементы с классом "paras_usfm_p"
    $('.paras_usfm_p').each((index, element) => {
      const verseNumber = $(element).find('.marks_verses_label').text().trim()
      const verseText = $(element).text().replace(/\s+/g, ' ').trim() // Заменяем множественные пробелы на один

      verses.push({
        number: verseNumber,
        text: verseText,
      })
    })

    return verses
  }

  useEffect(() => {
    const output = {}
    const config = {
      showWordAtts: false,
      showTitles: true,
      showHeadings: true,
      showIntroductions: true,
      showFootnotes: true,
      showXrefs: true,
      showParaStyles: true,
      showCharacterMarkup: true,
      showChapterLabels: true,
      showVersesLabels: true,
      selectedBcvNotes: [],
      chapters: [`${chapterNumber}`],
      bcvNotesCallback: (bcv) => {
        setBcvNoteRef(bcv)
      },
      renderers: render.sofria2web.sofria2html.renderers,
    }

    const testSofria = async () => {
      try {
        const docId = pk.gqlQuerySync('{documents { id } }').data.documents[0].id
        const actions = render.sofria2web.renderActions.sofria2WebActions
        const cl = new SofriaRenderFromProskomma({
          proskomma: pk,
          actions,
        })
        // const output = {}
        cl.renderDocument({ docId, config, output })
        // console.log(output)
        setVersesData(output)
        const parsedVerses = parseUsfmText(output.paras)
        parsedVerses.forEach((verse) => {
          console.log(`${verse.text}`)
        })
      } catch (err) {
        console.log(err)
      }
    }

    testSofria()
  }, [pk, chapterNumber])
  return (
    <div>
      <div className="mx-4" dangerouslySetInnerHTML={{ __html: versesData.paras }} />
    </div>
  )
}

export default ChapterSofriaView
