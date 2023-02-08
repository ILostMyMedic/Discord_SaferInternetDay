const { Events } = require("../validations/events.validation.js");
const { readdirSync } = require("fs");

function loadEvents(client, chalk) {
    client.removeAllListeners();
    // outside of handlers find ./events folder
    const folders = readdirSync(`${__dirname}/../events`);
    let count = 0;
    for (const folder of folders) {
        const files =
            readdirSync(`${__dirname}/../events/${folder}`)
                .filter((file) => file.endsWith(".js"));

        for (const file of files) {
            const event = require(`../events/${folder}/${file}`);
            count++;

            if(!Events.includes(event.name) || !event.name) {
                console.warn(`event ${file} dont have a valid name`);
                return;
            }

            if (event.rest) {
                if (event.once)
                    client.rest.once(event.name, (...args) =>
                        event.execute(...args, client, chalk)
                    );
                else
                    client.rest.on(event.name, (...args) =>
                        event.execute(...args, client, chalk)
                    );
            } else {
                if (event.once)
                    client.once(event.name, (...args) => event.execute(...args, client, chalk))
                else client.on(event.name, (...args) => event.execute(...args, client, chalk))
            }

            continue;
        }
    }
    return;
}
module.exports = { loadEvents };
