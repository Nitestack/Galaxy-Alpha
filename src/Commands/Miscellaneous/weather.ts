import Command, { CommandRunner } from "@root/Command";
import weather from "weather-js";

export default class WeatherCommand extends Command {
    constructor() {
        super({
            name: "weather",
            description: "shows the weather in a specific location",
            category: "miscellaneous",
            usage: "weather <location>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("Weather Manager")
            .setDescription("You have to provide a location!"));
        weather.find({ search: args.join(" "), degreeType: "F" }, (err, result) => {
            if (err) return console.log(err);
            if (result == undefined || result.length == 0) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("Weather Manager")
                .setDescription(`Cannot find the location \`${args.join(" ")}\`!`));
            const current = result[0].current;
            const location = result[0].location;

            return message.channel.send(client.createEmbed()
                .setTitle("Weather Manager")
                .setDescription(`**${current.skytext}**`)
                .setThumbnail(current.imageUrl)
                .addField('Timezone', `UTC ${location.timezone}`, true)
                .addField('Degree Type', 'Celsius', true)
                .addField('Temperature', `${current.temperature}° C`, true)
                .addField('Wind', current.winddisplay, true)
                .addField('Feels like', `${current.feelslike}° C`, true)
                .addField('Humidity', `${current.humidity}%`, true));
        });
    };
};