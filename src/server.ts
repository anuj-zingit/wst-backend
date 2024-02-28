import app from "./app";
import { Config } from "./config/Config";

const PORT = Config.getInstance().getPort();

app.initializeConfig.then(() => {
  var server = app.expressApp.listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
  });
  server.setTimeout(600000);
});
