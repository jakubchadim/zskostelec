import { graphql, Link, PageProps } from 'gatsby'

import React from 'react'
import styled from 'styled-components'
import { BlockColor } from '../components/block/color/color'
import { BlockCoreButtonType } from '../components/block/core/button/constants'
import { TransformedBlock } from '../components/block/types'
import Layout from '../components/layout/layout'
import NavFastFirst from '../components/nav/fastFirst'
import NavFastSecond from '../components/nav/fastSecond'
import SEO from '../components/seo/seo'
import UiBox from '../components/ui/box/box'
import UiButton from '../components/ui/button/button'
import UiContainer from '../components/ui/container/container'
import UiSection from '../components/ui/section/section'
import logoImage from '../images/logo.svg'
import schoolImage from '../images/school@2x.png'
import { ID, Nullable, RawHTML } from '../types'
import { getExternalLinkTarget } from '../utils/link'

const MainHeading = styled.section`
  padding: 8.1rem 0 8rem;
  margin-top: -8.1rem;
  background: linear-gradient(
    180deg,
    ${(p) => p.theme.color.primary1} 0,
    #ed704a 100%
  );
  color: #fff;
`

const MainHeadingInfo = styled.div`
  display: flex;
  align-items: center;
`

const MainHeadingInfoPhoto = styled.div`
  width: 40%;
  min-width: 35%;
  padding-right: ${(p) => p.theme.spacing(4)};

  ${(p) => p.theme.media.sm.down} {
    padding: ${(p) => p.theme.spacing(4, 4, 4, 0)};
  }

  ${(p) => p.theme.media.xs.down} {
    display: none;
  }

  img {
    display: block;
    max-width: 30rem;
    width: 100%;
    margin: 0 auto;
  }
`

const MainHeadingInfoItem = styled.div`
  ${(p) => p.theme.media.xs.down} {
    padding: ${(p) => p.theme.spacing(4, 0)};
  }

  ${(p) => p.theme.media.sm.down} {
    padding: ${(p) => p.theme.spacing(8, 0)};
  }
`

const HeaderBoxes = styled.div`
  margin-top: -12rem;
  position: relative;
  z-index: 10;
`

const SecondSection = styled.div`
  margin: ${(p) => p.theme.spacing(8)} auto 0;
  max-width: 35rem;
  text-align: center;

  ${(p) => p.theme.media.sm.up} {
    max-width: initial;
    margin: ${(p) => p.theme.spacing(10, 0, 0)};
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: initial;
  }

  ${(p) => p.theme.media.md.up} {
    margin: ${(p) => p.theme.spacing(12, 0, 0)};
  }
`

const SecondSectionInfo = styled.div`
  margin-top: ${(p) => p.theme.spacing(2)};

  ${(p) => p.theme.media.sm.up} {
    width: 50%;
    margin: 0;
  }

  img {
    width: 90%;
    display: block;
    margin: 0 auto;

    ${(p) => p.theme.media.sm.up} {
      width: 95%;
      margin: 0 0 0 auto;
    }
  }
`

const More = styled.div`
  text-align: center;
  margin: ${(p) => p.theme.spacing(6, 0, 2)};
`

const SpecLink = styled.a`
  font-weight: 700;
`

const MainHeadingGrid = styled.div`
  //grid-template-columns: 1fr;
  //grid-template-rows: repeat(5, 1fr);
  max-width: 35rem;
  margin: 0 auto;

  ${(p) => p.theme.media.xs.down} {
    & > * {
      margin-top: ${(p) => p.theme.spacing(2)};
    }
  }

  ${(p) => p.theme.media.sm.up} {
    display: grid;
    column-gap: ${(p) => p.theme.spacing(3)};
    row-gap: ${(p) => p.theme.spacing(3)};
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    max-width: initial;
  }

  ${(p) => p.theme.media.md.up} {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
`

const MainHeadingGridWarnings = styled.div`
  grid-column: 1 / 1;
  grid-row: 1 / 1;

  ${(p) => p.theme.media.sm.up} {
    grid-column: 1 / 1;
    grid-row: 1 / 3;
  }

  ${(p) => p.theme.media.md.up} {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
  }
`

