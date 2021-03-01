import Queue from "@commands/Music/Queue";
import Event, { EventRunner } from "@root/Event";
import { VoiceState } from "discord.js";

export default class VoiceStateUpdateEvent extends Event {
    constructor() {
        super({
            name: "voiceStateUpdate"
        });
    };
    run: EventRunner = async (client, oldState: VoiceState, newState: VoiceState) => {
        if (newState && newState.id == client.user.id && !newState.channel.id) {
            const queue = client.queue.find(gQueue => gQueue.connection && gQueue.connection.channel.id == oldState.channel.id);
            if (!queue) return;
            try { 
                newState.channel.leave();
            } catch { 
                client.queue.delete(queue.connection.channel.guild.id); 
            };
        };
        if (oldState && oldState.channel) {
            const queue = client.queue.find(gQueue => gQueue.connection && gQueue.connection.channel.id == oldState.channel.id);
            if (queue && this._isVoiceChannelEmpty(queue)) {
                setTimeout(() => {
                    if (client.queue.has(queue.connection.channel.guild.id) && this._isVoiceChannelEmpty(queue)) queue.connection.channel.leave();
                }, 60000);
            };
        };
    };
    private _isVoiceChannelEmpty(queue: Queue) {
        let voiceChannel = queue.connection.channel;
        let members = voiceChannel.members.filter(m => !m.user.bot);
        return !members.size;
    };
};