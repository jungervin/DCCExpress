const elems = App.editor.views

if (!App.num) {
    App.num = 0;
}

//==================================
// INIT
//==================================
if (!App.init) {
    App.init = "true"
    App.status = {}
}

const AppStates = App.States ?? {}

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
    if(rb12 || t16.t1Closed || !t12.t2Closed) {
        if(!s55.isRed) {
            s55.sendRed()
        }
    } else {
        if(!s55.isYellow) {
            s55.sendYellow()
        }
    }
}

App.num += 1;
console.log(App.num)
//t10.t1Closed = !t10.t1Closed 
App.editor.draw()

