import React from 'react';
import App from './app';

class Index extends React.Component {
  render() {
    return (
      <App
        {...this.props}
        noScripts={true}
      >
        <h1 className="heading-large">{this.props.error.message}</h1>
        <pre>
          {this.props.error.stack}
        </pre>
      </App>
    );
  }
}

export default Index;
