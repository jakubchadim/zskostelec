import { Link } from 'gatsby'
import React from 'react'
import { FileEmpty } from '@styled-icons/icomoon/FileEmpty'
import { BlockColor } from '../components/block/color/color'
import Layout from '../components/layout/layout'
import NonIdealState from '../components/nonIdealState/nonIdealState'
import UiButton from '../components/ui/button/button'
import UiContainer from '../components/ui/container/container'
import UiSection from '../components/ui/section/section'

const NotFoundPage = () => (
  <Layout>
    <UiSection>
      <UiContainer>
        <NonIdealState
          icon={FileEmpty}
          title='404'
          description='Hledaná stránka nebyla nalezena.'
        >
          <UiButton
            as={Link}
            to='/'
            backgroundColor={BlockColor.PRIMARY}
            textColor={BlockColor.WHITE}
          >
            Hlavní strana
          </UiButton>
        </NonIdealState>
      </UiContainer>
    </UiSection>
  </Layout>
)

export default NotFoundPage
