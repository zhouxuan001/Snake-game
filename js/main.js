$(function(){
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	
	function Square(x,y,w,h,color){/*创建对象，小方块属性：分别是x轴和y轴位置(x、y)、宽和高的值(w、h)和颜色(color)*/
		this.x = x ;
		this.y = y ;
		this.w = w ;
		this.h = h ;
		this.c = color ;
	}
	Square.prototype.draw=function(){/*通过原型给小方块Square对象添加draw方法*/
		context.beginPath();
		context.fillStyle=this.c;
		context.rect(this.x,this.y,this.w,this.h);
		context.fill();
		context.stroke();
	}
	
	function Snake(){/*定义蛇身函数*/
		var snakeArray=[];/*创建一个数组用来存放整个蛇对象的方块*/
		for (var i=0;i<4;i++) {/*循环创建蛇身*/
			var square = new Square(i*20,0,20,20,"gray");
			snakeArray.splice(0,0,square);//splice方法一直往前添加，使得一开始创建的是蛇尾(坐标为0，0)，最后创建的为首，添加在数组的最前面即[0]项
		}
		var head = snakeArray[0];//重写数组[0]的color，即为创建的蛇首[0]项更改颜色
		head.c = "red";
		this.head = snakeArray[0];//移动方法：1.每次蛇首前移一步(自始至终只有蛇首动，蛇身不动)
		this.snakeArray = snakeArray;//2.蛇身最后一个元素砍掉arr.pop()追加到蛇首后面(pop方法返回的是删除的最后一个数组元素)
		this.direction = 39;//定义初始移动方向: 左37 上38 右39 下40  事件if event.keyCode==39?
	}
	Snake.prototype.draw=function(){//画出蛇身
		for (var i=0;i<this.snakeArray.length;i++) {
			this.snakeArray[i].draw();
		}
	}
	Snake.prototype.isEat=function(){//判断是否吃到了食物  food_square.x
		var food_x = food_square.x,food_y = food_square.y;
		switch (this.direction) {//37-40  往 左上右下 方向走
            case 37:
                food_x += 20
                break;
            case 38:
                food_y += 20
                break;
            case 39:
                food_x -= 20
                break;
            case 40:
                food_y -= 20
                break;
            default:    
                break;
        }
		if (this.head.x==food_x && this.head.y==food_y) {
			console.log(this.direction+"吃到食物了");
			is_eat = true;
			return;
		}
		is_eat = false;
	}
	Snake.prototype.move=function(){
		var square=new Square(this.head.x,this.head.y,this.head.w,this.head.h,"gray");//创建一个灰色方块
		this.snakeArray.splice(1,0,square);//将方块添加到蛇首方块后面
		this.isEat();//每次移动时 判断食物是否被吃
		if (is_eat) {//如果吃到了食物.那就不将蛇身后的元素砍掉了
			food = new getRandomFood();//刷新食物，前面的食物方块会被清除
		} else{
			this.snakeArray.pop();//将蛇身最后一个元素砍掉
		}
		//根据方向移动蛇首的位置
		switch (this.direction) {
            case 37:
                this.head.x -= 20
                break;
            case 38:
                this.head.y -= 20
                break;
            case 39:
                this.head.x += 20
                break;
            case 40:
                this.head.y += 20
                break;
            default:    
                break;
        }
		move_over = true;//蛇当前移动完成后，将变量move_over变为true
		
		//撞边界判定
		if (this.head.x > canvas.width || this.head.x < 0 || this.head.y > canvas.height || this.head.y < 0){
            clearInterval(timer);
            console.log("撞墙了");
            $(".zhezhao").show();
			$(".hidebox").show();
            //alert("游戏结束,请重新开始！");
        }
		
		//撞自己判定
		for (var i=1;i<this.snakeArray.length;i++) {
			if (this.head.x==this.snakeArray[i].x && this.head.y==this.snakeArray[i].y) {
				clearInterval(timer);
            	console.log("撞自己了");
            	$(".zhezhao").show();
				$(".hidebox").show();
            	//alert("游戏结束,请重新开始！");
			}
		}
	}
	
	//键盘事件,判断：如果当前是往左走的时候，按右方向键不能让蛇倒着走
	var move_over = true;//判断是否移动完成
	//每次按下方向键后将 move_over变为false，使其不会再被执行，只有当move完成后将move_over变为true后才会再次改变方向
	$(document.body).off("keydown").on("keydown",function(e){
		var ev = e||window.event;
		if (move_over == false) {
			return;
		}
		
        switch(ev.keyCode){
            case 37:{
                if (snake.direction != 39){//右
                	move_over = false;
                    snake.direction = 37;//左
                }
                break;
            }
            case 38:{
                if (snake.direction != 40){//下
                	move_over = false;
                    snake.direction = 38;//上
                }
                break;
            }
            case 39:{
                if (snake.direction != 37){//左
                	move_over = false;
                    snake.direction = 39;//右
                }
                break;
            }
            case 40:{
                if (snake.direction != 38){//上
                	move_over = false;
                    snake.direction = 40;//下
                }
                break;
            }    
        }
	})
	
	//出现食物,每个食物20*20大小，画布宽度为800*500
	var is_eat,food_square,food;
	function getRandomFood(){
		
		var x = parseInt(Math.random()*40);
		var y = parseInt(Math.random()*25);
		food_square = new Square(x*20,y*20,20,20,"green");
	}
	getRandomFood.prototype.draw = function(){
		food_square.draw();
	}
	
	food = new getRandomFood();//画出随机出现食物
	
	//画出蛇
	var snake=new Snake();//new一个Snake对象
	snake.draw();//执行对象的draw方法：画出蛇身
	
	function intDraw(){//执行擦除画布  画食物  蛇身移动  画出当前的整条蛇
		context.clearRect(0,0,canvas.width,canvas.height);
		food.draw();
		snake.move();
		snake.draw();
	}
	var timer;
	$("#start").on("click",function(){//点击开始游戏
		$(".zhezhao").hide();
		$(".hidebox").hide().children("#again,.refrees").show().siblings("#start").hide();
		timer=setInterval(intDraw,300);//设置定时器，每隔一段时间画一次蛇的位置
	})
	$("#again").on("click",function(){//点击重新开始
		$(".zhezhao").hide();
		$(".hidebox").hide();
		snake=new Snake();//重新new一个Snake对象
		food = new getRandomFood();//画出随机出现食物
		timer=setInterval(intDraw,300);//设置定时器，每隔一段时间画一次蛇的位置
	})
	
})