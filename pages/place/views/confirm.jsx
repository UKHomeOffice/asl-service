import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import App from '../../common/views/app';
import Diff from '../../common/views/containers/diff';
import getFields from '../fields';
import Snippet from '../../common/views/containers/snippet';
import { joinAcronyms } from '../../common/formatters';

const formatters = {
  suitability: { format: joinAcronyms },
  holding: { format: joinAcronyms },
  nacwo: { format: val => get(val, 'profile.name') }
};

const fields = getFields(formatters);

const Confirm = ({
  establishment: {
    name,
    licenceNumber,
    pelh: {
      name: pelhName
    }
  },
  ...props
}) => (
  <App { ...props }>
    <div className="grid-row">
      <div className="column-two-thirds">
        <header>
          <h2>&nbsp;</h2>
          <h1><Snippet>pages.place.confirm</Snippet></h1>
        </header>
        <dl className="inline">
          <dt><Snippet>establishment</Snippet></dt>
          <dd>{ name }</dd>

          <dt><Snippet>licenceNumber</Snippet></dt>
          <dd>{ licenceNumber }</dd>

          <dt><Snippet>licenceHolder</Snippet></dt>
          <dd>{ pelhName }</dd>
        </dl>
        <hr />
        <Diff formatters={fields} />
        <div className="control-bar block">
          <p><Snippet>confirm.declaration</Snippet></p>
          <form method="POST">
            <input type="hidden" name="submit" value="true" />
            <input type="submit" className="button" value={() => <Snippet>buttons.submit</Snippet>} />
          </form>
          <a href="?edit=true"><Snippet>buttons.edit</Snippet></a>
          <a href="?clear=true"><Snippet>buttons.cancel</Snippet></a>
        </div>
      </div>
    </div>
  </App>
);

const mapStateToProps = ({ establishment }) => ({ establishment });

export default connect(mapStateToProps)(Confirm);
