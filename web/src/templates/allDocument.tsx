import { graphql, PageProps } from 'gatsby'
import React from 'react'
import { FileEmpty } from '@styled-icons/icomoon/FileEmpty'
import { Search } from '@styled-icons/material/Search'
import { BlockColor } from '../components/block/color/color'
import BlockContent from '../components/block/content'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import { getFileIcon } from '../components/file/utils'
import Filter from '../components/filter/filter'
import Layout from '../components/layout/layout'
import NonIdealState from '../components/nonIdealState/nonIdealState'
import SEO from '../components/seo/seo'
import UiBox from '../components/ui/box/box'
import UiButton from '../components/ui/button/button'
import UiFile from '../components/ui/file/file'
import UiContainer from '../components/ui/container/container'
import UiDocumentOffset from '../components/ui/gallery/offset'
import UiInputText from '../components/ui/input/text'
import UiLayoutFilter from '../components/ui/layout/filter'
import UiSection from '../components/ui/section/section'
import UiIcon from '../components/ui/icon/icon'
import { RawHTML } from '../types'

type WordpressAllDocumentData = {
  wordpressPage: {
    title: string
    content: RawHTML
    blocks: TransformedBlock[]
  }
  allWordpressWpDocument: {
    edges: {
      node: {
        id: string
        title: string
        acf: {
          file: {
            filename: string
            url: {
              localFile: {
                publicURL: string
                extension: string
              }
            }
          }
        }
      }
    }[]
  }
}

export const query = graphql`
  query allDocumentQuery($id: String!) {
    wordpressPage(id: { eq: $id }) {
      title
      content
      blocks {
        blockId
        parentId
        type
        attrs
        content
      }
    }
    allWordpressWpDocument {
      edges {
        node {
          id
          acf {
            file {
              filename
              url {
                localFile {
                  publicURL
                  extension
                }
              }
            }
          }
          title
        }
      }
    }
  }
`

type AllDocumentProps = PageProps<WordpressAllDocumentData>

const AllDocument: React.FC<AllDocumentProps> = ({
  data: { wordpressPage, allWordpressWpDocument }
}) => {
  const [nameFilter, setNameFilter] = React.useState('')
  const parsedBlocks = React.useMemo(
    () => parseBlocks(wordpressPage.blocks || []),
    [wordpressPage.blocks]
  )

  const fileredDocuments = React.useMemo(() => {
    const docs = allWordpressWpDocument.edges.map(
      ({ node: document }) => document
    )

    return docs.filter((doc) => {
      if (
        nameFilter &&
        `${doc.title}||${doc.acf.file.filename}`
          .toLowerCase()
          .indexOf(nameFilter.toLowerCase()) === -1
      ) {
        return false
      }

      return true
    })
  }, [nameFilter, allWordpressWpDocument.edges])

  const filterApplied =
    allWordpressWpDocument.edges.length != fileredDocuments.length

  const resetFilter = () => {
    setNameFilter('')
  }

  const title = (
    <UiContainer>
      <h1>{wordpressPage.title}</h1>
    </UiContainer>
  )

  const documents = (
    <UiContainer>
      <UiDocumentOffset>
        <UiLayoutFilter>
          <UiLayoutFilter.Filter>
            <Filter title='Filtr'>
              <UiInputText
                placeholder='Název souboru'
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </Filter>
          </UiLayoutFilter.Filter>
          <UiLayoutFilter.Content>
            {fileredDocuments.length === 0 && (
              <NonIdealState
                icon={filterApplied ? Search : FileEmpty}
                title='Soubory nenalezeny'
                description='Žádné soubory nebyly nazeleny.'
              >
                {filterApplied && (
                  <UiButton
                    backgroundColor={BlockColor.PRIMARY}
                    textColor={BlockColor.WHITE}
                    onClick={resetFilter}
                  >
                    Vyčistit filtr
                  </UiButton>
                )}
              </NonIdealState>
            )}
            {fileredDocuments.map((document, idx) => {
              const { file } = document.acf

              return (
                <UiBox
                  key={document.id}
                  backgroundColor={BlockColor.WHITE}
                  offsetTop={idx !== 0}
                >
                  <UiFile>
                    <UiFile.Icon>
                      <UiIcon
                        icon={getFileIcon(file.url.localFile.extension)}
                        size={34}
                      />
                    </UiFile.Icon>
                    <UiFile.Name>{document.title || file.filename}</UiFile.Name>
                    <UiFile.Ext>.{file.url.localFile.extension}</UiFile.Ext>
                    <UiFile.Button>
                      <UiButton
                        as='a'
                        href={file.url.localFile.publicURL}
                        target='_blank'
                        backgroundColor={BlockColor.PRIMARY}
                        textColor={BlockColor.WHITE}
                      >
                        Stáhnout
                      </UiButton>
                    </UiFile.Button>
                  </UiFile>
                </UiBox>
              )
            })}
          </UiLayoutFilter.Content>
        </UiLayoutFilter>
      </UiDocumentOffset>
    </UiContainer>
  )

  return (
    <Layout>
      <SEO title={wordpressPage.title} />
      {parsedBlocks.length ? (
        <BlockContent blocks={parsedBlocks} title={title} footer={documents} />
      ) : (
        <UiSection>
          {title}
          <Content content={wordpressPage.content} />
          {documents}
        </UiSection>
      )}
    </Layout>
  )
}

export default AllDocument
