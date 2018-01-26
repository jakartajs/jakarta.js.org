import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import 'normalize.css';
import '../styles/globals.scss';

import styles from './index.module.scss';

import Masthead from '../components/Masthead';
import Footer from '../components/Footer';

const menuItems = [
  {
    name: 'Events',
    path: '/events',
  },
];

const TemplateWrapper = ({ children, data }) => (
  <div className={styles.root}>
    <Helmet
      title={`${data.site.siteMetadata.title} · ${data.site.siteMetadata.subtitle}`}
      meta={[
        { name: 'description', content: data.site.siteMetadata.description },
        { property: 'og:site_name', content: data.site.siteMetadata.title },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: data.site.siteMetadata.title },
        { property: 'og:description', content: data.site.siteMetadata.description },
      ]}
    />
    <Masthead siteName={data.site.siteMetadata.title} menuItems={menuItems} />
    {children()}
    <Footer siteName={data.site.siteMetadata.title} />
  </div>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func.isRequired,
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string,
        subtitle: PropTypes.string,
        description: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default TemplateWrapper;

export const query = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        subtitle
        description
      }
    }
  }
`;