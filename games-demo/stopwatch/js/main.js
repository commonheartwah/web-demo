/**
 * 秒表
 * @param id || HTMLElement
 * @author <278500368@qq.com>
 * @date 27/08/2018
 */

function Stopwatch(id){
	var container;
	
	if(typeof id !== 'string' && id.nodeType===1){
		container = id;
	}else{
		container = document.getElementById(id);
	}
	container.className = 'container';
	this.container = container;
	this.init();
}

/**
 * 原型方法
 */
Stopwatch.prototype = {

	init:function(){
		var container = this.container;
		if(!container){
			console.warn('参数不正确:Stopwatch(id)')
			return false;
		}
		var html = this.createWatchHTML();
		container.innerHTML = html;
		this.status = 'STOP';
		this.recordList = [];
		this.record = container.querySelector('.watch-list');
		this.display = container.querySelector('.time');
		this.renderList();
		container.addEventListener('click',this,false);
		var control = container.querySelectorAll('button');
		this.startButton = control[1];
		this.resetButton = control[0];
	},

	handleEvent:function(e){
		//console.log(e);
		var evt = e.target.dataset.e;
		var status = this.status;
		//console.log(evt)
		switch(evt){
			case 'start':
				status ==='STOP' ? this.start() : this.stop();
				break;
			case 'reset':
				status === 'START' ? this.count(): this.reset();
				break;
		}
	},

	/**
	 * 开始
	 */
	start:function(){
		//console.log('start...')
		var watch = this;
		this.status = 'START';
		this.startButton.parentNode.className='start active';
		this.resetButton.parentNode.className='reset active';
		this.isActiveReset = true;
		this.startButton.innerHTML='停止';
		this.resetButton.innerHTML='计次';
		this.time = 0;
		this.timerID = setInterval(function(){
			watch.time++;
			watch.update();
		},10)
	},

	/**
	 * 停止
	 */
	stop:function(){
		//console.log('stop...')
		this.status = 'STOP';
		this.startButton.parentNode.className='start';
		this.startButton.innerHTML='开始';
		this.resetButton.innerHTML='复位';
		clearInterval(this.timerID);
	},

	/**
	 * 复位
	 */
	reset:function(){
		if(!this.isActiveReset){
			return false;
		}
		//console.log('reset')
		this.time = 0;
		this.recordList = [];
		this.resetButton.innerHTML = '计次';
		this.resetButton.parentNode.className='reset';
		this.update();
		this.renderList();
		this.isActiveReset = false;
	},

	/**
	 * 计次
	 */
	count:function(){
		this.recordList.push(this.time);
		this.renderList();
		this.time = 0;
	},

	/**
	 * 更新数据展示
	 */
	update:function(){
		var time = this.formatData();
		var elemetns = this.display.children;
		var firstRow = this.record.children[0];
		var index = this.recordList.length+1;
		for(var i = 0;i<3;i++){
			elemetns[i].innerText = time[i];
		}
		firstRow.innerHTML = '计次'+index+'<i>'+time[0]+':'+time[1]+'.'+time[2]+'</i>';
	},

	/**
	 * 数据格式化
	 * @param Int time 秒数
	 */
	formatData:function(time){
		time = time || this.time;
		var msecond = time % 100;
		var second = parseInt(time / 100)%60;
		var minute = parseInt(time /6000);
		var arr = [minute,second,msecond];
		for(var i=0;i<3;i++){
			arr[i] = arr[i] < 10 ? '0'+arr[i] : arr[i]+''
		}
		return arr;
	},

	/**
	 * 显示记录
	 */
	renderList:function(){
		var list = this.recordList,
			li = '',
			time = [],
			index = 0;
			length = list.length;
		var row = this.getTopRow();
		if(this.status==='START'){
			time = this.formatData();
			li = '<li>计次'+(length+1)+'<i>'+time[0]+':'+time[1]+'.'+time[2]+'</i></li>';
			index++;
		}
		while(length-->0){
			time = this.formatData(list[length]);
			var name = '';
			for(var k=0;k<row.length;k++){
				if(row[k]===list[length]){
					name = ' class="top_'+(k+1)+'"';
					break;
				}
			}
			li += '<li'+name+'>计次'+(1+length)+'<i>'+time[0]+':'+time[1]+'.'+time[2]+'</i></li>';
			index++;
		}

		while(index<3){
			li += '<li></li>';
			index++;
		}

		this.record.innerHTML = li;
	},

	/**
	 * 生成秒表的结构
	 */

	createWatchHTML:function(){
		var html = '<header class="title">秒表</header>\
		<section class="time">\
			<span>00</span><span>00</span><span>00</span>\
		</section>\
		<div class="control">\
			<div class="reset"><button data-e="reset">计次</button></div>\
			<div class="start"><button data-e="start">启动</button></div>\
		</div>\
		<ul class="watch-list"></ul>';
		return html;
	},

	/**
	 * 秒表记录排序
	 * @param int n = 3
	 */
	getTopRow:function(n){
		var arr = this.recordList.slice();
		n = n || 3;
		arr.sort(function(a,b){
			return b - a
		});
		return arr.slice(0,n);
	}
}

 
