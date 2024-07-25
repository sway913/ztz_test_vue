import { app } from 'electron';
import { Application } from "./application";

export const isNightly = app.name === "lunarwolf-nightly";

app.name = isNightly ? "lunarwolf Nightly" : "LunarWolf";

const application = Application.instance;
(async () => {
  await application.start();
})();
