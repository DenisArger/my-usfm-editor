import React from 'react'
// import { usfmText } from "./data/Acts.1.usfm";
import { usfmText } from '../../data/1pe.en.ult.usfm'

import BookPreview from './BookPreview' // Adjust the path accordingly

function ShowBookPreview() {
  const renderFlags = {
    showTitles: true,
    showChapterLabels: true,
    showVersesLabels: true,
  }

  const previewProps = {
    usfmText,
    renderFlags,
    verbose: true,
  }

  return (
    <div key="2">
      <BookPreview {...previewProps} />
    </div>
  )
}

export default ShowBookPreview
