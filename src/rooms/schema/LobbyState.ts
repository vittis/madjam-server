import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "./GameState";


export class LobbyState extends Schema {

  @type({ map: Player }) players = new MapSchema<Player>();

}
