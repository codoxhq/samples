import { useEffect } from "react";

const RealTimeTextAreaEditor = ({
  codox,
  docId,
  username,
  apiKey,
  model,
  updateContent,
}) => {
  useEffect(() => {
    // start codox collaboration
    if (codox) {
      startCollaboration();
    }
    //leave the session
    return () => codox && codox.stop();
  }, [docId, codox]); // eslint-disable-line

  const startCollaboration = () => {
    const config = {
      app: "text",
      username,
      user: { name: username }, //unique user name
      docId,
      apiKey,
      editor: document.getElementById("editor"),
      language: "ru",
      autoStart: true,
      debug: true,
      permission: { token: "fds afa", url: "http://", interval: 5000 },
      hooks: {
        // triggered on user reconnection
        fetchDocOnNetworkReconnect: () => {
          return { content: "Hello world!", timestamp: 45151513513 };
        },
        // triggered on users connect/disconnect
        usersUpdate: (data) => {
          console.log("users update hook, content: ", data);
        },
        // triggered on content updates
        contentChanged: function (data) {
          console.log("contentChanged hook", data);
        },
      },
    };

    window.editor = document.getElementById("editor");
    window.config = config;
    const codox = new window.Codox();
    window.codox = codox;
    codox.init(config);

    // subscribing to codox session events
    codox.on("users_update", function (data) {
      console.debug("[event] event on user_update", data);
    });
    codox.on("error", function (data) {
      console.log("error event", data);
    });
    codox.on("content_changed", function (data) {
      console.log("content_changed", data);
    });
    codox.on("access_changed", (data) => {
      console.log("access_changed", data);
    });
  };

  return <textarea id="editor" rows="50" cols="50"></textarea>;
};

export default RealTimeTextAreaEditor;
