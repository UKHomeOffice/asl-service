import React from 'react';
import ReactMarkdown from 'react-markdown';

const content = `# Cookies
This service puts small files (known as ‘cookies’) onto your computer in order to temporarily store information you
enter. The cookies we use don’t identify you personally.

## Session cookies
Session cookies are downloaded each time you visit the service and deleted when you close your browser. They help the
service to work properly.

Name | Purpose | Expires
-----|---------|--------
sid | Stores a session ID and temporarily stores data you enter to enable you to use the service | After 30 minutes of inactivity`;

export default () => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <ReactMarkdown escapeHtml={false}>{ content }</ReactMarkdown>
      </div>
    </div>
  );
};
