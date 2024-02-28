import deepCopy from 'deep-copy-all'
import { pkWithDoc, pkWithDocs } from './load'

export const versification = async () => {
  const cleanPk = await pkWithDoc('../data/19-PSA_rsb.usfm', {
    lang: 'rus',
    abbr: 'rsb',
  })

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

      // let vrs = await fetch('../data/rsc.vrs').then((response) => response.text())
      // let mutationQuery = `mutation { setVerseMapping(docSetId: "rus_rsb" vrsSource: """${vrs}""")}`
      // await cleanPk2.gqlQuery(mutationQuery)

      // vrs = await fetch('../data/eng.vrs').then((response) => response.text())
      // mutationQuery = `mutation { setVerseMapping(docSetId: "eng_asv" vrsSource: """${vrs}""")}`
      // await cleanPk2.gqlQuery(mutationQuery)
    } catch (err) {
      console.log(err)
    }
  }

  try {
    await Promise.all([addPk2Vrs()])
  } catch (err) {
    console.log(err)
  }

  const mappedCvsTest0 = async () => {
    try {
      const chapterNumber = 22

      const pk = deepCopy(cleanPk)

      // let query = `{docSet(id: "eng_asv") {
      //   documents {
      //     cvIndex(chapter:${chapterNumber}) {
      //       verses {
      //         verse {
      //           verseRange
      //           text
      //         }
      //       }
      //     }
      //   }
      // }}`

      // let result0 = await pk.gqlQuery(query)
      // console.log(
      //   // result0,
      //   result0.data.docSet.documents[0].cvIndex.verses[1].verse[0].text,
      //   150
      // )

      let docSetQuery = '{ docSets { id hasMapping } }'
      let result = await pk.gqlQuery(docSetQuery)
      // console.log(result, 73)

      const docSetId = result.data.docSets[0].id
      // console.log(result, 76)

      let vrs = await fetch('../data/rsc.vrs').then((response) => response.text())
      // console.log(vrs, 79)
      let mutationQuery = `mutation { setVerseMapping(docSetId: "${docSetId}" vrsSource: """${vrs}""")}`
      result = await pk.gqlQuery(mutationQuery)

      let docSetQuery1 = `{ docSet(id: "rus_rsb")
          { documents
            { mappedCvs(chapter: "${chapterNumber}", mappedDocSetId: "rus_rsb")
              {
                scopeLabels
                text
              }
            }
          }
        }`
      result = await pk.gqlQuery(docSetQuery1)

      console.log(result, 80)

      // let docSetQuery1 = `{ docSets {
      //   id hasMapping documents {
      //     cvIndex(chapter:${chapterNumber}) {
      //               verses {
      //                 verse {
      //                   verseRange
      //                   text
      //                 }
      //               }
      //             }
      //      }
      //    }
      // }`
      // result = await pk.gqlQuery(docSetQuery1)
      // console.log(result, 102)

      // console.log(
      //   result.data.docSets[0].documents[0].cvIndex.verses[1].verse[0].verseRange,
      //   result.data.docSets[0].documents[0].cvIndex.verses[1].verse[0].text,
      //   162
      // )

      // let docSetQuery2 = `{ docSet(id: "eng_asv") {
      //    documents {
      //     asv: cv(chapter: "23" verses: ["1"]) {
      //        text
      //       }
      //     rsb: mappedCv(chapter: "23" verses: ["1"],
      //       mappedDocSetId: "rus_rsb") {
      //         text
      //       }
      //      }

      //     }
      //    }`

      // result = await pk.gqlQuery(docSetQuery2)
      // console.log(result, 124)

      docSetQuery = `{ docSets {
         id hasMapping documents {
           cvIndex(chapter: 22) {
             chapter verseNumbers {
               number orig {
                 book cvs {
                   chapter 
                   verse
                  }
                }
              }
              verses {
                verse  {
                  text 
                }
              }
            }

          }

        }
       }`
      result = await pk.gqlQuery(docSetQuery)
      console.log(result)
      //   // t.equal(result.errors, undefined)
      //   // t.equal(result.data.docSets[0].hasMapping, true)
      //   let v0 = result.data.docSets[0].documents[0].cvIndex.verseNumbers[0]
      //   // console.log(v0.orig.cvs[0].verse, 147)
      //   // t.equal(v0.number, 0)
      //   // t.equal(v0.orig.cvs.length, 2)
      //   // t.equal(v0.orig.cvs[0].verse, 1)
      //   // t.equal(v0.orig.cvs[1].verse, 2)
      //   mutationQuery = `mutation { unsetVerseMapping(docSetId: "${docSetId}")}`
      //   result = await pk.gqlQuery(mutationQuery)
      //   // t.equal(result.errors, undefined)
      //   // result = await pk.gqlQuery(docSetQuery)
      //   // t.equal(result.errors, undefined)
      //   v0 = result.data.docSets[0].documents[0].cvIndex.verseNumbers[0]
      //   // t.equal(result.data.docSets[0].hasMapping, false)
      //   // t.equal(v0.number, 0)
      //   // t.equal(v0.orig.cvs.length, 1)
      //   // t.equal(v0.orig.cvs[0].verse, 0)
    } catch (err) {
      console.log(err)
    }
  }

  const mappedCvsTest = async () => {
    try {
      const pk = deepCopy(cleanPk2)

      const chapterNumber = 23

      // let docSetQueryId = `{ documents {
      //             docSetId
      //             }
      //         }`

      // let result1 = await pk.gqlQuery(docSetQueryId)

      // console.log(result1, 200)

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
      let result = await pk.gqlQuery(docSetQuery)

      // console.log(result, 209)

      // let docSetQuery = `{
      //   docSets {
      //     documents {
      //       mappedCvs(chapter: "22", mappedDocSetId: "rus_rsb") {
      //         text
      //     }
      //   }
      //   }
      // }`

      // let result = await pk.gqlQuery(docSetQuery)

      console.log(result, 209)

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

      // let result = await pk.gqlQuery(docSetQuery)
      // console.log(result, 51)

      const mappedCVs = result.data.docSet.documents[0].mappedCvs[0][0]
      console.log(mappedCVs, 54)
    } catch (err) {
      console.log(err, 81)
    }
  }

  return mappedCvsTest
}
