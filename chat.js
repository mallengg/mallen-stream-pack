const params = new URLSearchParams(window.location.search);

const session =
    params.get("session") ||
    "9w2D95rNmA";

const password =
    params.get("password") ||
    "false";


/* =========================
   SOCIAL STREAM BRIDGE
========================= */

const bridge =
    document.getElementById("ssn-bridge");

bridge.src =
    "https://vdo.socialstream.ninja/" +
    "?ln" +
    "&salt=vdo.ninja" +
    "&notmobile" +
    "&password=" + encodeURIComponent(password) +
    "&solo" +
    "&view=" + encodeURIComponent(session) +
    "&novideo" +
    "&noaudio" +
    "&label=dock" +
    "&cleanoutput" +
    "&room=" + encodeURIComponent(session);


/* =========================
   RECEBER MENSAGENS
========================= */

window.addEventListener("message", event => {

    if(event.source !== bridge.contentWindow)
        return;

    const received =
        event.data?.dataReceived;

    if(!received)
        return;

    if(received.overlayNinja){
        processData(received.overlayNinja);
    }

});


/* =========================
   PROCESSAR SOCIAL STREAM
========================= */

function processData(data){

    if(data.content)
        data = data.content;

    if(!data)
        return;

    if(!data.chatmessage && !data.contentimg)
        return;

    createMessage(data);
}


/* =========================
   CRIAR MENSAGEM
========================= */

function createMessage(data){

    const item =
        document.createElement("div");

    item.className = "chat-item";


    /* CABEÇALHO */

    const header =
        document.createElement("div");

    header.className = "chat-header";


    /* PLATAFORMA */

    const platform =
        createPlatformIcon(data.type);

    if(platform)
        header.appendChild(platform);


    /* AVATAR */

    if(data.chatimg){

        const avatar =
            document.createElement("img");

        avatar.className = "avatar";
        avatar.src = data.chatimg;

        header.appendChild(avatar);
    }


    /* BADGES */

    if(Array.isArray(data.chatbadges)){

        const badges =
            document.createElement("div");

        badges.className = "badges";

        data.chatbadges.forEach(badge => {

            let src =
                typeof badge === "string"
                ? badge
                : badge?.src;

            if(!src)
                return;

            const img =
                document.createElement("img");

            img.src = src;

            badges.appendChild(img);
        });

        if(badges.children.length)
            header.appendChild(badges);
    }


    /* NOME */

    const username =
        document.createElement("span");

    username.className = "username";

    username.textContent =
        data.chatname || "Usuário";

    header.appendChild(username);


    /* CORPO */

    const message =
        document.createElement("div");

    message.className = "message";


    const content =
        document.createElement("div");

    content.className =
        "message-content";

    /*
       O Social Stream já entrega chatmessage
       com os emotes processados em muitos casos.
    */

    content.innerHTML =
        data.chatmessage || "";

    message.appendChild(content);


    /* IMAGEM/GIF */

    if(data.contentimg){

        const img =
            document.createElement("img");

        img.src = data.contentimg;
        img.style.maxWidth = "100%";
        img.style.display = "block";

        message.appendChild(img);
    }


    /* DOAÇÃO */

    if(data.hasDonation){

        const donation =
            document.createElement("div");

        donation.className =
            "donation";

        donation.textContent =
            data.hasDonation;

        message.appendChild(donation);
    }


    item.appendChild(header);
    item.appendChild(message);

    document
        .getElementById("chat")
        .appendChild(item);


    limitMessages();
}


/* =========================
   ÍCONES DAS PLATAFORMAS
========================= */

function createPlatformIcon(type){

    if(!type)
        return null;

    const img =
        document.createElement("img");

    img.className =
        "platform-icon";

    /*
       Por enquanto usamos os favicons
       públicos das plataformas.
    */

    const icons = {

        youtube:
            "https://www.youtube.com/favicon.ico",

        twitch:
            "https://www.twitch.tv/favicon.ico",

        facebook:
            "https://www.facebook.com/favicon.ico",

        tiktok:
            "https://www.tiktok.com/favicon.ico",

        instagram:
            "https://www.instagram.com/favicon.ico"
    };

    const key =
        String(type).toLowerCase();

    if(!icons[key])
        return null;

    img.src = icons[key];

    return img;
}


/* =========================
   LIMITE DE MENSAGENS
========================= */

function limitMessages(){

    const chat =
        document.getElementById("chat");

    while(chat.children.length > 8){
        chat.firstElementChild.remove();
    }
}
