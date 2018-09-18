import React from 'react';
import PropTypes from 'prop-types';
import PhaseBanner from './phase-banner';

class HomeOffice extends React.Component {

  render() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>{ this.props.title || this.props.propositionHeader }</title>

          {
            this.props.stylesheets.map(file => (
              <link rel="stylesheet" media="screen" href={file} key={file} />
            ))
          }

          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta property="og:image" content={`${this.props.assetPath}/images/opengraph-image.png?0.23.0`}/>
        </head>

        <body>

          <header role="banner" className={this.props.propositionHeader ? 'with-proposition' : ''}>
            <div className="font-ui wrapper-header">
              <div className="header-logo">
                <a href={ this.props.homepageUrl } title={ this.props.logoLinkTitle } id="logo" className="content">
                  <img src={`${this.props.hoAssetPath}/images/ho-logo.svg`} />
                </a>
              </div>
              {
                this.props.propositionHeader &&
                  <div className="header-title">
                    {
                      this.props.propositionHeaderLink &&
                      <a href={this.props.propositionHeaderLink} id="header-name">{this.props.propositionHeader}</a>
                    }
                    {
                      !this.props.propositionHeaderLink && this.props.propositionHeader
                    }
                  </div>
              }
              <div className="content">
                {
                  this.props.headerContent && this.props.headerContent
                }
              </div>
            </div>
          </header>

          { this.props.phaseBanner && <PhaseBanner {...this.props.phaseBanner} /> }

          {this.props.children}

          <footer role="contentinfo" id="footer-withphase">
            <div className="govuk-width-container">
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                  <div className="open-government-licence">
                    <p>
                      <a href="http://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/copyright-and-re-use/crown-copyright/">© Crown copyright</a>
                       - All content is available under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" rel="license">Open Government Licence v3.0</a>, except where otherwise stated
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </footer>

          <div id="global-app-error" className="app-error hidden"></div>

          {
            this.props.scripts.map(file => (
              <script src={file} key={file}></script>
            ))
          }
        </body>
      </html>
    );
  }

}

HomeOffice.defaultProps = {
  assetPath: '/govuk',
  hoAssetPath: '/ho',
  stylesheets: [],
  scripts: [],
  homepageUrl: 'https://www.gov.uk',
  propositionHeaderLink: '/',
  logoLinkTitle: '',
  skipToContent: 'Skip to main content',
  skipToContentTarget: '#content',
  footerLinks: [],
  globalHeaderText: 'GOV.UK'
};

HomeOffice.propTypes = {
  children: PropTypes.node,

  propositionHeader: PropTypes.string,
  title: PropTypes.string,

  assetPath: PropTypes.string,
  hoAssetPath: PropTypes.string,
  stylesheets: PropTypes.arrayOf(PropTypes.string),
  scripts: PropTypes.arrayOf(PropTypes.string),
  homepageUrl: PropTypes.string,
  logoLinkTitle: PropTypes.string,
  globalHeaderText: PropTypes.string,
  propositionHeaderLink: PropTypes.string,
  skipToContent: PropTypes.string,
  skipToContentTarget: PropTypes.string,
  footerLinks: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      label: PropTypes.string
    })
  )
};

export default HomeOffice;
