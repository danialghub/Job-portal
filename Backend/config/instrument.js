// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://9974c928910446bca85b9d8e84520b49@o4509888008093696.ingest.us.sentry.io/4509888018317312",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  integrations : [
    Sentry.mongooseIntegration()
  ],
  sendDefaultPii: true,
});