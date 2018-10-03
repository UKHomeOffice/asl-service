# asl-service

Module for rapid bootstrapping of an express app for a Home Office design system themed, react-based ui or api with
logging, authentication and session handling configured as appropriate.

## Usage

### UI

```js
const ui = require('asl-service/ui');
const app = ui(settings);

app.use(/* mount your middleware and routes here */);

app.listen(port);
```

#### Static middleware

If you wish to mount middleware before the session and auth handlers in a UI app you can do so with `app.static.use`
which will mount your handlers before any dynamic middlewares are mounted.

This is primarily expected to be used for css, js or image assets.

### API

```js
const api = require('asl-service/api');
const app = api(settings);

app.use(/* mount your middleware and routes here */);

app.listen(port);
```

### Settings

An example settings object looks like this:

```js
{
  auth: {
    // all apps
  },
  session: {
    // ui only
  }
}
```

#### auth

Both UI and API applications will mount keycloak authentication middlewares. This requires the following properties to
be set:

* `realm`
* `url`
* `client`
* `secret`

The values for these can be found in the `Installation` tab of your client's settings in the keycloak admin console.
Select the `Keycloak OIDC JSON` option.

Once the auth middleware has been mounted, subsequent requests will have a `req.user` property with basic information
about the logged in user.

##### User roles

You can limit access to routes to particular user roles by either checking the user's role directly with
`req.user.is('role')` or by protecting the routes with `app.protect('role')`.

Examples:

```js
const api = require('asl-service/api');
const app = api(settings);

app.protect('administrator');
app.use(/* only users with the `administrator` role will be able to access routes mounted here */);

app.listen(port);
```

```js
app.use((req, res, next) => {
  if (!req.user.is('administrator')) {
    return next(new Error('Access denied'));
  }
});
```

#### session

UI applications also require session storage configuration to be set.

* `secret`
* `host` - redis host
* `port` - redis port
* `password` - redis password if required

Other session configuration settings are [documented here](https://github.com/lennym/redis-session/blob/master/README.md).

#### Other settings

UI applications can also use the following settings:

* `assets` - defines a folder that will be served as static assets - default: `./public`
* `views` - defines the location of the application's views - default `./views`
