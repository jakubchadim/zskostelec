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
import UiEmployeeOffset from '../components/ui/gallery/offset'
import UiInputText from '../components/ui/input/text'
import UiLayoutFilter from '../components/ui/layout/filter'
import UiSection from '../components/ui/section/section'
import UiIcon from '../components/ui/icon/icon'
import { RawHTML } from '../types'
import { toggleItemInArray } from '../utils/array'

type WordpressAllEmployeeData = {
  wordpressPage: {
    title: string
    content: RawHTML
    blocks: TransformedBlock[]
  }
  allWordpressWpPositions: {
    edges: {
      node: {
        id: string
        name: string
        wordpress_id: string
      }
    }[]
  }
  allWordpressWpBuilding: {
    edges: {
      node: {
        id: string
        name: string
        wordpress_id: string
      }
    }[]
  }
  allWordpressWpEmployee: {
    edges: {
      node: {
        id: string
        title: string
        positions: string[]
        building: string[]
        acf: {
          email: string
          phone: string
        }
      }
    }[]
  }
}

export const query = graphql`
  query allEmployeeQuery($id: String!) {
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
    allWordpressWpPositions {
      edges {
        node {
          id
          name
          wordpress_id
        }
      }
    }
    allWordpressWpBuilding {
      edges {
        node {
          id
          name
          wordpress_id
        }
      }
    }
    allWordpressWpEmployee {
      edges {
        node {
          id
          positions
          building
          title
          acf {
            email
            phone
          }
        }
      }
    }
  }
`

type AllEmployeeProps = PageProps<WordpressAllEmployeeData>

const AllEmployee: React.FC<AllEmployeeProps> = ({
  data: {
    wordpressPage,
    allWordpressWpEmployee,
    allWordpressWpPositions,
    allWordpressWpBuilding
  }
}) => {
  const [nameFilter, setNameFilter] = React.useState('')
  const [positionFilter, setPositionFilter] = React.useState<string[]>([])
  const [buildingFilter, setBuildingFilter] = React.useState<string[]>([])
  const parsedBlocks = React.useMemo(
    () => parseBlocks(wordpressPage.blocks || []),
    [wordpressPage.blocks]
  )

  const fileredEmployees = React.useMemo(() => {
    const employees = allWordpressWpEmployee.edges.map(
      ({ node: employee }) => employee
    )

    return employees.filter((employee) => {
      if (
        nameFilter &&
        employee.title.toLowerCase().indexOf(nameFilter.toLowerCase()) === -1
      ) {
        return false
      }

      if (
        positionFilter.length &&
        !positionFilter.some((positionId) =>
          employee.positions.some((pid) => pid === positionId)
        )
      ) {
        return false
      }

      if (
        buildingFilter.length &&
        !buildingFilter.some((buildingId) =>
          employee.building.some((bid) => bid === buildingId)
        )
      ) {
        return false
      }

      return true
    })
  }, [nameFilter, positionFilter, buildingFilter, allWordpressWpEmployee.edges])

  const filterApplied =
    allWordpressWpEmployee.edges.length != fileredEmployees.length

  const resetFilter = () => {
    setNameFilter('')
  }

  const togglePosition = (wpId: string) => {
    setPositionFilter((positions) => toggleItemInArray(positions, wpId))
  }

  const toggleBuilding = (wpId: string) => {
    setBuildingFilter((buildings) => toggleItemInArray(buildings, wpId))
  }

  const title = (
    <UiContainer>
      <h1>{wordpressPage.title}</h1>
    </UiContainer>
  )

  const employees = (
    <UiContainer>
      <UiEmployeeOffset>
        <UiLayoutFilter>
          <UiLayoutFilter.Filter>
            <Filter title='Filtr'>
              <UiInputText
                placeholder='Název souboru'
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
              <h4>Pozice</h4>
              {allWordpressWpPositions.edges.map(({ node: position }) => (
                <div
                  key={position.id}
                  onClick={() => togglePosition(position.wordpress_id)}
                  style={{ marginTop: '1rem', cursor: 'pointer' }}
                >
                  {positionFilter.includes(position.wordpress_id) ? (
                    <b>{position.name}</b>
                  ) : (
                    position.name
                  )}
                </div>
              ))}
              <h4>Pracoviště</h4>
              {allWordpressWpBuilding.edges.map(({ node: building }) => (
                <div
                  key={building.id}
                  onClick={() => toggleBuilding(building.wordpress_id)}
                  style={{ marginTop: '1rem', cursor: 'pointer' }}
                >
                  {positionFilter.includes(building.wordpress_id) ? (
                    <b>{building.name}</b>
                  ) : (
                    building.name
                  )}
                </div>
              ))}
            </Filter>
          </UiLayoutFilter.Filter>
          <UiLayoutFilter.Content>
            {fileredEmployees.length === 0 && (
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
            {fileredEmployees.map((employee, idx) => {
              const { file } = employee.acf

              return (
                <UiBox
                  key={employee.id}
                  backgroundColor={BlockColor.WHITE}
                  offsetTop={idx !== 0}
                >
                  {employee.title}
                </UiBox>
              )
            })}
          </UiLayoutFilter.Content>
        </UiLayoutFilter>
      </UiEmployeeOffset>
    </UiContainer>
  )

  return (
    <Layout>
      <SEO title={wordpressPage.title} />
      {parsedBlocks.length ? (
        <BlockContent blocks={parsedBlocks} title={title} footer={employees} />
      ) : (
        <UiSection>
          {title}
          <Content content={wordpressPage.content} />
          {employees}
        </UiSection>
      )}
    </Layout>
  )
}

export default AllEmployee
