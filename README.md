# Simple Frontend Boilerplate

Settings for launch
-----------------------------------

1. Install package manager [yarn](https://yarnpkg.com/).
```npm install -g yarn```
2. Run the command in the console ```yarn install```
3. Run the command in the console ```yarn start```
3. Open the project [in browser](http://localhost:3000)


Main command
-----------------------------------

```
lint-js - check correct js code
lint-css - check correct css code
lint - base command wich combine lint-js and lint-css
fix-js - formatting your js code
fix-css - formatting your css code
fix - base command wich combine fix-js and fix-css
start - command to start development server
build - build project
```

For example ```yarn start``` - launch server
It's not necessary to reload the page because we use Hot Module Replacement (HMR)


Main libraries
 -----------------------------------

- Twig
- postcss
- babel
- ES modules
- prettier
- eslint
- stylelint
- HMR
- Webpack 5


Structure folders
 -----------------------------------

For layout is used [Twig](https://dev-gang.ru/doc/twig/) template engine

    src
        /html - all templates
            /components - main components in a project
            /layout - base layout
            /pages - pages site

        /images - folder with images

        /js - folder with scripts
         /app.js - main file for build

        /styles - folder with styles
            /components - main style components
            /includes - folder with base style project

            /index.css - file that includes all settings and styles
