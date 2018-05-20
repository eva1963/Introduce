let loadingRender = (function() {
    let $loadingBox = $('.loadingBox'),
        $current = $loadingBox.find('.current'),
        imgData = ["img/icon.png", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_style1.jpg", "img/zf_style2.jpg", "img/zf_style3.jpg", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacher1.png", "img/zf_teacher2.png", "img/zf_teacher3.jpg", "img/zf_teacher4.png", "img/zf_teacher5.png", "img/zf_teacher6.png", "img/zf_teacherTip.png"];


    let n = 0,
        len = imgData.length;
    let run = function(callback) {
        imgData.forEach(item => {
            let tempImg = new Image;
            tempImg.onload = () => {
                tempImg = null;
                $current.css('width', ((++n) / len * 100 + '%'));
                if (n === len) {
                    clearTimeout(delayTimer);
                    callback && callback();
                }
            }
            tempImg.src = item;
        })
    }

    /* 假设最长等待时间10s */
    let delayTimer = null;
    let maxDelay = () => {
        delayTimer = setTimeout(() => {
            if (n / len >= 0.9) {
                $current.css('width', '100%');
                callback && callback();
                return;
            }
            alert('sorry, you net is hen cha!! plase try waite a moment~');
            /* window.location.href = '想跳到哪就跳到哪' */
        }, 10000)
    }

    let done = () => {
        /* 停留1s让用户可以看到加载玩的效果 */
        let timer = setTimeout(() => {
            $loadingBox.remove();
            clearInterval(timer);
            phoneRender.init();
        }, 1000)
    }

    return {
        init: function() {
            $loadingBox.css('display', 'block');
            run(done);
            maxDelay(done);
        }
    }
})();

let phoneRender = (function() {

    let $phoneBox = $('.phoneBox'),
        $time = $phoneBox.find('h2>span'),
        $answer = $phoneBox.find('.answer'),
        $answerMarkLink = $answer.find('.markLink'),
        $hang = $phoneBox.find('.hang'),
        $hangMarkLink = $hang.find('.markLink'),
        answerBell = $('#answerBell')[0],
        introduction = $('#introduction')[0];

    let answerMarkTouch = function() {
        $answer.remove();
        answerBell.pause();
        $(answerBell).remove();
        $hang.css('transform', 'translateY(0rem)');
        introduction.play();
        $time.css('display', 'block');
        computedTime();
    }

    let autoTimer = null;
    let computedTime = function() {
        let duration = 0;
        /* 我们让audio播放，它首先去加载资源，部分资源加载完成才会播放，才会计算出总时间，duration等信息，所以我们把获取信息放到canplay事件当中 */
        introduction.oncanplay = function() {
            duration = introduction.duration;
        }
        autoTimer = setInterval(() => {
            let val = introduction.currentTime;

            if (val === duration) {
                clearInterval(autoTimer);
                closePhone();
                return;
            }
            let minute = Math.floor(val / 60),
                second = Math.floor(val - minute * 60);
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            $time.html(`${minute}:${second}`);
        }, 1000)

    }

    let closePhone = function() {
        clearInterval(autoTimer);
        introduction.pause();
        $phoneBox.remove();

        messageRender.init();
    }
    return {
        init: function init() {
            $phoneBox.css('display', 'block');
            answerBell.play();
            answerBell.volume = 0.5;
            $answerMarkLink.tap(answerMarkTouch);
            $hangMarkLink.tap(closePhone);
        }
    }
})();

let messageRender = (function() {
    let $messageBox = $('.messageBox'),
        $wrapper = $('.wrapper', $messageBox),
        $messageList = $wrapper.find('li'),
        $keyBoard = $messageBox.find('.keyBoard'),
        $textInp = $keyBoard.find('span'),
        demoMusic = $('#demoMusic')[0],
        $submit = $keyBoard.find('.submit');

    let step = -1,
        total = $messageList.length + 1; //记录信息总条数，自己发一条所以+1
    let autoTimer = null,
        interval = 2000;


    let showMessage = function() {
        ++step;
        /* 此时已经展示了两条信息，我们先暂停对话框出来，让键盘出来并且手动发送一条信息 */
        if (step === 2) {
            clearInterval(autoTimer);
            handleSend();
            return;
        }
        $messageList.eq(step).addClass('active');

        if (step >= 3) {
            /* 当展示的对话框 */
            let curH = $messageList.eq(step)[0].offsetHeight,
                wraT = parseFloat($wrapper.css('top'));

            $wrapper.css('top', wraT - curH);
        }
        if (step >= total - 1) {
            /* 展示完了，解除定时器 */
            clearInterval(autoTimer);

            closeMessage();
        }
    }

    /* 手动发送 */
    let handleSend = function() {
        $keyBoard.css('transform', 'translateY(0)')
            .one('transitionend', () => {
                /* 
                transitionend： 监听当前元素transition动画结束的事件
                有几个样式属性改变，并且执行了过度效果，事件就会被触发几次
                 */
                let str = '好的，马上介绍',
                    textTimer = null,
                    n = -1;
                textTimer = setInterval(() => {

                    let orginHTML = $textInp.html();
                    // console.log(111, orginHTML, 222, str[++n]);
                    $textInp.html(orginHTML + str[++n]);
                    if (n >= str.length - 1) {
                        clearInterval(textTimer);
                        $submit.css('display', 'block');
                        return;
                    }
                }, 100)
            })
    }

    /* 点击submit */
    let handleSubmit = () => {
        $(`  <li class="self">
        <i class="arrow"></i>
        <img src="img/zf_messageStudent.png" alt="" class="pic">${$textInp.html()}</li>`).insertAfter($messageList.eq(1)).addClass('active');

        /* 新增一条li之后必须重新获取$messageList列表 */
        $messageList = $wrapper.find('li');
        /* 该消失的消失掉 */
        $textInp.html('');
        $keyBoard.css('transform', 'translateY(3.7rem)');

        // 继续展示剩余的消息
        autoTimer = setInterval(showMessage, interval);
    }

    let closeMessage = () => {
        let delayTimer = setInterval(() => {
            demoMusic.pause();
            $(demoMusic).remove();
            $messageBox.remove();
            clearInterval(delayTimer);
        }, interval);
    }

    return {
        init: function() {
            $messageBox.css('display', 'block');
            /* 进来立即运行一次，展示第一条信息，然后执行定时器，两秒发送一条信息 */
            showMessage();
            autoTimer = setInterval(showMessage, interval);
            $submit.tap(handleSubmit);
            demoMusic.play();
        }
    }
})();


