try {
    let isIE = (/MSIE (\d+\.\d+);/.test(navigator.userAgent) || navigator.userAgent.indexOf("Trident/") > -1)
    if (isIE) {
        let warning = document.createElement("h2")
        warning.innerHTML = "Internet Explorer is NOT Supported. Choose a different browser (Chrome, Firefox, Edge, Safari, Opera, and most other browsers should work)"
        document.body.insertBefore(warning, document.body.firstChild)
    }
}
catch(e) {console.error(e)}

if ('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker.register('packagedsw.js');
    }
    catch (e) {
        console.error(e)
    }
}

document.title = "Mahjong 4 Friends - Free Multiplayer Mahjong"

window.isAndroid = false
if (document.referrer && document.referrer.includes("android-app://com.mahjong4friends.twa")) {
  window.isAndroid = true
}

if (window.Capacitor) {
    try {
        ;((async function() {
            //This request needs to be a native request, because itunes isn't setting CORS headers properly for capacitor://localhost
            let latestVersion = 1.2 //Last version without native request module.
            try {
                window.HTTP = require('@ionic-native/http').HTTP

                let req = await HTTP.get("https://itunes.apple.com/lookup?bundleId=com.mahjong4friends.twa", {}, {})
                let res = await JSON.parse(req.data)
                latestVersion = res.results[0].version
            }
            catch (e) {
                console.warn("Potential Error fetching latest version code", e)
            }

            let deviceInfo = await window.Capacitor.Plugins.Device.getInfo()
            let currentVersion = deviceInfo.appVersion

            //Using numeric comparison, so version codes can't have more than one decimal.
            if (parseFloat(currentVersion) < parseFloat(latestVersion)) {
                const Popups = require("./Popups.js")
                new Popups.Notification("App Update", "There is a Mahjong 4 Friends <a href='https://apps.apple.com/us/app/mahjong-4-friends/id1552704332' target='_blank'>app update</a>. Downloading it is recommended. You may experience minor issues if you do not update. ").show()
            }
        })())
    }
    catch (e) {console.error(e)}
}


require("./universalLinks.js")

let sizes = [16,24,32,64,96,160,196]
sizes.forEach((size) => {
    let favicon = document.createElement("link")
    favicon.rel = "shortcut icon"
    favicon.type = "image/png"
    favicon.sizes = size + "x" + size
    favicon.href = `assets/icons/${size}x${size}-green-dragon.png`
    document.head.appendChild(favicon)
})

const StateManager = require("./StateManager.js")

//Mobile browsers use the touch API - desktop is drag and drop. We'll use a polyfill so we don't have to implement both.
let mobile_drag_drop_polyfill = require("mobile-drag-drop").polyfill
// optional import of scroll behaviour
import {scrollBehaviourDragImageTranslateOverride} from "mobile-drag-drop/scroll-behaviour";
// options are optional ;)
mobile_drag_drop_polyfill({
    // use this to make use of the scroll behaviour
    dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
});

let url = new URL(window.location.origin + window.location.pathname)
url.pathname = "/node"
if (window.location.protocol === "https:") {
    url.protocol = "wss:"
}
else {
    url.protocol = "ws:"
}
if (window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168.1")) {
    //Local development
    url.port = 7591
}
let websocketURL = url.toString()
if (window.isNative) {
    websocketURL = "wss://mahjong4friends.com/node"
}
window.stateManager = new StateManager(websocketURL)

//Make classes public to allow for easier development.
;(["Hand", "Tile", "Sequence", "Pretty", "Match", "Wall", "Popups"]).forEach((className) => {
    window[className] = require("./" + className + ".js")
})

let roomManager = require("./RoomManager.js")
let gameBoard = require("./GameBoard.js")


//While viewport relative units work fine on desktop, some mobile browsers will not show the entire viewport, due to the url bar.
//See https://nicolas-hoizey.com/articles/2015/02/18/viewport-height-is-taller-than-the-visible-part-of-the-document-in-some-mobile-browsers/
//We will use CSS variables to counteract this bug.
function setVisibleAreaHeight() {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`)
    document.documentElement.style.setProperty('--vw', `${window.innerWidth/100}px`)

    //Add some margin to handle the notch.

    let pxLeft = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sal"))
    pxLeft -= 10 //Ignore the small safe area decrease caused by rounded corners.
    document.documentElement.style.setProperty('--shiftPercentageLeft', `${Math.max(0, pxLeft/window.innerWidth)}`)

    let pxRight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sar"))
    pxRight -= 10 //Ignore the small safe area decrease caused by rounded corners.
    document.documentElement.style.setProperty('--shiftPercentageRight', `${Math.max(0, pxRight/window.innerWidth)}`)
}

window.addEventListener('resize', setVisibleAreaHeight)
window.addEventListener('orientationchange', setVisibleAreaHeight)

setVisibleAreaHeight()

//Otherwise Safari will scroll the page when the user drags tiles.
//It's possible that we need feature detection for passive listeners, as it may be misinterpreted by older browsers, however I currently observe no side effects.
window.addEventListener('touchmove', function () {}, {passive: false});
