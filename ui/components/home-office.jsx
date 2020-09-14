import React from 'react';
import PropTypes from 'prop-types';
import PhaseBanner from './phase-banner';

class HomeOffice extends React.Component {

  render() {
    return (
      <html lang="en">
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
                  <img src={`${this.props.hoAssetPath}/images/ho-logo.svg`} alt="Home Office logo" />
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

          <footer role="contentinfo">
            <div className="wrapper-footer">

              {
                this.props.footerLinks.length > 0 && (
                  <div className="footer-menu">
                    {
                      this.props.footerLinks.map(section => (

                        <section key={section.sectionName}>
                          <h3>{section.sectionName}</h3>
                          {
                            section.links.length > 0 && (
                              <ul>
                                {
                                  section.links.map(link => (
                                    <li key={link.href}><a href={link.href}>{link.label}</a></li>
                                  ))
                                }
                              </ul>
                            )
                          }
                        </section>

                      ))
                    }
                  </div>
                )
              }

              <ul className="default-links">
                <li>
                  <a href="http://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/copyright-and-re-use/crown-copyright/">© Crown copyright</a>
                </li>
                <li>
                  <a href="/privacy">Privacy notice</a>
                </li>
                <li>
                  <a href="/accessibility">Accessibility statement</a>
                </li>
                {
                  this.props.contactUsLink &&
                    <li>
                      <a href="/contact-us">Contact us</a>
                    </li>
                }
              </ul>

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
  homepageUrl: '/',
  propositionHeaderLink: '/',
  logoLinkTitle: '',
  skipToContent: 'Skip to main content',
  skipToContentTarget: '#content',
  footerLinks: [],
  contactUsLink: false,
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
  ),
  contactUsLink: PropTypes.bool
};

export default HomeOffice;