let cubeRender = (function() {
    let $cubeBox = $('.cubeBox'),
        $cube = $('.cube'),
        $cubeList = $('.cube>li');

    let start = function(ev) {
        let point = ev.changedTouches[0];
        this.startX = point.clientX;
        this.startY = point.clientY;
        this.changeX = 0;
        this.changeY = 0;

    }

    let move = function(ev) {
        let point = ev.changedTouches[0],
            curX = point.clientX,
            curY = point.clientY;
        this.changeX = curX - this.startX;
        this.changeY = curY - this.startY;
    }

    let end = function(ev) {

        let { changeX, changeY, rotateX, rotateY } = this,
        isMove = false;
        Math.abs(changeX) > 10 || Math.abs(changeY) > 10 ? isMove = true : null;

        if (isMove) {
            /* 左右滑动 =>changeX   =>  rotateY（正比，change越大，rotate越大） */
            /* 上下滑动 =>changeY   =>  rotateX（正比，change越小，rotate越大） */
            rotateX = rotateX - changeY / 3;
            rotateY = rotateY + changeX / 3;
            $(this).css('transform', `scale(0.7) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
        }
        this.rotateX = rotateX;
        this.rotateY = rotateY;

    }

    return {
        init: function() {
            $cubeBox.css('display', 'block');
            let cube = $cube[0];
            cube.rotateX = -35;
            cube.rotateY = 35;
            $cube.on('touchstart', start)
                .on('touchmove', move)
                .on('touchend', end);

            $cubeList.tap(function() {
                $cubeBox.css('display', 'none');
                let index = $(this).index();
                detailRender.init(index);
            })
        }
    }
})();


let detailRender = (function() {
    let $detailBox = $('.detailBox'),
        swiper = null,
        $dl = $('.page1 > dl');
    let initSwiper = function() {
        swiper = new Swiper('.swiper-container', {
            /*  initialSlide: 2, */
            /*  direction: 'vertical' */
            effect: 'coverflow',
            /*  slidesPerView: 3, */
            /* loop: true 切换原理，把真实的第一张克隆一份放到末尾，把真实的最后一张也克隆一份放到开头  */
            /* activeIndex: 当前展示slide的索引 */
            /* slides:获取所有的slide（数组）： */
            /* slideTo: 切换到指定索引的slide */
            // centeredSlides: true,
            // coverflow: {
            //     rotate: 30,
            //     stretch: 10,
            //     depth: 60,
            //     modifier: 2,
            //     slideShadows: true
            // },
            onInit: move,
            onTransitionEnd: move
        });
    }

    let move = function(swiper) {
        /* swiper是当前创建的实例 */
        /* 判断当前是否为第一个slide如果是，让3D菜单展开，不是，则收起 */
        let activeIn = swiper.activeIndex,
            slideAry = swiper.slides;

        if (activeIn === 0) {
            $dl.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            })
            $dl.makisu('open');
        } else {
            $dl.makisu({
                selector: 'dd',
                speed: 0
            })
            $dl.makisu('close');
        }

        [].forEach.call(slideAry, (item, index) => {
            if (activeIn === index) {
                item.id = `page${index + 1}`;
                return;
            }
            item.id = null;
        });
    }



    return {
        init: function(index = 0) {
            $detailBox.css('display', 'block');
            /* 防止重复初始化 */
            if (!swiper) initSwiper();
            /* 0就是立即切换没有任何动画效果 */
            swiper.slideTo(index, 0);
        }
    }
})();
/* 开发过程中，由于当前项目的板块过多，每一个板块都是一个单例，
我们可以通过表示的判断让程序只执行对应的版块内容，这样开发那个板块，
我们就把表示改为啥（HASN路由控制） */

$(document).on('touchstart touchmove touchend', (ev) => {
    ev.preventDefalut ? ev.preventDefalut() : ev.returnValue = false;
})

let url = window.location.href,
    well = url.indexOf('#'),
    hash = well === -1 ? null : url.substr(well + 1);

switch (hash) {
    case 'loading':
        loadingRender.init();
        break;
    case 'phone':
        phoneRender.init();
        break;
    case 'message':
        messageRender.init();
        break;
    case 'cube':
        cubeRender.init();
        break;
    case 'detail':
        detailRender.init();
        break;
    default:
        loadingRender.init();
        break;
}