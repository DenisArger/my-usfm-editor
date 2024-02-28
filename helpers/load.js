import { Proskomma } from 'proskomma-core'

export const pkWithDocs = async (contentSpecs) => {
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
      pk.importDocument(selectors, contentType, content, {})
    } catch (error) {
      console.error(`Error fetching or importing document: ${error.message}`)
    }
  }

  return pk
}

export const pkWithDoc = async (
  fp,
  selectors,
  options,
  customTags,
  emptyBlocks,
  tags
) => {
  if (!options) {
    options = {}
  }

  const fetchContent = async (filePath) => {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }
    return response.text()
  }

  try {
    const content = await fetchContent(fp)
    let contentType = fp.split('.').pop()

    const pk = new Proskomma()
    pk.importDocument(
      selectors,
      contentType,
      content,
      options,
      customTags,
      emptyBlocks,
      tags
    )
    console.log(pk)
    return pk
  } catch (error) {
    console.error(`Error fetching or importing document: ${error.message}`)
    throw error // Rethrow the error to be caught by the calling code if needed
  }
}
