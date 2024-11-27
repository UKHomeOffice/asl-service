const { useSelector } = require('react-redux');
const { set } = require('lodash');

const flags = {
  FEATURE_NAMED_PERSON_MVP: 'feature-named-person-mvp'
};

// noinspection JSUnusedGlobalSymbols
module.exports = {
  middleware(req, res, next) {
    set(res.locals, 'static.keycloakRoles', req.user?.keycloakRoles ?? []);
    req.hasFeatureFlag = (flag) => (req.user.keycloakRoles ?? []).includes(flag);
    next();
  },
  useFeatureFlag(flag) {
    const roles = useSelector(state => state.static.keycloakRoles ?? []);
    return roles.includes(flag);
  },
  ...flags
};
