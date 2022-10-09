import { Room, Client } from "colyseus";
import { Game } from "../modules/game-app/game/Game";
import { GameState, Player } from "./schema/GameState";
import AllData from '../modules/game-app/game/data';


export class GameRoom extends Room<GameState> {
  history: any;
  winner: any;
  teamOne: any = {};
  teamTwo: any = {};

  onCreate(options: any) {
    this.maxClients = 2;
    this.setState(new GameState());



    this.onMessage('askHistory', (client, message) => {
      client.send('sendHistory', { history: this.history, winner: this.winner, players: this.state.players, myTeam: this.state.players.get(client.sessionId).team, myAnimal: this.state.players.get(client.sessionId).animal });
    });

    this.onMessage('askData', (client, message) => {
      client.send('sendData', { data: AllData, myAnimal: this.state.players.get(client.sessionId).animal });
    });

    this.onMessage('confirmSelection', (client, message) => {
      this.state.players.get(client.sessionId).setupReady = true;
      let isReady = 0;
      this.state.players.forEach((value, key) => {
        if (value.setupReady) {
          isReady++;
        }

      });
      if (isReady === 1) {
        this.teamOne = { player: this.state.players.get(client.sessionId).team, id: client.sessionId, squad: message.squad };
      } else {
        this.teamTwo = { player: this.state.players.get(client.sessionId).team, id: client.sessionId, squad: message.squad };
      }
      console.log({ isReady })
      if (isReady === 2) {
        this.broadcast("startGame");
        console.log("PLS");

        const game = new Game(this.teamOne, this.teamTwo);
        game.startGame();
        this.history = game.history;
        this.winner = game.getWinner();
        /* {
          v4LDXlMuo: [
            {
              from: 'v4LDXlMuo',
              background: 'Soldado',
              weapon: undefined,
              armor: undefined,
              helmet: undefined
            }
          ],
          Obt6mC5io: [
            {
              from: 'Obt6mC5io',
              background: 'Recruta',
              weapon: undefined,
              armor: undefined,
              helmet: undefined
            }
          ]
        } */
      }
    });

  }

  onJoin(client: Client, options: any) {
    console.log("GAME ROOM joined");
    this.state.players.set(client.sessionId, new Player());
    this.state.players.get(client.sessionId).name = options.name;
    this.state.players.get(client.sessionId).animal = options.animal;

    this.state.players.get(client.sessionId).team = "P1";



    if (this.hasReachedMaxClients()) {
      this.state.players.get(client.sessionId).team = "P2";

      console.log("REALLY START");
      /* this.state.players.forEach((value, key) => {
        
      }); */
      this.broadcast("reallyStartSetup");
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
