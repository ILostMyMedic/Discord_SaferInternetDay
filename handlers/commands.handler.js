require("dotenv").config();
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const { readdirSync } = require("fs");

async function loadCommands(client, chalk) {
	const { readdirSync } = require("fs");



	let commandsArray = [];
	let developerArray = [];

	const commandsFolder = readdirSync("./commands");
	let commands = 0;
	let devCommands = 0;

	(await PG(`./commands/**/*.js`)).map(async (file) => {
		const commandFile = require(`.${file}`);

		// split into folders
		const split = file.split("/");
		const folder = split[2];

		client.commands.set(commandFile.data.name, commandFile);

		if (folder === "Developer" && process.env.ENV !== "Production") {
			developerArray.push(commandFile.data.toJSON());
			devCommands++;
		} else {
			commandsArray.push(commandFile.data.toJSON());
			commands++;
		}
	});

	if (process.env.ENV === "Production") {
		client.application.commands
			.set(commandsArray)
			.then(
				console.log(
					chalk.italic.greenBright(
						`${commands} Global Command(s) Loaded`
					)
				)
			);
	} else {
		const developerGuild = client.guilds.cache.get(process.env.dev);
		developerGuild.commands
			.set(developerArray)
			.then(
				console.log(
					chalk.italic.magentaBright(
						`${devCommands} Developer Command(s) Loaded`
					)
				)
			);
	}
}

module.exports = { loadCommands };
