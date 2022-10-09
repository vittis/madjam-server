import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") name: string;
  @type("string") animal: string;

  @type("boolean") isMatchmaking: boolean = false;

  @type("boolean") setupReady: boolean = false;
}

export class GameState extends Schema {

  @type({ map: Player }) players = new MapSchema<Player>();

}
