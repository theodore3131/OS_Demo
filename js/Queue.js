/*

	队列 类封装与实现
	@author 3114006311杨子聪 https://github.com/gisonyeung/OS-curriculum-design
	
*/


function Queue() {
	this.dataStore = [];
}


/* 入队 */
Queue.prototype.enqueue = function(item) {
	this.dataStore.push(item);
	return this.dataStore;
}

Queue.prototype.enqueue1 = function(item) {
    var contain = false;

    for (var i = 0; i < this.dataStore.length; i++) {
        if (this.dataStore[i].priority > item.priority) {
            // Once the correct location is found it is
            // enqueued
            this.dataStore.splice(i, 0, item);
            contain = true;
            break;
        }
    }

    // if the element have the highest priority
    // it is added at the end of the queue
    if (!contain) {
        this.dataStore.push(item);
    }

    return this.dataStore;
}

/* 
	出队
 	@return 出队元素
*/
Queue.prototype.dequeue = function() {
	return this.dataStore.shift();
}

/* 读取队首元素 */
Queue.prototype.front = function() {
	return this.dataStore[0];
}

/* 读取队尾元素 */
Queue.prototype.back = function() {
	return this.dataStore[this.dataStore.length - 1];
}

/* 显示队列内所有元素 */
Queue.prototype.toString = function() {
	return this.dataStore.join(', ');
}

/* 判断队列是否为空 */
Queue.prototype.isEmpty = function() {
	return this.dataStore.length === 0;
}


/* 清空队列 */
Queue.prototype.empty = function() {
	while( this.dequeue() ) {};
}



/* 队列长度 */
Queue.prototype.getLength = function() {
	return this.dataStore.length;
}












