import React from 'react';
import PropTypes from 'prop-types';

class PhaseBanner extends React.Component {

  renderContent() {
    if (this.props.content) {
      return this.props.content;
    } else if (this.props.feedbackUrl) {
      return <span className="govuk-phase-banner__text">
        This is a new service – your <a href={this.props.feedbackUrl} className="govuk-link">feedback</a> will help us to improve it.
      </span>;
    }
  }

  render() {
    return <div className="govuk-phase-banner">
      <div className="govuk-width-container">
        <p className="govuk-phase-banner__content">
          <strong className="govuk-tag govuk-phase-banner__content__tag">{this.props.phase}</strong>
          { this.renderContent() }
        </p>
      </div>
    </div>;
  }

}

PhaseBanner.defaultProps = {
  phase: 'alpha'
};

PhaseBanner.propTypes = {
  phase: PropTypes.oneOf(['prototype', 'alpha', 'beta']),
  feedbackUrl: PropTypes.string
};

export default PhaseBanner;
