


const t10 = Api.getTurnout(10)
const t11 = Api.getTurnout(11)
const t12 = Api.getTurnout(12)
const t13 = Api.getTurnout(13)
const t14 = Api.getTurnout(14)
const t16 = Api.getTurnout(16)

const s50 = Api.getSignal(50)
const s55 = Api.getSignal(55)
const s60 = Api.getSignal(60)
const s65 = Api.getSignal(65)

const rb12 = Api.getSensor(12)
const rb13 = Api.getSensor(13)
const rb14 = Api.getSensor(14)
const rb15 = Api.getSensor(15)
const rb16 = Api.getSensor(16)
const rb24 = Api.getSensor(24)

const rb6 = Api.getSensor(6)


const block198 = Api.getElement("block198")
const block199 = Api.getElement("block199")
const block202 = Api.getElement("block202")
const block203 = Api.getElement("block203")


let loco18 = undefined
window.dispatcherInit2 = function init(app) {
    loco18 = Api.getLoco(18)
    console.log(loco18)
}


window.dispatcherLoop2 = function() {
    console.log("dispatcherLoop")
    console.log(loco18)
}
//==================================
// INIT
//==================================
if (!App.init) {
    
    // Uncomment to debug
    // debugger
    
    App.init = true
    App.num = 0;

    if (block198) {
        Api.setBlock("block198", 3)
    }
   

    return
}

// =====================================
// BLOCK
// =====================================


//======================================
// A train is approaching the station
//======================================

// if(rb6) {
//     Api.playSound("mav_szignal.mp3")
// }
// return;

const re13 = Api.detectRisingEdge(13)

if (Api.detectRisingEdge(24) && Api.getSensor(12)) {
    if (block198) {
        Api.setBlock("block198", 3)
    }
    //Api.playSound("mav_szignal.mp3")
}

if (Api.detectRisingEdge(16) && Api.getSensor(13)) {
    if (block199) {
        Api.setBlock("block199", 3)
    }
    //Api.playSound("mav_szignal.mp3")
}

if(Api.detectRisingEdge(14) && Api.getSensor(12)) {
    Api.setBlock("block203", 3)
}

if(re13 && rb14 ) {
    Api.setBlock("block202", 3)
}

//======================================
// SIGNAL #50
//======================================
{
    if (!t10.t1Closed && (rb12 || !t16.t1Closed || !t12.t2Closed)) {
        // if (!s50.isRed) {
        //     s50.sendRed()
        // }
        s50.sendRedIfNotRed();
    } else {
        if (t10.t1Closed) {
            if (!s50.isGreen) {
                s50.sendGreen()
            }
        } else {
            if (!s50.isYellow) {
                s50.sendYellow()
            }
        }
    }
}

//======================================
// SIGNAL #55
//======================================
{
    if (rb12 || t16.t1Closed || !t12.t2Closed) {
        if (!s55.isRed) {
            s55.sendRed()
        }
    } else {
        if (!s55.isYellow) {
            s55.sendYellow()
        }
    }
}

// App.num += 1;
// console.log(App.num)

