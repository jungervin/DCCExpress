const elems = App.editor.views



const t10 = elems.getTurnout(10)
const t11 = elems.getTurnout(11)
const t12 = elems.getTurnout(12)
const t13 = elems.getTurnout(12)
const t14 = elems.getTurnout(14)
const t16 = elems.getTurnout(16)

const s50 = elems.getSignal(50)
const s55 = elems.getSignal(55)
const s60 = elems.getSignal(60)
const s65 = elems.getSignal(65)

const rb12 = App.sensors[12]
const rb13 = App.sensors[13]
const rb15 = App.sensors[15]
const rb16 = App.sensors[16]
const rb24 = App.sensors[24]

const l18 = App.getLoco(18)
console.log(l18)

//==================================
// INIT
//==================================
if (!App.init) {
    App.init = true
    App.num = 0;
    App.status = {}
    App.status.rb13 = rb13
    App.status.rb12 = rb12
    App.status.rb15 = rb15
    App.status.rb15 = rb16
    App.status.rb24 = rb24
    Api.edges["rb12"] = rb12;
    return
}


// ======================================
// The train has reached the station
// ======================================
// if (rb15 != App.status.rb15) {
//     if(rb15) {
//         audioManager.play("mav_szignal.mp3")
//     }
//     App.status.rb15 = rb15
// }

// if (rb24 != App.status.rb24) {
//     if(rb24) {
//         audioManager.play("mav_szignal.mp3")
//         setTimeout(() => {
//             audioManager.play("Szfvarrol.V3.mp3")
//         }, 1000)
//     }
//     App.status.rb24 = rb24
// }



// const EdgeRising = 1
// const EdgeFallig = -1
// if(Api.detectEdge('rb13', rb13) == EdgeFallig && rb12) {
//     Api.playSound("mav_szignal.mp3")
// }
// if(Api.detectEdge('rb16', rb16) == EdgeRising && r13) {
//     Api.playSound("mav_szignal.mp3")
// }

if(Api.detectFallingEdge(13) && Api.getSensor(12)) {
    Api.playSound("mav_szignal.mp3")
}

if(Api.detectRisingEdge(16) && Api.getSensor(13)) {
    Api.playSound("mav_szignal.mp3")
}




//======================================
// SIGNAL #50
//======================================
{
    if (!t10.t1Closed && (rb12 || !t16.t1Closed || !t12.t2Closed)) {
        if (!s50.isRed) {
            s50.sendRed()
        }
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
App.editor.draw()

