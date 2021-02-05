import { graphql, PageProps } from 'gatsby'
import React from 'react'
import { FileEmpty } from '@styled-icons/icomoon/FileEmpty'
import { Search } from '@styled-icons/material/Search'
import { BlockColor } from '../components/block/color/color'
import BlockContent from '../components/block/content'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import Employee from '../components/employee/employee'
import FilterChooser from '../components/filter/chooser'
import Filter from '../components/filter/filter'
import Layout from '../components/layout/layout'
import NonIdealState from '../components/nonIdealState/nonIdealState'
import SEO from '../components/seo/seo'
import UiButton from '../components/ui/button/button'
import UiContainer from '../components/ui/container/container'
import UiSectionOffset from '../components/ui/section/offset'
import UiGrid from '../components/ui/grid/grid'
import UiInputText from '../components/ui/input/text'
import UiLayoutFilter from '../components/ui/layout/filter'
import UiSection from '../components/ui/section/section'
import { RawHTML } from '../types'
import { getDictionaryTranslator } from '../utils/translate'

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
          photo?: {
            source_url: string
            media_details?: {
              sizes?: {
                medium: {
                  source_url: string
                }
              }
            }
          }
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
    allWordpressWpEmployee(sort: { fields: [acf___priority, title] }) {
      edges {
        node {
          id
          positions
          building
          title
          acf {
            email
            phone
            photo {
              id
              source_url
              media_details {
                sizes {
                  medium {
                    source_url
                  }
                }
              }
            }
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

  const positions = React.useMemo(() => {
    return allWordpressWpPositions.edges.map(({ node }) => {
      return {
        id: node.wordpress_id,
        name: node.name
      }
    })
  }, [allWordpressWpPositions])
  const translatePosition = React.useMemo(() => {
    return getDictionaryTranslator(positions)
  }, [positions])

  const buildings = React.useMemo(() => {
    return allWordpressWpBuilding.edges.map(({ node }) => {
      return {
        id: node.wordpress_id,
        name: node.name
      }
    })
  }, [allWordpressWpBuilding])
  const translateBuilding = React.useMemo(() => {
    return getDictionaryTranslator(buildings)
  }, [buildings])

  const resetFilter = () => {
    setNameFilter('')
    setPositionFilter([])
    setBuildingFilter([])
  }

  const title = (
    <UiContainer>
      <h1>{wordpressPage.title}</h1>
    </UiContainer>
  )

  const employees = (
    <UiContainer>
      <UiSectionOffset>
        <UiLayoutFilter>
          <UiLayoutFilter.Filter>
            <Filter>
              <UiGrid>
                <UiGrid.Item md={12} sm={4}>
                  <h5>JMÉNO</h5>
                  <UiInputText
                    placeholder='např. Němec'
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                  />
                </UiGrid.Item>
                <UiGrid.Item md={12} sm={4}>
                  <h5>POZICE</h5>
                  <FilterChooser
                    items={positions}
                    value={positionFilter}
                    onChange={setPositionFilter}
                    renderLabel={(category) => category.name}
                  />
                </UiGrid.Item>
                <UiGrid.Item md={12} sm={4}>
                  <h5>PRACOVIŠTĚ</h5>
                  <FilterChooser
                    items={buildings}
                    value={buildingFilter}
                    onChange={setBuildingFilter}
                    renderLabel={(category) => category.name}
                  />
                </UiGrid.Item>
              </UiGrid>
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
              const photo = employee.acf.photo

              return (
                <Employee
                  key={employee.id}
                  photo={
                    photo != null ? (
                      <>
                        <img
                          src={
                            photo.media_details?.sizes?.medium?.source_url ||
                            photo.source_url
                          }
                          alt={employee.title}
                        />
                      </>
                    ) : undefined
                  }
                  offsetTop={idx !== 0}
                  name={employee.title}
                  location={employee.building
                    ?.map((id) => {
                      return translateBuilding(id)
                    })
                    .join(', ')}
                  position={employee.positions
                    ?.map((id) => {
                      return translatePosition(id)
                    })
                    .join(', ')}
                  phone={employee.acf?.phone}
                  email={employee.acf?.email}
                />
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
