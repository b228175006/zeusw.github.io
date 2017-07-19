var WINDOW_WIDTH = 1024;    //宽
var WINDOW_HEIGHT = 768;    //高
var RADIUS = 8; //绘制每个数字小圆球的半径
var MARGIN_TOP = 60;    //每一个数字距离画布上边距的距离
var MARGIN_LEFT = 30;   //第一个数字距离画布的左边距的距离
const FRICTION = 0.65;  //彩色小球弹跳起来时功的消耗

//在js中月份0代表1月
const endTime = new Date(2016, 2, 10, 18, 47, 52);    //倒计时的时间

var curShowTimeSeconds = 0;     //现在倒计时需要多少秒

var balls = []; //用来记录小球的数组

//用于生成滚动小球的颜色，随机抽取
const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];

//页面加载执行
window.onload = function () {

    //自适应处理
    /**
     * 但是这样做得不到整个屏幕的宽度和高度，需要给body
     * 和canvas加一个style height=100%
     * @type {number}
     */
    // WINDOW_WIDTH = document.body.clientWidth;
    // WINDOW_HEIGHT = document.body.clientHeight;
    /* 为了匹配博客的样式 -- start */
    WINDOW_HEIGHT = document.body.clientHeight / 2;
    WINDOW_WIDTH = $(".content-wrap").width()
    /* 为了匹配博客的样式 -- end */
    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);//宽度是整个屏幕的十分之一
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108)-1;
    MARGIN_TOP = Math.round(WINDOW_HEIGHT /5);//高度是整个屏幕的五分之一

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    curShowTimeSeconds = getCurShowTimeSeconds();

    /**
     * 动画的基本模型
     */
    setInterval(function () {

        //绘制当前的动画
        render(context);

        //对当前数据进行调整
        update();


    }, 50);


};

//当前时间和倒计时时间的秒数
function getCurShowTimeSeconds() {
    //倒计时效果
    //var curTime = new Date();
    //var ret = endTime.getTime() - curTime.getTime();
    //ret = Math.round(ret / 1000);
    //return ret >= 0 ? ret : 0;

    //时钟效果
    var curTime = new Date();
    var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();
    return ret;
}

//绘制方法
function render(ctx) {

    //对一个举行空间内的图形进行一次刷新操作
    ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
    var seconds = curShowTimeSeconds % 60;

    //绘制小时的第一个数字
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), ctx);
    /**
     * 绘制小时的第二个数字
     * 因为半径是8，实际上的距离是7 * 2 所以是 14 * （半径 + 1）的距离
     * 为了留有一定的空隙，所以改成 15 * （半径 + 1）
     */
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), ctx);
    /**
     * 绘制冒号
     * 一个数字是15 那么第二个数字是30
     */
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, ctx);
    //绘制分钟，因为冒号占用的是4，4*2+1是9
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), ctx);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), ctx);
    //又一个冒号
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, ctx);
    //绘制秒数
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), ctx);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), ctx);

    //绘制彩色小球
    for (var i = 0; i < balls.length; i++) {
        ctx.fillStyle = balls[i].color;
        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }
}

//绘制一个具体的数字
function renderDigit(x, y, num, ctx) {
    ctx.fillStyle = "rgb(0,102,153)";

    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                ctx.beginPath();
                ctx.arc(
                    x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    RADIUS,
                    0, 2 * Math.PI
                );
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}

//对当前数据进行调整
function update() {
    //得到下一次时间
    var nextShowTimeSeconds = getCurShowTimeSeconds();
    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = nextShowTimeSeconds % 60;

    //得到当前时间
    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = curShowTimeSeconds % 60;

    //比较两个时间是不是已经变化的，实际上只用看秒数就可以了
    if (curSeconds != nextSeconds) {
        //判断当前小时的十位数是不是不等于下一次小时的十位数
        if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
            //成立则记录这个小球
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
        }
        if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
            addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours / 10));
        }

        if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
            addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
        }
        if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
            addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
        }

        if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
            addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
        }
        if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds % 10));
        }

        //如果成立，就让当前时间等于下一次的时间
        curShowTimeSeconds = nextShowTimeSeconds;
    }

    //更新所有的小球位置
    updateBalls();
    // console.log( balls.length);

}

//对所有的小球位置进行更新
function updateBalls() {

    //循环得到每一个小球
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;  //小球的x轴加上x轴的速度值
        balls[i].y += balls[i].vy;  //小球的y轴加上y轴的速度值
        balls[i].vy += balls[i].g;   //小球在y轴的速度受到重力的影响

        //对地板底部碰撞进行判断
        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;    //碰撞地板后小球的y轴位置就等于底部接触地板的坐标
            balls[i].vy = -balls[i].vy * FRICTION;       //小球每次弹起功耗的消耗情况
        }
    }

    var cnt = 0; //记录还有个小球还在整个画布内

    //清除已经不在屏幕上的小球，避免运行时间过长内存溢出
    for (var i = 0; i < balls.length; i++) {
        //小球在X轴的位置，大于0，并且大于canvas画布的宽度，满足条件则说明在屏幕内
        if(balls[i].x - RADIUS > 0 && balls[i].x-RADIUS < WINDOW_WIDTH){
            //从0-cnt个小球，都是在屏幕内的小球
            balls[cnt++] = balls[i];
        }
    }

    //删除cnt后面的小球
    //如果cnt大于300，也清空
    while(balls.length > Math.min(500,cnt)){
        balls.pop();
    }

}

//添加一个彩色的小球
function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                var aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),    //x坐标
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),    //y坐标
                    g: 1.5 + Math.random(),     //重力加速度，随机产生1.5 - 2.5的速度让小球有所不同
                    //小球在X轴的速度，0 - 1 随机数 乘 1000 用 ceil 取整
                    //如果取整结果为偶数为+1，如果为负数则为-1，最后乘4，速度为+4或-4.
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,    //小球在y轴有一个上抛的动作
                    //随机小球的颜色，用0-1随机数，乘以 coolors 的length
                    //用下取整函数floor求出0-10 不包含10的随机数
                    color: colors[Math.floor(Math.random() * colors.length)]
                }

                balls.push(aBall);
            }
        }
    }
}