import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Helmet from 'react-helmet'

const PORT = process.env.PORT ? process.env.PORT : 6101

let SITE_URL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${PORT}`
    : 'https://platform.advancedalgos.net'

SITE_URL = process.env.SITE_URL ? process.env.SITE_URL : SITE_URL

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID ? process.env.FACEBOOK_APP_ID : null

const defaultTitle = 'Advanced Algos Platform'
const defaultDescription =
  'The Advanced Algos Web Platform is the central hub for developing Financial Beings'
const defaultImage = 'https://aadevelop.blob.core.windows.net/module-web-components/assets/aa-logo.png'
const defaultTwitter = '@advancedalgos'
const defaultSep = ' | '

class Page extends Component {
  getMetaTags (
    {
      title,
      subtitle,
      description,
      image,
      contentType,
      twitter,
      facebook,
      noCrawl,
      published,
      updated,
      category,
      tags
    },
    pathname
  ) {
    const theTitle = title
      ? (title + defaultSep + defaultTitle).substring(0, 60)
      : defaultTitle
    const theDescription = description
      ? description.substring(0, 155)
      : defaultDescription
    const theImage = image || defaultImage

    const metaTags = [
      { itemprop: 'name', content: theTitle },
      { itemprop: 'description', content: theDescription },
      { itemprop: 'image', content: theImage },
      { name: 'description', content: theDescription }
    ]

    if (facebook) {
      metaTags.push({ property: 'fb:app_id', content: FACEBOOK_APP_ID })
      metaTags.push({ property: 'og:title', content: theTitle })
      metaTags.push({ property: 'og:type', content: contentType || 'website' })
      metaTags.push({ property: 'og:url', content: SITE_URL + pathname })
      metaTags.push({ property: 'og:image', content: theImage })
      metaTags.push({ property: 'og:description', content: theDescription })
      metaTags.push({ property: 'og:site_name', content: defaultTitle })
    }

    if (twitter) {
      metaTags.push({ name: 'twitter:card', content: 'summary_large_image' })
      metaTags.push({ name: 'twitter:site', content: defaultTwitter })
      metaTags.push({ name: 'twitter:title', content: theTitle })
      metaTags.push({ name: 'twitter:description', content: theDescription })
      metaTags.push({ name: 'twitter:creator', content: twitter || defaultTwitter })
      metaTags.push({ name: 'twitter:image:src', content: theImage })
    }

    if (noCrawl) {
      metaTags.push({ name: 'robots', content: 'noindex, nofollow' })
    }

    if (published) {
      metaTags.push({ name: 'article:published_time', content: published })
    }
    if (updated) {
      metaTags.push({ name: 'article:modified_time', content: updated })
    }
    if (category) {
      metaTags.push({ name: 'article:section', content: category })
    }
    if (tags) {
      metaTags.push({ name: 'article:tag', content: tags })
    }

    return metaTags
  }

  render () {
    const { children, location, ...rest } = this.props

    return (
      <div className={`page-${rest.title}`}>
        <Helmet
          htmlAttributes={{
            lang: 'en',
            itemscope: undefined,
            itemtype: `http://schema.org/${rest.schema || 'WebPage'}`
          }}
          title={
            (rest.title && rest.subtitle) ? rest.title + defaultSep + rest.subtitle : defaultTitle
          }
          link={[
            {
              rel: 'canonical',
              href: SITE_URL + this.props.location.pathname
            }
          ]}
          meta={this.getMetaTags(rest, this.props.location.pathname)}
        />
        {children}
      </div>
    )
  }
}

Page.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  location: PropTypes.object
}

export default withRouter(Page)
