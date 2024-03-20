import { Proskomma } from 'proskomma-core'

export const versification = async () => {
  const mappedCvsTest2 = async (usfmContent, usxContent, rscContent, webbeContent) => {
    try {
      const chapters = ['23']
      const pk = new Proskomma()

      pk.importDocument({ lang: 'rus', abbr: 'rsb' }, 'usfm', usfmContent)
      pk.importDocument({ lang: 'eng', abbr: 'webbe' }, 'usx', usxContent)

      let mutationQuery = `mutation { setVerseMapping(docSetId: "rus_rsb" vrsSource: """${rscContent}""")}`
      await pk.gqlQuery(mutationQuery)

      mutationQuery = `mutation { setVerseMapping(docSetId: "eng_webbe" vrsSource: """${webbeContent}""")}`
      await pk.gqlQuery(mutationQuery)

      for (const chapterN of chapters) {
        let docSetQuery = `{ 
          docSet(id: "rus_rsb") {
            id
            documents {
              bookCode: header(id: "bookCode")    
              mappedCvs(chapter: "${chapterN}", mappedDocSetId: "eng_webbe") {
                scopeLabels
                text
              }
            }
          }
        }`
        let result = await pk.gqlQuery(docSetQuery)

        docSetQuery = `{ 
          docSet(id: "eng_webbe") {
            id
            documents {
              bookCode: header(id: "bookCode")    
              mappedCvs(chapter: "${chapterN}", mappedDocSetId: "rus_rsb") {
                scopeLabels
                text
              }
            }
          }
        }`
        result = await pk.gqlQuery(docSetQuery)
        console.log(JSON.stringify(result, null, 2))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const loadFilesAndExecute = async () => {
    try {
      const usfmResponse = await fetch('/data/19-psa_rsb.usfm')
      const usfmContent = await usfmResponse.text()

      const usxResponse = await fetch('/data/web_psa.usx')
      const usxContent = await usxResponse.text()

      const rscResponse = await fetch('/data/rsc.vrs')
      const rscContent = await rscResponse.text()

      const webbeResponse = await fetch('/data/webbe.vrs')
      const webbeContent = await webbeResponse.text()

      await mappedCvsTest2(usfmContent, usxContent, rscContent, webbeContent)
    } catch (error) {
      console.error('Error loading files and executing function:', error)
    }
  }

  await loadFilesAndExecute()
}
