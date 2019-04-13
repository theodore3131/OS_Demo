/* 常量 */
var RUNTIME_RANGE = [1,20], // 预计运行时间范围
PRIORITY_RANGE = [4,27];

var PCB_STATE = {
    READY : 1,
    RUN : 2,
    FINISH : 3
};

var PCB_ids = 0; // PCB ID cache
var timeSlice = 4;

function PCB() {
    this.id = this.getId(); // 进程标识
    this.priority = this.getPrio();//获取进程优先级
    this.planTime = this.getPlanTime(); // 预计运行时间
    this.restTime = this.planTime; // 剩余运行时间
    this.count = 0;
    this.state = this.getState();//获取进程状态
}

/* 返回新任务ID */
PCB.prototype.getId = function() {
    return PCB_ids++;
}
PCB.prototype.getPrio = function() {
    return getRandomIntInRange(PRIORITY_RANGE);
}
PCB.prototype.getState = function() {
    return PCB_STATE.READY
}
/* 随机获取 预计运行时间 */
PCB.prototype.getPlanTime = function() {
    return getRandomIntInRange(RUNTIME_RANGE);
}

/* FCFS 执行完 */
PCB.prototype.execute = function() {
    while (this.restTime) {
        --this.restTime;
    }
    return this.restTime;
}

/* 优先数执行 */
PCB.prototype.execute1 = function() {
    this.priority += 3;
    return this.restTime ? --this.restTime : this.restTime;
}

/* 时间片轮转 */
PCB.prototype.execute2 = function () {
    return this.restTime > 0 ? this.restTime-=2 : 0;
}

/* 获取指定范围内的随机整数 */
function getRandomIntInRange(range) {
    // min ~ max
    return Math.round(range[0] + Math.random() * range[1]);
}