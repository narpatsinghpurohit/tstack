const prompts = require('./prompts'); 
const utils = require('./utils');

const initPrompt = prompts.init();
const pageNamePrompt = prompts.enterPageName();

initPrompt.run().then(answer => {
    if (answer === 'page') {
        pageNamePrompt.run().then(pageName => {
            prompts.askForLayout().run().then(layoutResponse => {
                if(layoutResponse === 'Yes'){
                    const layouts = utils.getLayoutChoices();
                    prompts.selectLayout(layouts).run().then(layout => {
                        if(utils.createPage(pageName, layout)){
                            console.log(`${pageName} page has been created successfully.`);
                            prompts.askForRoute().run().then(routeResponse => {
                                if(routeResponse === 'Yes'){
                                    prompts.askForRoutePath().run().then(pathName => {
                                        utils.createRoute(pageName, pathName);
                                    }).catch(console.error())
                                }
                            }).catch(console.error())
                        }else{
                            console.log("Something went wrong")
                        }
                    }).catch(console.error)
                }else{
                    if(utils.createPage(pageName)){
                        console.log(`${pageName} page has been created successfully.`);
                    }else{
                        console.log("Something went wrong")
                    }
                }
            }).catch(console.error)
        }).catch(console.error);
    }else if(answer === 'component'){
        prompts.componentNameInput().run().then(componentName => {
            utils.createComponent(componentName);
            console.log(`${componentName} generated successfully`)
        }).catch(console.error())
    }
}).catch(console.error);