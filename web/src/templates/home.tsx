import React from 'react'
import styled from 'styled-components'
import { BlockColor } from '../components/block/color/color'
import { BlockCoreButtonType } from '../components/block/core/button/constants'
import SEO from '../components/seo/seo'
import UiContainer from '../components/ui/container/container'
import Layout from '../components/layout/layout'
import UiShape from '../components/ui/shape/shape'
import UiButton from '../components/ui/button/button'
import UiIcon from '../components/ui/icon/icon'

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

const Grid = styled.div`
  display: flex;
  margin: ${(p) => p.theme.spacing(-2, -2, 0)};
`

const GridItem = styled.div`
  width: 33.3%;
  padding: ${(p) => p.theme.spacing(2, 2, 0)};
`

const HeaderBoxesGrid = styled(Grid)`
  margin-top: -6rem;
  position: relative;
  z-index: 10;
`

const Box = styled.div`
  background: ${(p) => p.theme.color.white1};
  box-shadow: ${(p) => p.theme.shadow.lift};
  border-radius: ${(p) => p.theme.radius.medium};
  padding: ${(p) => p.theme.spacing(5, 6, 3)};
  min-height: 15rem;
`

const BoxTitle = styled.div`
  margin-bottom: ${(p) => p.theme.spacing(4)};
`

const Home: React.FC = () => {
  return (
    <Layout transparentNav>
      <SEO title='Vítejte' />
      <MainHeading>
        <UiContainer>
          <MainHeadingInfo>
            <h1>Přijatí žáci</h1>
            <h3 style={{ margin: '2rem 0 1rem' }}>
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
      <UiShape color={BlockColor.LIGHT_GRAY} />
      <UiContainer>
        <HeaderBoxesGrid>
          <GridItem>
            <Box>
              <BoxTitle>
                <h2>
                  Jsem <b>žák</b>
                </h2>
                <h4>a chci...</h4>
              </BoxTitle>
              <p>
                <a href='#'>Zkontrolovat známky</a>
              </p>
              <p>
                <a href='#'>Prohlédnout rozvrh hodin</a>
              </p>
              <p>
                <a href='#'>Přečíst si Guťák</a>
              </p>
            </Box>
          </GridItem>
          <GridItem>
            <Box>
              <BoxTitle>
                <h2>
                  Jsem <b>rodič</b>
                </h2>
                <h4>a chci...</h4>
              </BoxTitle>
              <p>
                <a href='#'>Zkontrolovat známky</a>
              </p>
              <p>
                <a href='#'>Prohlédnout úspěchy dítěte</a>
              </p>
              <p>
                <a href='#'>Informace o klubu rodičů</a>
              </p>
            </Box>
          </GridItem>
          <GridItem>
            <Box>
              <BoxTitle>
                <h2>
                  Jsem <b>učitel</b>
                </h2>
                <h4>a chci...</h4>
              </BoxTitle>
              <p>
                <a href='#'>Zapsat známky</a>
              </p>
              <p>
                <a href='#'>Najít dokumenty</a>
              </p>
              <p>
                <a href='#'>Něco...</a>
              </p>
            </Box>
          </GridItem>
        </HeaderBoxesGrid>
      </UiContainer>
    </Layout>
  )
}

export default Home
