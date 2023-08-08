const utils = require('./utils');

const { Select, Input } = require('enquirer');

module.exports = {
    init: () => {
        return new Select({
            name: 'option',
            message: 'What do you want to create?',
            choices: [
                { message: 'A. Page', value: 'page' },
                { message: 'B. Component', value: 'component' },
            ],
        });
    },
    enterPageName: () => new Input({
        message: 'Enter the name of the Page in CamelCase:',
        result(name) {
            return name.trim();
        },
    }),
    askForLayout: () => new Select({
        name: 'useLayout',
        message: 'Do you want to use Layout as well?',
        choices: ['Yes', 'No'],
    }),
    selectLayout: (choices) => new Select({
        name: 'layoutChoice',
        message: 'Select a layout:',
        choices: choices,
    }),
    askForRoute: () => new Select({
        name: 'askForRoute',
        message: 'Do you want to add route as well?',
        choices: ['Yes', 'No'],
    }),
    askForRoutePath: () => new Input({
        message: 'Enter the route path(this will reflect in url(https:website/route-path)):',
        result(name) {
            return name.trim();
        },
    }),
};
