import { Room, Client } from "colyseus";
import { Player } from "./schema/GameState";
import { LobbyState } from "./schema/LobbyState";

const ANIMALS = ["FROG", "RAT", "BAT", "BIRD", "CRAB", "LIZARD"]

export class LobbyRoom extends Room<LobbyState> {
  onCreate(options: any) {
    this.setState(new LobbyState());

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
        this.state.players.get(client.sessionId).animal = chosenAnimal
      }

    });

    this.onMessage('createRoom', (client, message) => {
      console.log('createRoom')
      this.broadcast("listRooms");
    });

    this.onMessage('startGame', (client, message) => {
      console.log('startGame')
      this.state.players.forEach((value, key) => {
        if (value.isMatchmaking) {
          console.log('sending');
          const player = this.state.players.get(key);
          player.isMatchmaking = false;
          this.clients.find(c => c.sessionId === key).send('onStartGame', { name: player.name, animal: player.animal });
        }
      });
    })

  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new Player());
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
