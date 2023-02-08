require('dotenv').config();
const chalk = require('chalk');

module.exports = {
    name: "error",
    async execute(error) {
        if(process.env.ENV !== 'Production') {
            console.warn(chalk.bgHex('#FF0000').bold(error));
        }
    } 
}