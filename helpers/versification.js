import { Proskomma } from 'proskomma-core'
import deepCopy from 'deep-copy-all'

export const versefication = async () => {
  const pkWithDocs = async (contentSpecs) => {
    const pk = new Proskomma()

    const fetchContent = async (fp) => {
      const response = await fetch(fp)
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`)
      }
      return response.text()
    }

    for (const [fp, selectors] of contentSpecs) {
      try {
        const content = await fetchContent(fp)
        let contentType = fp.split('.').pop()
        await pk.importDocument(selectors, contentType, content, {})
      } catch (error) {
        console.error(`Error fetching or importing document: ${error.message}`)
      }
    }

    return pk
  }

  const cleanPk2 = await pkWithDocs([
    [
      '../data/web_psa.usx',
      {
        lang: 'eng',
        abbr: 'webbe',
      },
    ],
    [
      '../data/douay_rheims_psa.usx',
      {
        lang: 'eng',
        abbr: 'drh',
      },
    ],
  ])

  const addPk2Vrs = async () => {
    try {
      let vrs = await fetch('../data/webbe.vrs').then((response) => response.text())
      let mutationQuery = `mutation { setVerseMapping(docSetId: "eng_webbe" vrsSource: """${vrs}""")}`
      await cleanPk2.gqlQuery(mutationQuery)

      vrs = await fetch('../data/douay_rheims.vrs').then((response) => response.text())
      mutationQuery = `mutation { setVerseMapping(docSetId: "eng_drh" vrsSource: """${vrs}""")}`
      await cleanPk2.gqlQuery(mutationQuery)
    } catch (err) {
      console.log(err)
    }
  }

  try {
    await Promise.all([addPk2Vrs()])
  } catch (err) {
    console.log(err)
  }

  const mappedCvsTest = async () => {
    try {
      const pk = deepCopy(cleanPk2)

      let docSetQuery =
        '{ docSet(id: "eng_webbe") { documents { mappedCvs(chapter: "22", mappedDocSetId: "eng_drh") { scopeLabels text } } } }'

      let result = await pk.gqlQuery(docSetQuery)
      console.log(result, 72)

      const mappedCVs = result.data.docSet.documents[0].mappedCvs[0][0]
      console.log(mappedCVs, 72)
    } catch (err) {
      console.log(err, 81)
    }
  }

  return mappedCvsTest
}
