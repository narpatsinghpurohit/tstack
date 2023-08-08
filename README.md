## Starter Kit doc
This starter kit contains code structure that will standardise the codebase.
- It is using mui v5 as styling library
- It uses funtional components of react


## Directory Structure
- src
- ├── common - this folder will contain common configurations.
- │   ├── i18 - i18next configuration for language translation
- │   │   ├── translations
- │   │   │   └── en.json
- │   │   └── i18.ts
- │   └── utilities
- │       ├── LayoutWrapper - LayoutWrapper for using multiple layouts with pages
- │       │   └── withLayout.tsx - withLayout HOC 
- │       └── toolkit.ts - common util funtion such as generating random string
- ├── components - this directory will contain all the reusable components
- │   ├── Button - Example for a button
- │   │   └── OutlinedButton.tsx
- │   └── Header - Example of Common Header
- │       ├── Header.styles.ts
- │       └── Header.tsx
- ├── layouts - this directory will contains all the layouts that will be used 
- │   └── MainLayout.tsx - Example layout
- ├── pages - All the pages will be defined inside this, same will be the routes
- │   ├── Home - Home Page
- │   │   ├── assets.ts - all the asset will be exported from this file
- │   │   ├── config.js - all the configuration such as apiEndpoints, api types, etc will be defined here
- │   │   ├── HomeController.tsx - All the business logic will be defined in this hook, including states, props, funtions, etc...
- │   │   ├── Home.styles.ts - style will be defined inside this(mui v5 sx style example used in this)
- │   │   └── Home.tsx - Main View file that will contain only the TSX or view elements
- │   ├── Login - Example Route
- │   │   ├── assets.ts
- │   │   ├── config.js
- │   │   ├── LoginController.ts
- │   │   ├── Login.styles.ts
- │   │   └── Login.tsx
- │   └── SignUp - Example Route
- │       ├── assets.ts
- │       ├── config.js
- │       ├── SignUpController.ts
- │       ├── SignUp.styles.ts
- │       └── SignUp.tsx
- ├── App.css
- ├── App.test.tsx
- ├── App.tsx 
- ├── index.css
- ├── index.tsx
- ├── logo.svg
- ├── react-app-env.d.ts
- ├── reportWebVitals.ts
- ├── routes.tsx - all routes will be defined here
- ├── setupTests.ts
- └── WebRouteGenerator.js - WIP


## Creating New Page with CLI
- before this do 
```properties 
npm install
``` 
- added script that will generate a new page with all the files with example code
- to create new page use the following command
```properties 
npm run generate
```
- page name should be in CamelCase

## Upcomming feature
- Login and SignUp Page

## Guide
- using sx style of mui v5 - https://www.youtube.com/watch?v=hHMkuXjRZHY
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

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

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

