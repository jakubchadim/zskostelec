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
import Filter from '../components/filter/filter'
import Layout from '../components/layout/layout'
import NonIdealState from '../components/nonIdealState/nonIdealState'
import SEO from '../components/seo/seo'
import UiBox from '../components/ui/box/box'
import UiButton from '../components/ui/button/button'
import UiContainer from '../components/ui/container/container'
import UiContent from '../components/ui/content/content'
import UiEmployeeOffset from '../components/ui/gallery/offset'
import UiInputText from '../components/ui/input/text'
import UiLayoutFilter from '../components/ui/layout/filter'
import UiSection from '../components/ui/section/section'
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

  const positions = allWordpressWpPositions.edges.map(({ node }) => {
    return {
      id: node.wordpress_id,
      name: node.name
    }
  })

  const buildings = allWordpressWpBuilding.edges.map(({ node }) => {
    return {
      id: node.wordpress_id,
      name: node.name
    }
  })

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
            <Filter>
              <UiContent largeGutter>
                <h5>JMÉNO</h5>
                <UiInputText
                  placeholder='např. Němec'
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </UiContent>
              <UiContent largeGutter>
                <h5>POZICE</h5>
                <FilterChooser
                  items={positions}
                  value={positionFilter}
                  onChange={setPositionFilter}
                  renderLabel={(category) => category.name}
                />
              </UiContent>
              <h5>PRACOVIŠTĚ</h5>
              <FilterChooser
                items={buildings}
                value={buildingFilter}
                onChange={setBuildingFilter}
                renderLabel={(category) => category.name}
              />
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
