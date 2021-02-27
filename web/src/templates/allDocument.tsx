import { graphql, PageProps } from 'gatsby'
import React from 'react'
import { FileEmpty } from '@styled-icons/icomoon/FileEmpty'
import { Search } from '@styled-icons/material/Search'
import { BlockColor } from '../components/block/color/color'
import BlockContent from '../components/block/content'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import FilterChooser from '../components/filter/chooser'
import UiContent from '../components/ui/content/content'
import Layout from '../components/layout/layout'
import NonIdealState from '../components/nonIdealState/nonIdealState'
import SEO from '../components/seo/seo'
import UiBox from '../components/ui/box/box'
import UiButton from '../components/ui/button/button'
import UiContainer from '../components/ui/container/container'
import UiSectionOffset from '../components/ui/section/offset'
import UiInputText from '../components/ui/input/text'
import UiLayoutFilter from '../components/ui/layout/filter'
import UiSection from '../components/ui/section/section'
import Filter, { UiFilterTitle } from '../components/filter/filter'
import File from '../components/file/file'
import { RawHTML } from '../types'

type WordpressAllDocumentData = {
  wordpressPage: {
    title: string
    content: RawHTML
    blocks: TransformedBlock[]
  }
  allWordpressWpDocumentCategories: {
    edges: {
      node: {
        id: string
        name: string
        wordpress_id: string
      }
    }[]
  }
  allWordpressWpDocument: {
    edges: {
      node: {
        id: string
        title: string
        documentCategories: string[]
        acf: {
          file: {
            filename: string
            url: {
              source_url: string
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
    allWordpressWpDocumentCategories {
      edges {
        node {
          id
          name
          wordpress_id
        }
      }
    }
    allWordpressWpDocument {
      edges {
        node {
          id
          documentCategories
          title
          acf {
            file {
              filename
              url {
                source_url
              }
            }
          }
        }
      }
    }
  }
`

type AllDocumentProps = PageProps<WordpressAllDocumentData>

const AllDocument: React.FC<AllDocumentProps> = ({
  data: {
    wordpressPage,
    allWordpressWpDocument,
    allWordpressWpDocumentCategories
  }
}) => {
  const [nameFilter, setNameFilter] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>([])
  const parsedBlocks = React.useMemo(
    () => parseBlocks(wordpressPage.blocks || []),
    [wordpressPage.blocks]
  )
  const categories = allWordpressWpDocumentCategories.edges.map(({ node }) => {
    return {
      id: node.wordpress_id,
      name: node.name
    }
  })

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

      if (
        categoryFilter.length &&
        !categoryFilter.some((categoryId) =>
          doc.documentCategories.some((dcid) => dcid === categoryId)
        )
      ) {
        return false
      }

      return true
    })
  }, [nameFilter, categoryFilter, allWordpressWpDocument.edges])

  const filterApplied =
    allWordpressWpDocument.edges.length != fileredDocuments.length

  const resetFilter = () => {
    setNameFilter('')
    setCategoryFilter([])
  }

  const title = (
    <UiContainer>
      <h1 className='top'>{wordpressPage.title}</h1>
    </UiContainer>
  )

  const documents = (
    <UiContainer>
      <UiSectionOffset>
        <UiLayoutFilter>
          <UiLayoutFilter.Filter>
            <Filter>
              <UiContent largeGutter>
                <UiFilterTitle>NÁZEV SOUBORU</UiFilterTitle>
                <UiInputText
                  placeholder='Název souboru'
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </UiContent>
              <UiFilterTitle>KATEGORIE</UiFilterTitle>
              <FilterChooser
                items={categories}
                value={categoryFilter}
                onChange={setCategoryFilter}
                renderLabel={(category) => category.name}
              />
            </Filter>
          </UiLayoutFilter.Filter>
          <UiLayoutFilter.Content>
            {fileredDocuments.length === 0 && (
              <NonIdealState
                icon={filterApplied ? Search : FileEmpty}
                title='Dokumenty nenalezeny'
                description='Hledané dokumenty nebyly nazeleny.'
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
                  revealAnimation
                  title={file.filename}
                >
                  <File
                    name={document.title || file.filename}
                    href={file.url.source_url}
                  />
                </UiBox>
              )
            })}
          </UiLayoutFilter.Content>
        </UiLayoutFilter>
      </UiSectionOffset>
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
