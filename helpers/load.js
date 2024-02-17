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
      await pk.importDocument(selectors, contentType, content, {})
    } catch (error) {
      console.error(`Error fetching or importing document: ${error.message}`)
    }
  }

  return pk
}
