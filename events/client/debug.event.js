require('dotenv').config();
const chalk = require('chalk');

module.exports = {
    name: "debug",
    async execute(debug) {
        if(process.env.ENV !== 'Production') {
            console.warn(chalk.hex('#FFA500').bold(debug));
        }
    } 
}