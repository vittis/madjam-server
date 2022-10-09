import { Room, Client } from "colyseus";
import { Game } from "../modules/game-app/game/Game";
import { GameState, Player } from "./schema/GameState";

export class GameRoom extends Room<GameState> {
  history: any;

  onCreate(options: any) {
    this.maxClients = 2;
    this.setState(new GameState());

    const game = new Game();
    game.startGame();
    this.history = game.history;

    this.onMessage('askHistory', (client, message) => {
      client.send('sendHistory', { history: this.history });
    });


    this.onMessage('teste', (client, message) => {
      console.log('TESTE CHEGO');
      client.send("peidaNaRola");
    });
  }

  onJoin(client: Client, options: any) {
    console.log("GAME ROOM joined");
    this.state.players.set(client.sessionId, new Player());
    this.state.players.get(client.sessionId).name = options.name;
    this.state.players.get(client.sessionId).animal = options.animal;

    if (this.hasReachedMaxClients()) {
      console.log("REALLY START");
      this.broadcast("reallyStartGame")
    }
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
