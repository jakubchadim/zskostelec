import React from 'react'
import styled from 'styled-components'
import { BlockColor } from '../components/block/color/color'
import { BlockCoreButtonType } from '../components/block/core/button/constants'
import SEO from '../components/seo/seo'
import UiContainer from '../components/ui/container/container'
import Layout from '../components/layout/layout'
import UiNav from '../components/ui/nav/nav'
import UiButton from '../components/ui/button/button'
import UiGrid from '../components/ui/grid/grid'
import UiSection from '../components/ui/section/section'
import UiBox from '../components/ui/box/box'

const MainHeading = styled.section`
  padding: 15.1rem 0 14rem;
  margin-top: -8.1rem;
  background: linear-gradient(
    180deg,
    ${(p) => p.theme.color.primary1} 0,
    ${(p) => p.theme.color.warning1} 100%
  );
  color: #fff;
`

const MainHeadingInfo = styled.div`
  width: 50%;
  margin: 0 0 0 auto;
`

const HeaderBoxes = styled.div`
  margin-top: -12rem;
  position: relative;
  z-index: 10;
`

const Home: React.FC = () => {
  return (
    <Layout transparentNav>
      <SEO title='Vítejte' />
      <MainHeading>
        <UiContainer>
          <MainHeadingInfo>
            <h1>Přijatí žáci</h1>
            <h3>
              Žáci přijatí do 1. tříd pro školní rok 2020 - 2021.
            </h3>
            <UiButton
              themeType={BlockCoreButtonType.OUTLINE}
              textColor={BlockColor.WHITE}
            >
              Zjistit více
            </UiButton>
          </MainHeadingInfo>
        </UiContainer>
      </MainHeading>
      <UiSection backgroundColor={BlockColor.LIGHT_GRAY}>
        <UiContainer>
          <HeaderBoxes>
            <UiGrid>
              <UiGrid.Item md={4}>
                <UiBox>
                  <UiBox.Header>
                    <h2>
                      Jsem <b>žák</b>
                    </h2>
                    <h4>a chci...</h4>
                  </UiBox.Header>
                  <UiBox.Content>
                    <UiNav>
                      <UiNav.Item>
                        <UiNav.Link href='#'>
                          Zkontrolovat známky
                        </UiNav.Link>
                      </UiNav.Item>
                      <UiNav.Item>
                        <UiNav.Link href='#'>
                          Prohlédnout rozvrh hodin
                        </UiNav.Link>
                      </UiNav.Item>
                      <UiNav.Item>
                        <UiNav.Link href='#'>
                          Přečíst si Guťák
                        </UiNav.Link>
                      </UiNav.Item>
                    </UiNav>
                  </UiBox.Content>
                </UiBox>
              </UiGrid.Item>
              <UiGrid.Item md={4}>
                <UiBox>
                  <UiBox.Header>
                    <h2>
                      Jsem <b>rodič</b>
                    </h2>
                    <h4>a chci...</h4>
                  </UiBox.Header>
                  <UiBox.Content>
                    <UiNav>
                      <UiNav.Item>
                        <UiNav.Link href='#'>
                          Zkontrolovat známky
                        </UiNav.Link>
                      </UiNav.Item>
                      <UiNav.Item>
                        <UiNav.Link href='#'>
                          Prohlédnout úspěchy dítěte
                        </UiNav.Link>
                      </UiNav.Item>
                      <UiNav.Item>
                        <UiNav.Link href='#'>
                          Informace o klubu rodičů
                        </UiNav.Link>
                      </UiNav.Item>
                    </UiNav>
                  </UiBox.Content>
                </UiBox>
              </UiGrid.Item>
              <UiGrid.Item md={4}>
                <UiBox>
                  <UiBox.Header>
                    <h2>
                      Jsem <b>učitel</b>
                    </h2>
                    <h4>a chci...</h4>
                  </UiBox.Header>
                  <UiBox.Content>
                    <UiNav>
                      <UiNav.Item>
                        <UiNav.Link href='#'>
                          Zapsat známky
                        </UiNav.Link>
                      </UiNav.Item>
                      <UiNav.Item>
                        <UiNav.Link href='#'>
                          Najít dokumenty
                        </UiNav.Link>
                      </UiNav.Item>
                      <UiNav.Item>
                        <UiNav.Link href='#'>
                          Něco...
                        </UiNav.Link>
                      </UiNav.Item>
                    </UiNav>
                  </UiBox.Content>
                </UiBox>
              </UiGrid.Item>
            </UiGrid>
          </HeaderBoxes>
        </UiContainer>
      </UiSection>
    </Layout>
  )
}

export default Home
