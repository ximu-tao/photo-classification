KeyList.canMove = false

KeyList.onmousedown = (e) => {
    KeyList.style.cursor = 'move'
    KeyList.canMove = !e.button
    KeyList.canMoveHeight = e.offsetY
    KeyList.canMoveWidth = e.offsetX
}

document.body.addEventListener('mouseup',
    (e) => {
        KeyList.style.cursor = 'default'
        KeyList.canMove = false
    }
)

var divMove = (e) => {
    let X, Y;

    X = e.clientX < 0 ? 0 : e.clientX;
    Y = e.clientY < 0 ? 0 : e.clientY;
    X = e.pageX > window.innerWidth ? window.innerWidth : X;
    Y = e.pageY > window.innerHeight ? window.innerHeight : Y;

    if (KeyList.canMove) {

        KeyList.style.top = Y - KeyList.canMoveHeight + 'px'
        KeyList.style.left = X - KeyList.canMoveWidth + 'px'
    }
}

document.addEventListener('mousemove', divMove)

var setTableEntry = async (KeyList) => {
    let klt = '<tr><th>按键</th><th>目录</th></tr>'
    for (let i in KeyList) {
        klt +=
            `<tr><td>${i}</td><td>${KeyList[i]}</td></tr>`
        
    }
    KeyListTable.innerHTML = klt
    // console.log( klt );

}