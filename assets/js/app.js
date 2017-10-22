    import "phoenix_html"
    import {Socket, Presence} from "phoenix"

    // Socket
    let user = document.getElementById("User").innerText // hello
    let socket = new Socket("/socket", {params: {user: user}})
    socket.connect()

    // Presence
    let presences = {}

    let formatTimestamp = (timestamp) => {
      let date = new Date(timestamp)
      return date.toLocaleTimeString()
    }
    let listBy = (user, {metas: metas}) => {
      return {
        user: user,
        onlineAt: formatTimestamp(metas[0].online_at)
      }
    }

    let userList = document.getElementById("UserList")
    let render = (presences) => {
      userList.innerHTML = Presence.list(presences, listBy)
        .map(presence => `
          <li>
            <b>${presence.user}</b>
          </li>
        `)
        .join("")
    }

    // Channels
    let chat = socket.channel("search:chat", {})
    let ai = socket.channel("search:ai", {})
    console.log("Joined ai channel")


    ai.on("shout", paylaod => {
      console.log(paylaod)
    })

    chat.on("presence_state", state => {
      presences = Presence.syncState(presences, state)
      render(presences)
    })

    chat.on("presence_diff", diff => {
      presences = Presence.syncDiff(presences, diff)
      render(presences)
    })

    chat.join()

    // Chat

    console.log('CIAO');

    window.onload = function() {
        let messageInput = document.getElementById("NewMessage");
        messageInput.addEventListener("keypress", (e) => {
            console.log('TET');
          if (e.keyCode == 13 && messageInput.value != "") {
            chat.push("message:new", messageInput.value);

            console.log('TET');

            messageInput.value = "";
          }
      });
    };

    let messageList = document.getElementById("MessageList")
    let renderMessage = (message) => {
        $('#MessageList').append('<p>'+message.body  +'</p>');
    }

    chat.on("message:new", message => renderMessage(message))
