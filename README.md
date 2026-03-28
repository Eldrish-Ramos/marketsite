# MarketSite

## Contact Form Email Setup

The buyer contact form sends submissions to the backend route `POST /api/contact`, which then sends an email to `eldrishsells@gmail.com`.

Add these environment variables to your root `.env` file before using the contact form:

```env
CONTACT_EMAIL_TO=eldrishsells@gmail.com
CONTACT_EMAIL_FROM=eldrishsells@gmail.com
CONTACT_SMTP_HOST=smtp.gmail.com
CONTACT_SMTP_PORT=587
CONTACT_SMTP_SECURE=false
CONTACT_SMTP_USER=eldrishsells@gmail.com
CONTACT_SMTP_PASS=your-gmail-app-password
```

For Gmail, use a Google app password instead of your normal account password. If two-factor authentication is not enabled on the Gmail account, enable it first, then create an app password for mail access.

The route validates required fields and rate-limits repeated requests from the same IP address.

## Security Configuration

Set the following environment variables in your root `.env` for hardened production behavior:

```env
# JWT for admin auth (required)
ADMIN_JWT_SECRET=replace-with-64-char-random-secret
ADMIN_JWT_EXPIRES_IN=8h
ADMIN_LOGIN_MAX_ATTEMPTS=5
ADMIN_LOGIN_LOCKOUT_MINUTES=15

# CORS and reverse proxy behavior
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
TRUST_PROXY=1

# Firebase admin credential via env (JSON or base64 JSON)
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
# or
# FIREBASE_SERVICE_ACCOUNT_BASE64=base64-encoded-json
```

Do not commit `.env`, `server/.env`, or any service-account JSON file.

## Dependency Modernization Plan

The project currently depends on Create React App (`react-scripts`), which pulls legacy transitive dependencies.

Recommended phased plan:

1. Migrate frontend build tooling to Vite.
2. Upgrade React Router and testing setup after the Vite migration compiles cleanly.
3. Run `npm audit` after migration and patch remaining high-impact advisories.
4. Add CI checks for `npm audit --omit=dev` and dependency updates.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
