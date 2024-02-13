import { useEffect, useState } from 'react'
import { Proskomma } from 'proskomma-core'
import axios from 'axios'
import { SofriaRenderFromProskomma, render } from 'proskomma-json-tools'

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

  useEffect(() => {
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
        const output = {}
        cl.renderDocument({ docId, config, output })
        console.log(output)
        setVersesData(output)
      } catch (err) {
        console.log(err)
      }
    }

    testSofria()
  }, [pk, chapterNumber])
  return (
    <div>
      <div className="paras_default">ТЕСТ</div>
      <div className="mx-4" dangerouslySetInnerHTML={{ __html: versesData.paras }} />
    </div>
  )
}

export default ChapterSofriaView
