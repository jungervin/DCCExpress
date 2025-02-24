const elems = App.editor.views

if (!App.num) {
    App.num = 0;
}

function task1() {

    if (!Api.tasks.getTask("Task1")) {

        const task = Api.tasks.addTask("Task1")

        task.setLoco(3)

        // ==========================================
        //  Szfvár P3 <=== P2 <== Szabadbattyán P3
        // ==========================================
        
        //task.waitForMinute(5)
        task.startAtMinutes([5, 15, 25, 35, 45, 55])
        task.setRoute("routeSwitch112")
        task.waitMs(3000, 5000)

        // Kalauz síp
        task.setFunctionMs(17, true, 500)
        task.waitMs(3000, 5000)

        // Hátra és Kürt
        task.reverse(0)
        task.setFunctionMs(3, true, 500)
        task.waitMs(3000, 5000)
        task.reverse(30)

        task.waitForSensor(16, true)

        task.setFunctionMs(3, true, 500)
        task.delay(3000)
        task.stop()

        task.waitMs(10000, 20000)

        // ==========================================
        //  Szfvár P3 ==> P1 ==> Szabadbattyán P3
        // ==========================================

        //task.waitForMinute(5)
        task.startAtMinutes([0, 10, 20, 30, 40, 50])
        task.setRoute("routeSwitch113")
        task.waitMs(3000, 5000)

        // Kalauz síp
        task.setFunctionMs(17, true, 500)

        task.waitMs(3000, 5000)

        // Előre és Kürt
        task.foward(0)
        task.setFunctionMs(3, true, 500)
        task.waitMs(3000, 5000)
        task.foward(30)

        task.waitForSensor(24, true)

        task.setFunctionMs(3, true, 500)

        task.delay(3000)
        task.stop()

        task.waitMs(10000, 20000)

        task.restart()

    }
}

//==================================
// INIT
//==================================
if (!App.init) {
    App.init = true
    App.status = {}
    task1()



    return
}


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
const rb15 = App.sensors[15]
const rb24 = App.sensors[24]


const l18 = App.getLoco(18)
console.log(l18)

// ======================================
// The train has reached the station
// ======================================
if (rb15 != App.status.rb15) {
    if(rb15) {
        audioManager.play("mav_szignal.mp3")
    }
    App.status.rb15 = rb15
}

if (rb24 != App.status.rb24) {
    if(rb24) {
        audioManager.play("mav_szignal.mp3")
        setTimeout(() => {
            audioManager.play("Szfvarrol.V3.mp3")
        }, 1000)
    }
    App.status.rb24 = rb24
}

//======================================
// SIGNAL #50
//======================================
{
    // if(rb12) {
    //     if (!s50.isRed) {
    //         s50.sendRed()
    //     }
    // } 
    // else 
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