const MainHeadingGridFirstNav = styled.div`
  grid-column: 1 / 1;
  grid-row: 2 / 2;

  ${(p) => p.theme.media.sm.up} {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

  ${(p) => p.theme.media.md.up} {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }
`

const MainHeadingGridSecondNav = styled.div`
  grid-column: 1 / 1;
  grid-row: 3 / 3;

  ${(p) => p.theme.media.sm.up} {
    grid-column: 2 / 2;
    grid-row: 2 / 2;
  }

  ${(p) => p.theme.media.md.up} {
    grid-column: 3 / 3;
    grid-row: 1 / 2;
  }
`

const MainHeadingGridFirstArticles = styled.div`
  grid-column: 1 / 1;
  grid-row: 4 / 4;

  ${(p) => p.theme.media.sm.up} {
    grid-column: 1 / 2;
    grid-row: 3 / 3;
  }

  ${(p) => p.theme.media.md.up} {
    grid-column: 2 / 3;
    grid-row: 2 / 2;
  }
`

const MainHeadingGridSecondArticles = styled.div`
  grid-column: 1 / 1;
  grid-row: 5 / 5;

  ${(p) => p.theme.media.sm.up} {
    grid-column: 2 / 2;
    grid-row: 3 / 3;
  }

  ${(p) => p.theme.media.md.up} {
    grid-column: 3 / 3;
    grid-row: 2 / 2;
  }
`

const MainHeadingArticlePerex = styled.div`
  font-size: 0.875em;
  opacity: 0.7;
  margin-top: ${(p) => p.theme.spacing(1)};

  p {
    margin-top: ${(p) => p.theme.spacing(1)};
  }
`

const MainHeadingArticleDate = styled.div`
  font-size: 0.8em;
  opacity: 0.5;
`

const MainHeadingArticleDivider = styled.hr`
  border: none;
  border-bottom: 0.1rem solid ${(p) => p.theme.color.gray2};
  margin: ${(p) => p.theme.spacing(3, 0)};
`

const ArticleScrollContainer = styled(UiBox.ScrollContainer)`
  ${(p) => p.theme.media.xs.down} {
    position: static !important;
  }
`

const ArticleItem = styled.div<{ visible?: boolean }>`
  ${(p) => p.theme.media.xs.down} {
    display: ${(p) => (p.visible ? 'block' : 'none')};
  }
`

const TitleLight = styled.h3`
  font-weight: 300;
`

type Article = {
  id: ID
  date: string
  title: string
  excerpt: string
  link: string | null
}

type ArticlePreview = {
  category: {
    id: ID
    name: string
    link: string
  }
  articles: Article[]
}

const ArticlesCategory: React.FC<{ articlesCategory: ArticlePreview }> = ({
  articlesCategory
}) => {
  return (
    <UiBox fullHeight>
      <UiBox.ScrollParalax />
      <ArticleScrollContainer>
        <UiBox.Header>
          <h2>
            <b>{articlesCategory.category.name}</b>
          </h2>
        </UiBox.Header>
        <UiBox.Content>
          {articlesCategory.articles.map((article, idx) => (
            <ArticleItem key={idx} visible={idx === 0}>
              {idx !== 0 && <MainHeadingArticleDivider />}
              <MainHeadingArticleDate>{article.date}</MainHeadingArticleDate>
              {article.link == null ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: article.title
                  }}
                />
              ) : (
                <Link
                  to={article.link}
                  target={getExternalLinkTarget(article.link)}
                  dangerouslySetInnerHTML={{
                    __html: article.title
                  }}
                />
              )}
              <MainHeadingArticlePerex
                dangerouslySetInnerHTML={{
                  __html: article.excerpt
                }}
              />
            </ArticleItem>
          ))}
          <More>
            <SpecLink as={Link} to={articlesCategory.category.link}>
              Všechny {articlesCategory.category.name.toLowerCase()}
            </SpecLink>
          </More>
        </UiBox.Content>
      </ArticleScrollContainer>
    </UiBox>
  )
}

type HomeContext = {
  articlePreviews: ArticlePreview[]
  mainPost?: Article
}

type WordpressPageData = {
  wordpressPage: {
    title: string
    content?: RawHTML
    acf: Nullable<{
      fastMenu?: string
      fastMenuSecond?: string
      sectionLink: Nullable<{
        url: string
        title: string
        target: string
      }>
    }>
    blocks?: TransformedBlock[]
  }
}

