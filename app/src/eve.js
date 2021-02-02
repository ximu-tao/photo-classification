var switchImg = {
    '-1':previousImg,
    '1':nextImg,
    '3': nextImg,
    '4': previousImg,
    '37':previousImg,
    '38':previousImg,
    '39':nextImg,
    '40':nextImg
}

file_drag.addEventListener('mousewheel',
// 滚轮
    (e) => {
        
        e.preventDefault()
        // console.log('a');

        switchImg[e.wheelDelta/-150]()
        
        return false
    }
)



document.addEventListener('keyup',
// 方向键
    (e)=>{
        console.log( e.keyCode );
        e.preventDefault()
        
        if ( e.keyCode in switchImg ) {
            switchImg[e.keyCode]()
        }
        
    }
)

file_drag.addEventListener('mousedown',
// 侧键
    (e) => {
        if (e.button in switchImg) {
            e.preventDefault()
            switchImg[e.button]()
        }

    }
)