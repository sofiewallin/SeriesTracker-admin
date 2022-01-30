# Series Tracker Administration

This is a small application that handles administration of series for an application called Series Tracker. I have developed this application, a [REST API](https://github.com/sofiewallin/SeriesTracker-REST-API) and the [main application](https://github.com/sofiewallin/SeriesTracker-web-app) as part of a school project. The purpose of the project was to learn how to create a REST API using Node.js, Express and MongoDB and then consume the API in a web application using a JavaScript framework.

Series Tracker allows a user to track all the series they are watching, that they want to watch or that they have already watched. When the user adds series they can choose to add it as "Watching now", "Watch next" or "Have watched" and the user can also mark which episodes they have watched and get an overview of which episodes to watch next. At this point there is no registering function for the application and it runs on only one user.

## The application

The application was developed using Node.js, Express, Webpack and React. It uses an Express server to handle the routing in production and React for developing client side. Webpack bundles the React code. This application shares one user with the main application to be able to log in to the API. At this point, no registering function have been developed due to lack of time in the project. If it had, users with separate roles would be allowed in to the different applications. One with the role of admin would be allowed to access this application.

## Using this repository and the application

This is what you need to know if you want to clone this repository and run this application:

- To get `node_modules/` you need to run the command `npm install`.
- The API has three scripts in `package.json`, one for starting the server (`npm start`), one for running the development environment (`npm run devStart`) and one for building the application for production (`npm run build`). The entry point for the Express server is `server.js`, the entrypoint for Webpack is `src/index.js`and the main file for the React-application is `src/components/App.js`.
- Webpack has three config files, one for development (`webpack.dev.js`), one for production (`webpack.prod.js`) and one for general settings (`webpack.common.js`).
- The Express server sets `dist/` as a static directory and makes sure that all routes in application renders through `index.html` in this folder.
- This application is connected to a [published API](https://series-tracker-rest-api.herokuapp.com) in the `App.js` file. Read more about user limitations for the API and the application in the [repository for this API](https://github.com/sofiewallin/SeriesTracker-REST-API).




