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
const rb15 = Api.getSensor(15)
const rb16 = Api.getSensor(16)
const rb24 = Api.getSensor(24)

const l18 = Api.getLoco(18)
console.log(l18)

const block198 = Api.getElement("block198")
const block199 = Api.getElement("block199")

//==================================
// INIT
//==================================
if (!App.init) {
    App.init = true
    App.num = 0;
    return
}

// =====================================
// BLOCK
// =====================================
if (block198) {
    block198.setLoco(3)
}
if (block199) {
    block199.setLoco(11)
}


//======================================
// A train is approaching the station
//======================================
if (Api.detectFallingEdge(13) && Api.getSensor(12)) {
    Api.playSound("mav_szignal.mp3")
}

if (Api.detectRisingEdge(16) && Api.getSensor(13)) {
    Api.playSound("mav_szignal.mp3")
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

App.num += 1;
console.log(App.num)

