import { configs } from "../configs";
import { Firmware } from "../domain/Firmware";

const TelegramBot = require("node-telegram-bot-api");

export default (firmware: Firmware): void => {
  const bot = new TelegramBot(configs.telegram.token);

  var firmwareName = escapeChars(firmware.name);
  var firmwareVersion = escapeChars(firmware.version);
  const beta = firmware.isBeta;
  const release = firmware.isReleased;
  const jenkinsLink = escapeChars(firmware.jenkinsLink);
  const message = `[Atlas Firmware versions registry](http://10.5.6.12:8050) new version added
    *name:* ${firmwareName} 
    *version:* ${firmwareVersion}
    *jenkins:* ${jenkinsLink}
    *beta:* ${beta}
    *release:* ${release}`;

  bot.sendMessage(configs.telegram.chatId, message, {
    parse_mode: "MarkdownV2",
  });
};

function escapeChars(str: string) {
  var newsStr = str.replace(new RegExp("-", "g"), "\\-");
  newsStr = newsStr.replace(new RegExp("\\.", "g"), "\\.");
  newsStr = newsStr.replace(new RegExp("_", "g"), "\\_");
  return newsStr;
}
