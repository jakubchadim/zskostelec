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
import schoolImage from '../images/school@2x.png'
import logoImage from '../images/logo.svg'

const MainHeading = styled.section`
  padding: 8.1rem 0 8rem;
  margin-top: -8.1rem;
  background: linear-gradient(
    180deg,
    ${(p) => p.theme.color.primary1} 0,
    ${(p) => p.theme.color.warning1} 100%
  );
  color: #fff;
`

const MainHeadingInfo = styled.div`
  display: flex;
  align-items: center;
`

const MainHeadingInfoItem = styled.div`
  width: 50%;
  
  img {
    display: block;
    height: 30rem;
    margin: 0 auto;
  }
`

const HeaderBoxes = styled.div`
  margin-top: -12rem;
  position: relative;
  z-index: 10;
`

const SecondSection = styled.div`
  margin: ${p => p.theme.spacing(12, 0, 0)};
  display: flex;
  justify-content: center;
  align-items: center;
`

const SecondSectionInfo = styled.div`
  width: 50%;
  
  img {
    width: 95%;
    display: block;
    margin: 0 0 0 auto;
  }
`

const More = styled.div`
  text-align: center;
  margin-top: ${p => p.theme.spacing(8)};
`

const SpecLink = styled.a`
  font-weight: 700;
`

const Home: React.FC = () => {
  return (
    <Layout transparentNav>
      <SEO title='Vítejte' />
      <MainHeading>
        <UiContainer>
          <MainHeadingInfo>
            <MainHeadingInfoItem>
              <img src={logoImage} />
            </MainHeadingInfoItem>
            <MainHeadingInfoItem>
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
            </MainHeadingInfoItem>
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
          <SecondSection>
            <SecondSectionInfo>
              <h1>Najdete nás na <b className='has-inline-color has-primary-color'>4&nbsp;pracovištích</b> v Kostelci nad Orlicí a okolí.</h1>
              <h3>Podívejte se kde všude</h3>
              <UiButton
                themeType={BlockCoreButtonType.FILL}
                backgroundColor={BlockColor.PRIMARY}
                textColor={BlockColor.WHITE}
              >
                Zobrazit pracoviště
              </UiButton>
            </SecondSectionInfo>
            <SecondSectionInfo>
              <img src={schoolImage} />
            </SecondSectionInfo>
          </SecondSection>
        </UiContainer>
      </UiSection>
      <UiSection backgroundColor={BlockColor.WHITE}>
        <UiContainer>
          <h1>Aktuality</h1>
          <UiGrid largeGutter>
            <UiGrid.Item md={4}>
              <UiBox backgroundColor={BlockColor.MEDIUM_GRAY}>
                <UiBox.Header>
                  <h3 style={{marginTop: '4rem'}}>
                    <b>
                      Seznamy žáků 6. tříd
                    </b>
                  </h3>
                </UiBox.Header>
                <UiBox.Content>
                  <p>Seznamy žáků 6. tříd pro školní rok 2020 - 2021</p>
                  <UiButton
                    themeType={BlockCoreButtonType.OUTLINE}
                    backgroundColor={BlockColor.MEDIUM_GRAY}
                    textColor={BlockColor.BLACK}
                  >
                    Více informací
                  </UiButton>
                </UiBox.Content>
              </UiBox>
            </UiGrid.Item>
            <UiGrid.Item md={4}>
              <UiBox backgroundColor={BlockColor.MEDIUM_GRAY}>
                <UiBox.Header>
                  <h3 style={{marginTop: '4rem'}}>
                    <b>
                      Seznamy žáků 6. tříd
                    </b>
                  </h3>
                </UiBox.Header>
                <UiBox.Content>
                  <p>Seznamy žáků 6. tříd pro školní rok 2020 - 2021</p>
                  <UiButton
                    themeType={BlockCoreButtonType.OUTLINE}
                    backgroundColor={BlockColor.MEDIUM_GRAY}
                    textColor={BlockColor.BLACK}
                  >
                    Více informací
                  </UiButton>
                </UiBox.Content>
              </UiBox>
            </UiGrid.Item>
            <UiGrid.Item md={4}>
              <UiBox backgroundColor={BlockColor.MEDIUM_GRAY}>
                <UiBox.Header>
                  <h3 style={{marginTop: '4rem'}}>
                    <b>
                      Seznamy žáků 6. tříd
                    </b>
                  </h3>
                </UiBox.Header>
                <UiBox.Content>
                  <p>Seznamy žáků 6. tříd pro školní rok 2020 - 2021</p>
                  <UiButton
                    themeType={BlockCoreButtonType.OUTLINE}
                    backgroundColor={BlockColor.MEDIUM_GRAY}
                    textColor={BlockColor.BLACK}
                  >
                    Více informací
                  </UiButton>
                </UiBox.Content>
              </UiBox>
            </UiGrid.Item>
          </UiGrid>
          <More>
            <SpecLink href='#'>Všechny aktuality</SpecLink>
          </More>
        </UiContainer>
      </UiSection>
    </Layout>
  )
}

export default Home
