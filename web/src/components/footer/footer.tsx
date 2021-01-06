import React from 'react'
import { Phone } from '@styled-icons/material/Phone'
import logoImage from '../../images/logo.svg'
import NavFastFirst from '../nav/fastFirst'
import NavFastSecond from '../nav/fastSecond'
import UiFooter from '../ui/footer/footer'
import UiContainer from '../ui/container/container'
import UiGrid from '../ui/grid/grid'
import UiIcon from '../ui/icon/icon'

const Footer: React.FC = () => {
  return (
    <UiFooter>
      <UiContainer>
        <UiFooter.Container>
          <UiGrid largeGutter>
            <UiGrid.Item md={3} size={0}>
              <UiFooter.Logo
                src={logoImage}
                alt='Základní škola Gutha Jarkovského Kostelec nad Orlicí'
              />
            </UiGrid.Item>
            <UiGrid.Item md={3} xs={6}>
              <NavFastFirst fill transparent simple />
            </UiGrid.Item>
            <UiGrid.Item md={3} xs={6}>
              <NavFastSecond fill transparent simple />
            </UiGrid.Item>
            <UiGrid.Item md={0} sm={3} />
            <UiGrid.Item md={3} sm={6}>
              <UiFooter.Contact>
                Základní škola Gutha&nbsp;Jarkovského Kostelec nad Orlicí
                <br />
                Palackého náměstí 45,
                <br />
                517 41 Kostelec nad Orlicí
                <UiFooter.Phone>
                  <UiIcon icon={Phone} />
                  <a href='tel:+420494323138'>+420 494 323 138</a>
                </UiFooter.Phone>
              </UiFooter.Contact>
            </UiGrid.Item>
          </UiGrid>
          <UiFooter.Info>ZŠ Kostelec nad Orlicí</UiFooter.Info>
        </UiFooter.Container>
      </UiContainer>
    </UiFooter>
  )
}

export default Footer
