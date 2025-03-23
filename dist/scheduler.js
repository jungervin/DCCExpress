//=====================================
// TASK 1 P3 <<<<< P3
//=====================================
const task1 = Api.tasks.addTask("Task1")

task1.delay(1000)
task1.ifBlockIsNotFree("block198")
{
    task1.getLocoFromBlock("block198")

    task1.waitForStop()
    task1.waitMs(5000, 10000)
   
    task1.reverse(0)
    task1.setFunctionMs(3, true, 500)

    task1.setRoute("routeSwitch112")
    task1.delay(3000)

    task1.label("Wait for block203")
    task1.ifBlockIsFree("block203")
    {
        task1.reverse(40)
        task1.waitForSensor(14, true)
        task1.setBlockLocoAddress("block203")
    }
    task1.else()
    {
        task1.stopLoco()
        task1.goto("Wait for block203")
    }
    task1.endIf()

    task1.label("Wait for block199")
    task1.ifBlockIsFree("block199")
    {
        task1.reverse(40)
        task1.waitForSensor(13, true)
        task1.setBlockLocoAddress("block202")
        task1.reverse(20)
        task1.waitForSensor(16, true)
        task1.setBlockLocoAddress("block199")
        task1.reverse(10)
        task1.delay(10000)
        task1.stopLoco()
    }
    task1.else()
    {
        task1.stopLoco()
        task1.goto("Wait for block199")
    }
    task1.endIf()
}
task1.endIf()
task1.restart()

//=====================================
// TASK 2 P3 >>>>> P3
//=====================================
const task2 = Api.tasks.addTask("Task2")

task2.delay(1000)
task2.ifBlockIsNotFree("block199")
{

    task2.getLocoFromBlock("block199")
    task2.waitForStop()
    task2.waitMs(5000, 10000)

    task2.forward(0)
    task2.setFunctionMs(3, true, 500)

    task2.setRoute("routeSwitch113")
    task2.delay(3000)

    task2.label("Wait for block202 forward")
    task2.ifBlockIsFree("block202")
    {
        task2.forward(40)
        task2.waitForSensor(13, true)
        task2.setBlockLocoAddress("block202")
    }
    task2.else()
    {
        task2.stopLoco()
        task2.goto("Wait for block202 forward")
    }
    task2.endIf()

    task2.label("Wait for block 198 forward")
    task2.ifBlockIsFree("block198")
    {
        task2.forward(40)
        task2.waitForSensor(12, true)
        task2.forward(20)
        task2.waitForSensor(24, true)
        task2.setBlockLocoAddress("block198")
        task2.forward(10)
        task2.delay(20000)
        task2.stopLoco()
    }
    task2.else()
    {
        task2.stopLoco()
        task2.goto("Wait for block 198 forward")
    }
    task2.endIf()

}
task2.endIf()
task2.restart()

