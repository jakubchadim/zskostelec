import React from 'react'
import { Link, graphql, PageProps } from 'gatsby'
import { ArrowRight } from '@styled-icons/material/ArrowRight'
import styled, { css } from 'styled-components'
import { SearchOff } from '@styled-icons/material/SearchOff'
import { BlockColor } from '../components/block/color/color'
import { BlockCoreButtonType } from '../components/block/core/button/constants'
import UiNavPagination from '../components/nav/pagination'
import NonIdealState from '../components/nonIdealState/nonIdealState'
import UiArticle from '../components/ui/article/article'
import UiContainer from '../components/ui/container/container'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import UiSection from '../components/ui/section/section'
import { DateString, ID, Nullable, RawHTML } from '../types'
import UiButton from '../components/ui/button/button'
import UiGrid from '../components/ui/grid/grid'
import UiBox from '../components/ui/box/box'
import { getExternalLinkTarget } from '../utils/link'
import { useTooltip } from '../utils/tooltip'

const ChooseCategory = styled.span<{ active?: boolean }>`
  color: ${(p) => (p.active ? p.theme.color.secondary2 : p.theme.color.gray6)};
  text-decoration: underline;
  cursor: pointer;
  position: relative;
  padding-left: 1.2em;
  display: inline-block;

  &:hover {
    color: ${(p) => p.theme.color.secondary2};
  }
`

const ChooseCategoryIcon = styled.span`
  height: 1.2em;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -0.6em;
  display: inline-block;
`

const ChooseCategoryPopup__open = css`
  margin-top: 0;
  opacity: 1;
  pointer-events: initial;
`

const ChooseCategoryPopup = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  top: 100%;
  left: 50%;
  color: black;
  transform: translateX(calc(-50% + 0.6em));
  opacity: 0;
  margin-top: 1em;
  transition: margin-top 0.2s ease-in-out, opacity 0.2s ease-in-out;
  pointer-events: none;

  ${(p) => p.isOpen && ChooseCategoryPopup__open};
`

const ChooseCategoryItems = styled.div`
  margin-top: ${(p) => p.theme.spacing(2)};
  padding: ${(p) => p.theme.spacing(3)};
  font-size: 0.7em;
  background: ${(p) => p.theme.color.white1};
  box-shadow: ${(p) => p.theme.shadow.dark.large};
  border-radius: ${(p) => p.theme.radius.medium};
`

const ChooseCategoryItem = styled.div`
  padding: ${(p) => p.theme.spacing(1)};
  white-space: nowrap;
  text-align: center;
`

const ChooseCategoryLink = styled(Link)`
  text-decoration: none;

  &:hover {
    text-decoration: none;
    color: ${(p) => p.theme.color.secondary2};
  }
`

type WordpressCategoryData = {
  wordpressCategory: {
    name: string
    parent_element: Nullable<{
      id: ID
      name: string
      link: string
    }>
  }
  allWordpressCategory: {
    edges: {
      node: {
        id: ID
        name: string
        link: string
      }
    }[]
  }
  allWordpressPost: {
    edges: {
      node: {
        id: ID
        date: DateString
        title: string
        excerpt: RawHTML
        link: string
      }
    }[]
  }
}

export const query = graphql`
  query currentCategoryQuery(
    $id: String!
    $rootCategoryId: String!
    $offset: Int!
    $limit: Int!
  ) {
    wordpressCategory(id: { eq: $id }) {
      name
      parent_element {
        id
        name
        link
      }
    }
    allWordpressCategory(
      filter: { parent_element: { id: { eq: $rootCategoryId } } }
    ) {
      edges {
        node {
          id
          name
          link
        }
      }
    }
    allWordpressPost(
      limit: $limit
      skip: $offset
      filter: {
        status: { eq: "publish" }
        categories: { elemMatch: { id: { eq: $id } } }
      }
    ) {
      edges {
        node {
          id
          date(formatString: "DD.MM. YYYY")
          title
          excerpt
          link
        }
      }
    }
  }
