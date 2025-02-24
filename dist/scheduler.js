
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