module.exports = {
  getLayoutChoices: () => {
    const fs = require('fs');
    const path = require('path');
    const layoutsFolder = path.join(__dirname, '..', 'src/layouts');
    const layoutFiles = fs.readdirSync(layoutsFolder);

    return layoutFiles.map(layout => path.basename(layout, '.tsx'));
  },
  createPage: (pageName, layout = null) => {
    const fs = require('fs');
    const path = require('path');
    const pageDirectory = path.join(__dirname, '..', 'src', 'pages', pageName);
    // Create the directory for the new page
    fs.mkdirSync(pageDirectory);

    // Define the content for each file
    const tsxContent = `import React from 'react';
// Custom Imports Start
import ${pageName}Controller, { Props } from './${pageName}Controller';
import styles from './${pageName}.styles';
import { __ } from '../../common/i18/i18';
${layout && `import withLayout from '../../common/utilities/LayoutWrapper/withLayout';`}
${layout && `import ${layout} from '../../layouts/${layout}';`}

import { Box, Typography, Button } from '@mui/material'
// Custom Imports End

// UI
const ${pageName} = (props: Props) => {
 // Getting data from Controller Start
 const instance = ${pageName}Controller(props);
 // Getting data from Controller End
 return (
   <Box
     sx={styles.MainBox}
   >
     <Typography sx={styles.ExampleText}>Example State Value: {instance.exampleState}</Typography>
     <Button sx={styles.ExampleButton} onClick={instance.handleExampleStateChange}>Change Example State</Button>
   </Box>
 );
};

export default ${layout ? `withLayout(${layout})(${pageName});` : `${pageName}`}`;

    const controllerContent = `import { useState } from 'react';
import { generateRandomString } from '../../common/utilities/toolkit';

export type Props = {
 navigate: any,
 location: any,
 // Custom Props Start
 // Custom Props End
};

// Config
export const configJSON = require("./config");

// Controller
const ${pageName}Controller = (props: Props) => {
 // States Start
 const [exampleState, setExampleState] = useState("");
 // States End

 // Custom logic Start
 const handleExampleStateChange = () => {
   const randomString = generateRandomString(10);
   setExampleState(randomString);
 }
 // Custom logic End

 // Exporting states and logic
 return {
     exampleState,
     handleExampleStateChange
 };
};

export default ${pageName}Controller;
   `;

    const configContent = `"use-strict";
 Object.defineProperty(exports,
     "__esModule", {
         value:true
     }
 );

 // here all static string will be written like api endpoints, any static string
 exports.submit = "Submit"`;

    const assetsContent = `// from here all asset will be exported
 export const logo = "/assets/logo.svg";
   `;

    const styleContent = `// Mui sx styles that will be used inside the sx attribute
 const styles = {
     // here sx style objects are defined
     MainBox:{
       display:'flex',
       justifyContent:'center',
       alignItems:'center',
       flexDirection:'column'
     },
     ExampleText:{
       fontSize:24,
       fontWeight:600,
       marginTop:2,
       marginBottom:2
     },
     ExampleButton:{
       marginTop:2,
       marginBottom:2
     }
 }
 
 export default styles`;

    // Create and write the content to each file
    fs.writeFileSync(path.join(pageDirectory, `${pageName}.tsx`), tsxContent);
    fs.writeFileSync(path.join(pageDirectory, `${pageName}Controller.ts`), controllerContent);
    fs.writeFileSync(path.join(pageDirectory, 'config.js'), configContent);
    fs.writeFileSync(path.join(pageDirectory, 'assets.ts'), assetsContent);
    fs.writeFileSync(path.join(pageDirectory, `${pageName}.styles.ts`), styleContent);

    return true;
  },
  createRoute: (route, path) => {
    const fsAr = require('fs');
    const pathAr = require('path');
    const filePath = pathAr.join(__dirname, '..', 'src', 'routes.ts'); // Change the path accordingly

    const newImport = `import ${route} from "./pages/${route}/${route}";`;

    const newRoute = `    ${route}:{
        component:${route},
        path:'/${path}'
    },`;

    fsAr.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }

      const importPosition = data.indexOf('// autoImport');
      const modifiedContent = data.slice(0, importPosition) + newImport + '\n' + data.slice(importPosition);

      const routesPosition = modifiedContent.indexOf('// autoRoute');
      const modifiedContentWithRoute = modifiedContent.slice(0, routesPosition) + '\n' + newRoute + modifiedContent.slice(routesPosition);

      fsAr.writeFile(filePath, modifiedContentWithRoute, 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }
        console.log('Route added successfully!');
      });
    });

  },
  createComponent: (componentName) => {
    const fs = require('fs');
    const path = require('path');
    const componentDirectory = path.join(__dirname, '..', 'src', 'components', componentName);
    // Create the directory for the new page
    fs.mkdirSync(componentDirectory);

    // Define the content for each file
    const tsxContent = `import React from 'react';
// Custom Imports Start
import styles from './${componentName}.styles';
import { Box, Typography, Button } from '@mui/material'
// Custom Imports End

export type Props = {
  // Custom Props Start
  title:string;
  onClick:() => void
  // Custom Props End
};
 
// UI
const ${componentName} = (props: Props) => {
 const {title, onClick} = props;
 return (
   <Box
     sx={styles.MainBox}
   >
     <Typography sx={styles.ExampleText}>Example Component title: {title}</Typography>
     <Button sx={styles.ExampleButton} onClick={onClick}>Example Button</Button>
   </Box>
 );
};

export default ${componentName}`;


    const styleContent = `// Mui sx styles that will be used inside the sx attribute
 const styles = {
     // here sx style objects are defined
     MainBox:{
       display:'flex',
       justifyContent:'center',
       alignItems:'center',
       flexDirection:'column'
     },
     ExampleText:{
       fontSize:24,
       fontWeight:600,
       marginTop:2,
       marginBottom:2
     },
     ExampleButton:{
       marginTop:2,
       marginBottom:2
     }
 }
 
 export default styles`;

    fs.writeFileSync(path.join(componentDirectory, `${componentName}.tsx`), tsxContent);
    fs.writeFileSync(path.join(componentDirectory, `${componentName}.styles.tsx`), styleContent);
    return true;
  }
}