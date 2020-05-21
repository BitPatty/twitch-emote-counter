[test]

# twitch-emote-counter

A simple emote counter for Twitch chats which can be embedded into OBS as browser source.

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

## Dependencies and Libraries

- The chat client at `src/components/Counter/TwitchClient.js` is based on the chatbot sample by Twitch, licensed under the Apache License v2.0:
  https://github.com/twitchdev/chat-samples/blob/f44723b627b1bf3bb5324dc3aafd4ceb446a8e75/javascript/chatbot.js

- See `package.json` for additional dependencies.
