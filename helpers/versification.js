import deepCopy from 'deep-copy-all'
import { pkWithDocs } from './load'

export const versification = async () => {
  const cleanPk2 = await pkWithDocs([
    [
      '../data/19-PSA_asv.usx',
      {
        lang: 'eng',
        abbr: 'asv',
      },
    ],
    [
      '../data/19-PSA_rsb.usfm',
      {
        lang: 'rus',
        abbr: 'rsb',
      },
    ],
  ])

  const addPk2Vrs = async () => {
    try {
      let vrs = await fetch('../data/eng.vrs').then((response) => response.text())
      let mutationQuery = `mutation { setVerseMapping(docSetId: "eng_asv" vrsSource: """${vrs}""")}`
      await cleanPk2.gqlQuery(mutationQuery)

      vrs = await fetch('../data/rsc.vrs').then((response) => response.text())
      mutationQuery = `mutation { setVerseMapping(docSetId: "rus_rsb" vrsSource: """${vrs}""")}`
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

      const chapterNumber = 22

      // let docSetQuery = `{ docSet(id: "eng_webbe")
      //     { documents
      //       { mappedCvs(chapter: "${chapterNumber}", mappedDocSetId: "rus_rsb")
      //         {
      //           scopeLabels
      //           text
      //         }
      //       }
      //     }
      //   }`

      let docSetQuery = `{ docSet(id: "eng_asv"){
           documents {
            mappedCvs(chapter: "${chapterNumber}", mappedDocSetId: "rus_rsb"){ 
              scopeLabels
              text 
            }
          }
        }
      }`

      // let query = `{docSet(id: "eng_webbe") {
      //     documents {
      //       cvIndex(chapter:${chapterNumber}) {
      //         verses {
      //           verse {
      //             verseRange
      //             text
      //           }
      //         }
      //       }
      //     }
      //   }}`

      let result = await pk.gqlQuery(docSetQuery)
      console.log(result, 51)

      const mappedCVs = result.data.docSet.documents[0].mappedCvs[0][0]
      console.log(mappedCVs, 54)
    } catch (err) {
      console.log(err, 81)
    }
  }

  return mappedCvsTest
}