`

type CategoryProps = PageProps<
  WordpressCategoryData,
  {
    limit: number
    offset: number
    totalCount: number
    basePath: string
  }
>

const Category: React.FC<CategoryProps> = ({
  data: { wordpressCategory, allWordpressCategory, allWordpressPost },
  pageContext
}) => {
  const [isOpen, handleToggle, tooltipRef] = useTooltip()
  const isCategory = wordpressCategory.parent_element != null

  return (
    <Layout>
      <SEO title={wordpressCategory.name} />
      <UiSection>
        <UiContainer>
          <h1>
            {isCategory
              ? wordpressCategory.parent_element?.name
              : wordpressCategory.name}
            {allWordpressCategory.edges.length > 0 && (
              <ChooseCategory active={isOpen} ref={tooltipRef}>
                <ChooseCategoryIcon as={ArrowRight} />
                <span onClick={handleToggle}>
                  {isCategory ? wordpressCategory.name : 'vyberte kategorii'}
                </span>
                <ChooseCategoryPopup isOpen={isOpen}>
                  <ChooseCategoryItems>
                    {wordpressCategory.parent_element != null && (
                      <ChooseCategoryItem>
                        <ChooseCategoryLink
                          to={wordpressCategory.parent_element.link}
                        >
                          Zobrazit vše
                        </ChooseCategoryLink>
                      </ChooseCategoryItem>
                    )}
                    {allWordpressCategory.edges.map(({ node: category }) => (
                      <ChooseCategoryItem key={category.id}>
                        <ChooseCategoryLink to={category.link}>
                          {category.name}
                        </ChooseCategoryLink>
                      </ChooseCategoryItem>
                    ))}
                  </ChooseCategoryItems>
                </ChooseCategoryPopup>
              </ChooseCategory>
            )}
          </h1>
          {allWordpressPost.edges.length === 0 ? (
            <NonIdealState
              icon={SearchOff}
              title='Články nenalezeny'
              description='Nalezeno 0 článků. Zkuste hledat jinde.'
              offsetTop
            >
              {wordpressCategory.parent_element != null && (
                <Link to={wordpressCategory.parent_element.link}>
                  <UiButton
                    backgroundColor={BlockColor.PRIMARY}
                    textColor={BlockColor.WHITE}
                  >
                    Vyčistit filtr
                  </UiButton>
                </Link>
              )}
            </NonIdealState>
          ) : (
            <UiGrid largeGutter>
              {allWordpressPost.edges.map(({ node: post }) => (
                <UiGrid.Item md={4} sm={6} key={post.id}>
                  <UiBox backgroundColor={BlockColor.WHITE}>
                    <UiBox.Header>
                      <UiArticle.Header>
                        <UiArticle.Title
                          dangerouslySetInnerHTML={{ __html: post.title }}
                        />
                      </UiArticle.Header>
                    </UiBox.Header>
                    <UiBox.Content>
                      <UiArticle.Perex
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                      />
                      <UiArticle.Footer>
                        <UiButton
                          as={Link}
                          to={post.link}
                          target={getExternalLinkTarget(post.link)}
                          themeType={BlockCoreButtonType.OUTLINE}
                          backgroundColor={BlockColor.WHITE}
                          textColor={BlockColor.BLACK}
                        >
                          Zobrazit
                        </UiButton>
                        <UiArticle.Date>{post.date}</UiArticle.Date>
                      </UiArticle.Footer>
                    </UiBox.Content>
                  </UiBox>
                </UiGrid.Item>
              ))}
            </UiGrid>
          )}
          {allWordpressPost.edges.length > 0 && (
            <UiSection.Pagination>
              <UiNavPagination
                totalCount={Math.ceil(
                  pageContext.totalCount / pageContext.limit
                )}
                current={pageContext.offset / pageContext.limit + 1}
                generateLink={(page) =>
                  page === 1
                    ? pageContext.basePath
                    : `${pageContext.basePath}strana-${page}`
                }
              />
            </UiSection.Pagination>
          )}
        </UiContainer>
      </UiSection>
    </Layout>
  )
}

export default Category
