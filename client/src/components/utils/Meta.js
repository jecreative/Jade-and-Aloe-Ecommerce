import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to ProShop',
  keywords:
    'skateboards, longboards, skating, outdoor recreation, active, sports',
  description:
    'High quality bamboo and multi flex longboards and cruise skateboards.',
}

export default Meta
