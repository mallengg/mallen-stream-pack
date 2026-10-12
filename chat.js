
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
   CORES DOS CABEÇALHOS
========================= */

const headerClasses = [
    "chat-header",
    "chat-header-pink",
    "chat-header-purple"
];

let headerIndex = 0;


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
   CONVERTER URLS EM LINKS
========================= */

function convertUrlsToLinks(container){

    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT
    );

    const textNodes = [];

    while(walker.nextNode()){

        const node = walker.currentNode;

        if(!node.parentElement.closest("a, script, style")){
            textNodes.push(node);
        }
    }

    const urlRegex = /https?:\/\/[^\s<>"]+/g;

    textNodes.forEach(node => {

        const text = node.textContent;

        const matches = [...text.matchAll(urlRegex)];

        if(!matches.length)
            return;

        const fragment =
            document.createDocumentFragment();

        let lastIndex = 0;

        matches.forEach(match => {

            const rawUrl = match[0];

            // Remove pontuação final que não pertence à URL
            const url = rawUrl.replace(/[.,!?;:]+$/, "");

            fragment.appendChild(
                document.createTextNode(
                    text.slice(lastIndex, match.index)
                )
            );

            if(url){

                const link =
                    document.createElement("a");

                link.href = url;
                link.textContent = url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                fragment.appendChild(link);
            }

            lastIndex = match.index + url.length;
        });

        fragment.appendChild(
            document.createTextNode(
                text.slice(lastIndex)
            )
        );

        node.replaceWith(fragment);
    });
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

    header.className = headerClasses[headerIndex];

    headerIndex =
        (headerIndex + 1) % headerClasses.length;


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

            const src =
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


    /* TEXTO */

    const content =
        document.createElement("div");

    content.className = "message-content";

    // Mantém os emotes HTML do Social Stream
    content.innerHTML =
        data.chatmessage || "";

    // Transforma URLs de texto em links clicáveis
    convertUrlsToLinks(content);

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

        donation.className = "donation";

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

    img.className = "platform-icon";

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