export const query = graphql`
  query homePageQuery($id: String!) {
    wordpressPage(id: { eq: $id }) {
      title
      acf {
        fastMenu
        fastMenuSecond
        sectionLink {
          url
          title
          target
        }
      }
    }
  }
`

type HomeProps = PageProps<WordpressPageData, HomeContext>

const Home: React.FC<HomeProps> = ({
  data: { wordpressPage },
  pageContext
}) => {
  const { mainPost, articlePreviews } = pageContext

  const [
    mainArticles,
    additionalArticles,
    additionalArticles2
  ] = articlePreviews

  const sectionLink = wordpressPage.acf?.sectionLink?.url

  return (
    <Layout transparentNav>
      <SEO title='Vítejte' />
      <MainHeading>
        <UiContainer>
          <MainHeadingInfo>
            <MainHeadingInfoPhoto>
              <img src={logoImage} />
            </MainHeadingInfoPhoto>
            {mainPost && (
              <MainHeadingInfoItem>
                <h1
                  dangerouslySetInnerHTML={{
                    __html: mainPost.title
                  }}
                />
                <TitleLight
                  dangerouslySetInnerHTML={{
                    __html: mainPost.excerpt
                  }}
                />
                {mainPost.link != null && (
                  <UiButton
                    as={Link}
                    to={mainPost.link}
                    target={getExternalLinkTarget(mainPost.link)}
                    themeType={BlockCoreButtonType.OUTLINE}
                    textColor={BlockColor.WHITE}
                  >
                    Zjistit více
                  </UiButton>
                )}
              </MainHeadingInfoItem>
            )}
          </MainHeadingInfo>
        </UiContainer>
      </MainHeading>
      <UiSection backgroundColor={BlockColor.LIGHT_GRAY}>
        <UiContainer>
          <HeaderBoxes>
            <MainHeadingGrid>
              {mainArticles && (
                <MainHeadingGridWarnings>
                  <ArticlesCategory articlesCategory={mainArticles} />
                </MainHeadingGridWarnings>
              )}
              <MainHeadingGridFirstNav>
                <UiBox fullHeight>
                  <UiBox.Header>
                    <h2>
                      <b>{wordpressPage.acf?.fastMenu}</b>
                    </h2>
                  </UiBox.Header>
                  <UiBox.Content>
                    <NavFastFirst fill />
                  </UiBox.Content>
                </UiBox>
              </MainHeadingGridFirstNav>
              <MainHeadingGridSecondNav>
                <UiBox fullHeight>
                  <UiBox.Header>
                    <h2>
                      <b>{wordpressPage.acf?.fastMenuSecond}</b>
                    </h2>
                  </UiBox.Header>
                  <UiBox.Content>
                    <NavFastSecond fill />
                  </UiBox.Content>
                </UiBox>
              </MainHeadingGridSecondNav>
              {additionalArticles && (
                <MainHeadingGridFirstArticles>
                  <ArticlesCategory articlesCategory={additionalArticles} />
                </MainHeadingGridFirstArticles>
              )}
              {additionalArticles2 && (
                <MainHeadingGridSecondArticles>
                  <ArticlesCategory articlesCategory={additionalArticles2} />
                </MainHeadingGridSecondArticles>
              )}
            </MainHeadingGrid>
          </HeaderBoxes>
          <SecondSection>
            <SecondSectionInfo>
              <h1>
                Najdete nás na{' '}
                <b className='has-inline-color has-primary-color'>
                  5&nbsp;pracovištích
                </b>{' '}
                v Kostelci nad Orlicí a okolí.
              </h1>
              <TitleLight>Podívejte se kde všude</TitleLight>
              {sectionLink != null && (
                <UiButton
                  as={Link}
                  to={sectionLink}
                  themeType={BlockCoreButtonType.FILL}
                  backgroundColor={BlockColor.PRIMARY}
                  textColor={BlockColor.WHITE}
                >
                  Zobrazit pracoviště
                </UiButton>
              )}
            </SecondSectionInfo>
            <SecondSectionInfo>
              <img src={schoolImage} />
            </SecondSectionInfo>
          </SecondSection>
        </UiContainer>
      </UiSection>
    </Layout>
  )
}

export default Home
