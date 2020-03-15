/* eslint-disable */

export default class TwitchClient {
  channelName = "";
  userName = "justinfan12345";
  server = "irc-ws.chat.twitch.tv";
  port = 443;
  webSocket = null;
  callbackFunctions = [];
  emoteRegex = /emotes=[^;]+/;
  additionalEmotes = [];

  ffzGlobalEmotes = "https://api.frankerfacez.com/v1/set/global";
  ffzChannelEmotes = null;
  bttvGlobalEmotes = "https://api.betterttv.net/3/cached/emotes/global";
  bttvChannelEmotes = null;

  constructor(channelName) {
    this.channelName = channelName.trim().toLowerCase();
    this.ffzChannelEmotes = `https://api.frankerfacez.com/v1/room/${this.channelName}`;
    this.bttvChannelEmotes = `https://api.betterttv.net/2/channels/${this.channelName}`;
    this._loadThirdPartyEmotes();
    this._registerUnloadEvent();
  }

  open() {
    this.webSocket = new WebSocket(
      "wss://" + this.server + ":" + this.port + "/",
      "irc"
    );
    this.webSocket.onmessage = this.onMessage.bind(this);
    this.webSocket.onclose = this.onClose.bind(this);
    this.webSocket.onopen = this.onOpen.bind(this);
  }

  registerEmoteCallback(callback) {
    this.callbackFunctions.push(num => callback(num));
  }

  onMessage(message) {
    if (message !== null) {
      var parsed = this.parseMessage(message.data);
      if (parsed !== null) {
        if (parsed.command === "PRIVMSG") {
          let emoteCount = 0;

          if (message.data) {
            emoteCount += this._countTwitchEmotes(parsed.tags);
            emoteCount += this._countEmoji(parsed.message);
            emoteCount += this._countAdditionalEmotes(parsed.message);

            if (emoteCount > 0) {
              for (let i = 0; i < this.callbackFunctions.length; i++)
                this.callbackFunctions[i](emoteCount);
            }
          }
        }
      } else if (parsed.command === "PING") {
        this.webSocket.send("PONG :" + parsed.message);
      }
    }
  }

  async _loadThirdPartyEmotes() {
    await this._loadFFZEmotes(this.ffzGlobalEmotes);
    await this._loadFFZEmotes(this.ffzChannelEmotes);
    await this._loadBTTVEmotes(this.bttvChannelEmotes);
  }

  async _loadFFZEmotes(url) {
    fetch(url)
      .then(res => {
        if (res.ok) {
          res
            .json()
            .then(json => {
              for (let s in json.sets) {
                for (let e in json.sets[s].emoticons) {
                  this.additionalEmotes.push(json.sets[s].emoticons[e].name);
                }
              }
            })
            .catch();
        }
      })
      .catch();
  }

  async _loadBTTVEmotes(url) {
    fetch(url)
      .then(res => {
        if (res.ok) {
          res
            .json()
            .then(json => {
              for (let i = 0; i < json.emotes.length; i++) {
                this.additionalEmotes.push(json.emotes[i].code);
              }
            })
            .catch();
        }
      })
      .catch();

    fetch(this.bttvGlobalEmotes)
      .then(res => {
        if (res.ok) {
          res
            .json()
            .then(json => {
              for (let i = 0; i < json.length; i++) {
                this.additionalEmotes.push(json[i].code);
              }
            })
            .catch();
        }
      })
      .catch();
  }

  _countTwitchEmotes(tags) {
    let m = this.emoteRegex.exec(tags);
    let c = 0;

    if (m && m.length > 0) {
      c += (m[0].match(/[:,]/g) || []).length;
    }

    return c;
  }

  _countEmoji(str) {
    if (str) {
      return (
        Array.from(str.split(/[\ufe00-\ufe0f]/).join("")).length -
        Array.from(
          str
            .replace(
              /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
              ""
            )
            .split(/[\ufe00-\ufe0f]/)
            .join("")
        ).length
      );
    } else {
      return 0;
    }
  }

  _countAdditionalEmotes(str) {
    if (str) {
      let w = str.split(/\s+/);
      let c = 0;

      for (let i = 0; i < w.length; i++)
        if (this.additionalEmotes.includes(w[i])) c++;
      return c;
    }

    return 0;
  }

  _registerUnloadEvent() {
    window.onbeforeunload = function() {
      if (this.webSocket != null) {
        this.webSocket.onclose = function() {};
        this.webSocket.close();
      }
    };
  }

  onOpen() {
    var socket = this.webSocket;

    if (socket !== null && socket.readyState === 1) {
      console.log("Connecting..");
      socket.send(
        "CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership"
      );
      socket.send(`NICK ${this.userName}`);
      socket.send(`JOIN #${this.channelName}`);
    }
  }

  onClose() {
    console.log("Disconnected from the chat server.");
    this.open();
  }

  close() {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }

  parseMessage(rawMessage) {
    var parsedMessage = {
      message: null,
      tags: null,
      command: null,
      original: rawMessage,
      channel: null,
      username: null
    };

    if (rawMessage[0] === "@") {
      var tagIndex = rawMessage.indexOf(" "),
        userIndex = rawMessage.indexOf(" ", tagIndex + 1),
        commandIndex = rawMessage.indexOf(" ", userIndex + 1),
        channelIndex = rawMessage.indexOf(" ", commandIndex + 1),
        messageIndex = rawMessage.indexOf(":", channelIndex + 1);

      parsedMessage.tags = rawMessage.slice(0, tagIndex);
      parsedMessage.username = rawMessage.slice(
        tagIndex + 2,
        rawMessage.indexOf("!")
      );
      parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
      parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
      parsedMessage.message = rawMessage.slice(messageIndex + 1);
    } else if (rawMessage.startsWith("PING")) {
      parsedMessage.command = "PING";
      parsedMessage.message = rawMessage.split(":")[1];
    }

    return parsedMessage;
  }
}
