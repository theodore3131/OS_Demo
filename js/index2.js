function firstIn() {
    var front_PCB = readyQueue.dequeue();

    if (!front_PCB) {
        return false;
    }

    //FCFS
    if (Algorithm === '0') {
        front_PCB.execute();//执行当前进程
        system_vm.times += front_PCB.planTime; //系统运行时间增加
        doneQueue.enqueue(front_PCB); // 当前 JCB 加入已完成队列

        system_vm.echo('进程[PCB - ' + front_PCB.id + ']完成，进入完成队列');
        new_PCB = backQueue.dequeue();
        readyQueue.enqueue(new_PCB)
    }
    //Priority
    else if (Algorithm === '1') {
        //执行当前进程
        if (front_PCB.execute1()) {//未执行完
            readyQueue.enqueue1(front_PCB);
        } else {
            doneQueue.enqueue(front_PCB); // 当前 JCB 加入已完成队列
            system_vm.echo('进程[PCB - ' + front_PCB.id + ']完成，进入完成队列');
            new_PCB = backQueue.dequeue();
            readyQueue.enqueue1(new_PCB);
            system_vm.echo('进程[PCB - ' + new_PCB.id + ']从后备队列进入就绪队列');
        }
        system_vm.times ++; //系统运行时间增加
    }

    //Time Slices
    else if (Algorithm === '2') {
        //执行当前进程，时间片
        if (front_PCB.execute2()) {//未执行完, 到就绪队列末尾
            readyQueue.enqueue(front_PCB);
        } else {
            doneQueue.enqueue(front_PCB); // 当前 JCB 加入已完成队列
            system_vm.echo('进程[PCB - ' + front_PCB.id + ']完成，进入完成队列');
            new_PCB = backQueue.dequeue();
            readyQueue.enqueue(new_PCB);
            system_vm.echo('进程[PCB - ' + new_PCB.id + ']从后备队列进入就绪队列');
        }
        system_vm.times += 2; //系统运行时间增加
    }
}

// 用于顺序获取阻塞队列下一次的类型值。柯里化
var nextBlockQueue = (function() {
    var _current = 0;

    return {
        current: function() {
            return String.fromCharCode(_current + 65);
        },
        next: function() {
            _current = ++_current % 3
            return String.fromCharCode(_current + 65);
        },
        reset: function() {
            _current = 0;
            return String.fromCharCode(_current + 65);
        }
    }
})();

var JOB_SUM = 60; // 系统运行作业总数
var Algorithm = '0';

var backQueue = new Queue(), // 初始化 后备队列
    readyQueue = new Queue(), // 初始化 就绪队列
    blockQueue = {
        A: new Queue(), // 初始化 阻塞队列 A
        B: new Queue(), // 初始化 阻塞队列 B
        C: new Queue(), // 初始化 阻塞队列 C
    },
    doneQueue = new Queue(); // 初始化 已完成队列

var backQueue_vm = new Vue({
    el: '#back-queue',
    data: {
        items: backQueue.dataStore,
        isHide: true,
    },
    methods: {
        togglePanel: function() {
            this.isHide = !this.isHide;
        }
    }
});

var readyQueue_vm = new Vue({
    el: '#ready-queue',
    data: {
        items: readyQueue.dataStore,
    },
});

var init_vm = new Vue({
    el: '#init',
    data: {
        sum: JOB_SUM,
        algo: Algorithm,
    },
    methods: {
        refresh: function() {
            Algorithm = this.algo;
            if ( this.sum < 0 ) {
                system_vm.echo('系统初始化：请输入一个合理的系统任务数');
            } else {
                runSystem(this.sum, this.algo);
            }
        },
    },
    watch: {

    }
});

var system_vm;
system_vm = new Vue({
    el: '#system',
    data: {
        times: 0,
        allTimes: 0,
        systemMessage: [],
        num: 0,
    },
    methods: {
        nextInf: function () {
            this.num = self.setInterval(firstIn,1500);
        },
        stopIt: function () {
            self.clearInterval(this.num)
        },
        echo: function (msg) {
            this.systemMessage.push(msg);
        },
        emptyMsg: function () {
            this.systemMessage = [];
        },
    },
    watch: {
        times: function (newTimes) {
            if (newTimes === this.allTimes) {
                this.echo('系统全部任务运行完毕，总执行时间片：' + this.allTimes);
            }
        },
        systemMessage: function () { // 信息框滚动条置底
            this.$nextTick(function () {
                var list = document.getElementById('console');
                list.scrollTop = list.scrollHeight;
            });
        }
    }
});



var blockQueue_A_vm = new Vue({
    el: '#block-queue-A',
    data: {
        items: blockQueue['A'].dataStore,
    }
});

var blockQueue_B_vm = new Vue({
    el: '#block-queue-B',
    data: {
        items: blockQueue['B'].dataStore,
    }
});

var blockQueue_C_vm = new Vue({
    el: '#block-queue-C',
    data: {
        items: blockQueue['C'].dataStore,
    }
});

var doneQueue_vm = new Vue({
    el: '#done-queue',
    data: {
        items: doneQueue.dataStore,
    }
});


runSystem(JOB_SUM,Algorithm);

/*
	运行系统
	@param { Object } 系统资源总数
*/
function runSystem(jobSum,algo){

    // 清空 6 个队列
    backQueue.empty();
    readyQueue.empty();
    blockQueue['A'].empty();
    blockQueue['B'].empty();
    blockQueue['C'].empty();
    doneQueue.empty();

    // PCB 标识归零
    PCB_ids = 0;

    // 已执行时间片 归零
    system_vm.times = 0;

    // 清空控制台信息
    system_vm.emptyMsg();

    // 将系统全部作业加进后备队列中
    repeat(jobSum, function() {
        backQueue.enqueue( new PCB() );
    });

    var allTimes = 0;

    // 统计总时间片
    _.forEach(backQueue.dataStore, function(o) {
        allTimes += o.planTime;
    });

    system_vm.allTimes = allTimes;

    // 将作业从后备队列中调入 10 个作业进入系统
    repeat(10, function() {
        algo === '1' ? readyQueue.enqueue1( backQueue.dequeue() ):readyQueue.enqueue(backQueue.dequeue());
    });

}