"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyRoom = void 0;
const colyseus_1 = require("colyseus");
const GameState_1 = require("./schema/GameState");
const LobbyState_1 = require("./schema/LobbyState");
const ANIMALS = ["frog", "rat", "octopus"];
class LobbyRoom extends colyseus_1.Room {
    onCreate(options) {
        this.setState(new LobbyState_1.LobbyState());
        this.onMessage('setName', (client, message) => {
            this.state.players.get(client.sessionId).name = message.name;
        });
        this.onMessage('setIsMatchmaking', (client) => {
            let otherAnimal;
            let matchmaking = 0;
            this.state.players.forEach((value, key) => {
                if (value.isMatchmaking) {
                    otherAnimal = value.animal;
                    matchmaking++;
                }
            });
            if (matchmaking < 2) {
                this.state.players.get(client.sessionId).isMatchmaking = true;
                let chosenAnimal;
                do {
                    chosenAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
                } while (chosenAnimal === otherAnimal);
                this.state.players.get(client.sessionId).animal = chosenAnimal;
            }
        });
        this.onMessage('createRoom', (client, message) => {
            console.log('createRoom');
            this.broadcast("listRooms");
        });
        this.onMessage('startGame', (client, message) => {
            console.log('startGame');
            this.state.players.forEach((value, key) => {
                if (value.isMatchmaking) {
                    console.log('sending');
                    const player = this.state.players.get(key);
                    player.isMatchmaking = false;
                    this.clients.find(c => c.sessionId === key).send('onStartSetup', { name: player.name, animal: player.animal });
                }
            });
        });
    }
    onJoin(client, options) {
        //console.log(client.sessionId, "joined!");
        this.state.players.set(client.sessionId, new GameState_1.Player());
    }
    onLeave(client, consented) {
        console.log(client.sessionId, "left!");
        this.state.players.delete(client.sessionId);
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
exports.LobbyRoom = LobbyRoom;
