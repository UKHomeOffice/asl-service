const React = require('react');
const sandbox = require('sinon').createSandbox();
const { render } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { configureStore } = require('redux-mock-store');
const assert = require('assert');
const { middleware, useFeatureFlag } = require('../../ui/feature-flag');

function getFakeReq(features = []) {
  return {
    user: {
      keycloakRoles: ['basic-role', ...features]
    }
  };
}

describe('Feature flags', () => {
  afterEach(() => {
    sandbox.restore();
  });

  describe('Express middleware', () => {
    it('Copies the user roles to redux static store', () => {
      const fakeReq = getFakeReq(['feature-a']);
      const fakeRes = {locals: {}};
      const nextStub = sandbox.stub();

      middleware(fakeReq, fakeRes, nextStub);

      assert.equal(fakeRes.locals.static.keycloakRoles.length, 2);
      assert(fakeRes.locals.static.keycloakRoles.includes('feature-a'), 'Feature A should be in the role list');
      assert(fakeRes.locals.static.keycloakRoles.includes('basic-role'), 'Basic user role should be in the role list');
      assert(nextStub.calledOnce, '');
    });

    it('Can test if a feature is enabled', () => {
      const fakeReq = getFakeReq(['feature-a']);
      const fakeRes = {locals: {}};
      const nextStub = sandbox.stub();

      middleware(fakeReq, fakeRes, nextStub);

      assert(fakeReq.hasFeatureFlag('feature-a'), 'Feature A should be enabled');
      assert(!fakeReq.hasFeatureFlag('feature-b'), 'Feature B should be disabled');
    });
  });

  describe('React hook', () => {
    const MockReduxProvider = ({state, children}) => {
      return <Provider store={configureStore([])(state)}>{children}</Provider>;
    };

    const TestComponent = ({role}) => {
      const hasRole = useFeatureFlag(role);

      return <p>{hasRole ? 'Has role' : 'Missing role'}</p>;
    };

    it('Can test if a role is present', async () => {
      const component = render(
        <MockReduxProvider state={{static: {keycloakRoles: ['base-role', 'feature-a']}}}>
          <TestComponent role="feature-a" />
        </MockReduxProvider>
      );

      assert.notEqual(await component.queryByText('Has role'), null);
    });

    it('Can test if a role is missing', async () => {
      const component = render(
        <MockReduxProvider state={{static: {keycloakRoles: ['base-role', 'feature-a']}}}>
          <TestComponent role="feature-b" />
        </MockReduxProvider>
      );

      assert.notEqual(await component.queryByText('Missing role'), null);
    });
  });
});
