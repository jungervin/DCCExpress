
const test = Api.tasks.addTask("Task2")

test.setLoco(11)
test.break();
test.ifSensorIsOn(6)
{
    test.playSound("mav_szignal.mp3")   
}
test.else()
{
    test.playSound("mav_szignal.mp3")
    test.break()
}
test.endIf()
test.break()
test.label("END")
test.restart()




if (!Api.tasks.getTask("Task1")) {

    const task = Api.tasks.addTask("Task1")

    task.autoStart = false
    task.finishOnComplete = true
    task.setLoco(10)

    // task.waitForSensor(6, true)
    // task.playSound("mav_szignal.mp3")

    // ==========================================
    //  Szfvár P3 <=== P2 <== Szabadbattyán P3
    // ==========================================
    //task.waitForMinute(5)
    task.label("◀️◀️ Fehérvárra")
    task.startAtMinutes([5, 15, 25, 35, 45, 55])
    task.setRoute("routeSwitch112")
    task.playSound("mav_szignal.mp3")
    task.waitMs(3000, 5000)
    task.ifClosed(21)
    task.setSignalGreen(50)
    task.break()
    task.setSignalRed(50)
    task.break()
    task.setAccessory(10, true)
    task.break()
    task.setAccessory(10, false)
    task.break()
    task.delay(3000)
    task.goto("21 Closed")
    task.else()
    task.break()
    task.delay(3000)
    task.goto("21 Open")
    task.endIf()


    task.label("21 Closed")
    task.break()
    task.playSound("mav_szignal.mp3")
    task.delay(3000)
    task.goto("resume")

    task.label("21 Open")
    task.break()
    task.playSound("mav_szignal.mp3")
    task.delay(3000)

    task.label("resume")
    // Whistle
    task.setFunctionMs(17, true, 500)
    task.waitMs(3000, 5000)

    // Reverse & Horn
    task.reverse(0)
    task.setFunctionMs(3, true, 500)
    task.waitMs(3000, 5000)
    task.reverse(30)

    task.waitForSensor(16, true)

    task.setFunctionMs(3, true, 500)
    task.delay(2500)
    task.stopLoco()



    //task.waitMs(10000, 20000)

    // ==========================================
    //  Szfvár P3 ==> P1 ==> Szabadbattyán P3
    // ==========================================
    //task.waitForMinute(5)
    task.label("▶️▶️ Battyánba")
    task.startAtMinutes([0, 10, 20, 30, 40, 50])
    task.setRoute("routeSwitch113")
    task.playSound("mav_szignal.mp3")
    task.waitMs(3000, 5000)

    // Whistle
    task.setFunctionMs(17, true, 500)

    task.waitMs(3000, 5000)

    // Forward & Horn
    task.forward(0)
    task.setFunctionMs(3, true, 500)
    task.waitMs(3000, 5000)
    task.forward(30)

    task.waitForSensor(24, true)

    task.setFunctionMs(3, true, 500)

    task.delay(5000)
    task.stopLoco()

    task.waitMs(10000, 20000)

    task.restart()

}