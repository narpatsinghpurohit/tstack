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
 const {
   exampleState,
   handleExampleStateChange
 } = ${pageName}Controller(props);
 // Getting data from Controller End
 return (
   <Box
     sx={styles.MainBox}
   >
     <Typography sx={styles.ExampleText}>Example State Value: {exampleState}</Typography>
     <Button sx={styles.ExampleButton} onClick={handleExampleStateChange}>Change Example State</Button>
   </Box>
 );
};

export default ${layout ? `withLayout(${layout})(${pageName});`:`${pageName}`}`;

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
    }
}