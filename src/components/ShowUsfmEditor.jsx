// import { usfmText } from "./data/Acts.1.usfm";
import { usfmText } from '../../data/1pe.en.ult.usfm'

// import { usfmText } from "./data/3JN.usfm";

import React from 'react'

import UsfmEditor from './UsfmEditor' // Adjust the path accordingly
function ShowUsfmEditor() {
  const onSave = (bookCode, usfm) => {
    console.log('save button clicked')
    console.log(bookCode)
    console.log(usfm)
  }

  const onReferenceSelected = (reference) => console.log(reference)

  const editorProps = {
    onSave,
    usfmText,
    onReferenceSelected,
    reference: {
      syncSrcId: '1',
      bookId: 'apg',
      chapter: 2,
      verse: '1',
    },
  }

  const displayFont = 'sans-serif'
  const displayFontSize = 'medium'
  const displayLineHeight = '1.4'

  return (
    <div
      key="2"
      style={{
        fontFamily: displayFont,
        fontSize: displayFontSize,
        lineHeight: displayLineHeight,
      }}
    >
      <UsfmEditor {...editorProps} />
    </div>
  )
}

export default ShowUsfmEditor
