const AWS = require('aws-sdk');

module.exports = settings => {
  const config = {
    apiVersion: '2006-03-01',
    region: settings.s3.region,
    accessKeyId: settings.s3.accessKey,
    secretAccessKey: settings.s3.secret
  };

  if (settings.s3.localstackUrl) {
    // force the client to use path based URLs instead of subdomains, e.g. http://localhost/bucket instead of http://bucket.localhost
    // will be renamed to forcePathStyle in v3 sdk
    config.s3ForcePathStyle = true;
    config.endpoint = settings.s3.localstackUrl;
  }

  return new AWS.S3(config);
};
