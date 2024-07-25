import { EventEmitter } from "events"
import { DEFAULT_SETTINGS } from "@constants/settings"

export class Settings extends EventEmitter {
  public object = DEFAULT_SETTINGS

  public constructor() {
    super()
  }
}
