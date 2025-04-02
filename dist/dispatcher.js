const t10 = Api.getTurnoutElement(10)
const t11 = Api.getTurnoutElement(11)
const t12 = Api.getTurnoutElement(12)
const t13 = Api.getTurnoutElement(13)
const t14 = Api.getTurnoutElement(14)
const t16 = Api.getTurnoutElement(16)

const s50 = Api.getSignalElement(50)
const s55 = Api.getSignalElement(55)
const s60 = Api.getSignalElement(60)
const s65 = Api.getSignalElement(65)


window.dispatcherInit = function init(app) {
    
    console.log("dispatcherInit")
}


window.dispatcherLoop = function () {
    console.log("dispatcherLoop")
}
//==================================
// INIT
//==================================




//======================================
// SIGNAL #50
//======================================
{
    if (!t10.t1Closed && (Api.sensorIsOn(12) || !t16.t1Closed || !t12.t2Closed)) {
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
    if (Api.sensorIsOn(12) || t16.t1Closed || !t12.t2Closed) {
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

