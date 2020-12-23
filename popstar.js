// 随机数组
const random = (min, max) => {
    return min + Math.floor(Math.random() * (max - min + 1))
}

const randomSquare = () => {
    let array = []
    for (let i = 0; i < 81; i++) {
        array.push(random(1, 4))
    }
    let square = a_to_s(array, 9, 9)
    return square
}

// 渲染到页面上
const templateCell = (line, x) => {
    let s = ''
    for (let i = 0; i < line.length; i++) {
        let e = `${line[i]}`
        s += `<div class="cell" data-number=${e} data-x='${x}' data-y='${i}'>${e}</div>`
    }
    return s
}

const templateRow = (square) => {
    let s = ''
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        let row = templateCell(line, i)
        s += `<div class="row clearfix">${row}</div>`
    }
    return s
}

const renderSquare = (square) => {
    let silei = templateRow(square)
    let container = e('#id-div-mime')
    container.innerHTML = silei
}

// 点击一个格子，选中它周围能消掉的格子
const red1 = (square, x, y, clickNum) => {
    if (x >= 0 && x < square.length && y >= 0 && y < square.length) {
        let ele = e(`[data-x='${x}'][data-y='${y}']`)
        let num = ele.innerHTML
        let container = e('#id-div-mime')
        let sames = Number(container.dataset.sames)

        if (!ele.classList.contains('border_red')) {
            if (num === clickNum) {
                sames += 1
                container.dataset.sames = String(sames)
                ele.classList.add('border_red')
                redAround(square, x, y)
            }
        }
    }
}

const redAround = (square, x, y) => {
    let ele = e(`[data-x='${x}'][data-y='${y}']`)
    let clickNum = ele.innerHTML
    red1(square, x, y - 1, clickNum)
    red1(square, x - 1, y, clickNum)
    red1(square, x + 1, y, clickNum)
    red1(square, x, y + 1, clickNum)
}

const bindClick1 = (square) => {
    let container = e('#id-div-mime')
    container.addEventListener('click', function(event) {
        let self = event.target
        if (self.classList.contains('cell') && self.innerHTML !== '0') {
            if (!self.classList.contains('border_red')) {
                if (container.dataset.hasred === 'true') {
                    removeClassAll('border_red')
                }
                let x = Number(self.dataset.x)
                let y = Number(self.dataset.y)
                let ele = e(`[data-x='${x}'][data-y='${y}']`)
                ele.classList.add('border_red')
                container.dataset.sames = '1'
                redAround(square, x, y)
                score()
                container.dataset.hasred = 'true'
            } else {
                if (Number(container.dataset.sames) > 1) {
                    let reds = es('.border_red')
                    for (let i = 0; i < reds.length; i++) {
                        let e = reds[i]
                        e.innerHTML = '0'
                    }
                    exChange(square)
                    scores()
                    let score = e('.each-score')
                    score.innerHTML = '0'

                }
                removeClassAll('border_red')
                container.dataset.hasred = 'false'
            }
            gameOver(square)
        }
    })
}

// 消掉相同的格子
const exChange = (square) => {
    for(let i = 0; i < square.length; i++) {
        let colum = es(`[data-y='${i}']`)
        let array1 = []
        let array0 = []
        for (let j = 0; j < colum.length; j++) {
            let num = Number(colum[j].innerHTML)
            if (num !== 0) {
                array1.push(num)
            } else {
                array0.push(num)
            }
        }
        let array = array0.concat(array1)
        for (let m = 0; m < array.length; m++) {
            colum[m].innerHTML = String(array[m])
        }
    }
    clearColum(square)
    refreshColor()
}
// 消掉列
const clearColum = (square) => {
    for (let i = square.length - 1; i >= 0; i--) {
        let colum = es(`[data-y='${i}']`)
        let array_c = []
        for (let j = 0; j < colum.length; j++) {
            let num = Number(colum[j].innerHTML)
            array_c.push(num)
        }
        if (JSON.stringify(array_c) === JSON.stringify([0,0,0,0,0,0,0,0,0])) {
            for (let n = 0; n < square.length; n++) {
                let row = es(`[data-x='${n}']`)
                let array_r0 = []
                let array_r1 = []
                for (let p = 0; p < row.length; p++) {
                    let num = Number(row[p].innerHTML)
                    if (p === i) {
                        array_r1.push(num)
                    } else {
                        array_r0.push(num)
                    }
                }
                let array_r = array_r0.concat(array_r1)
                for (let q = 0; q < array_r.length; q++) {
                    row[q].innerHTML = String(array_r[q])
                }
            }
        }
    }
}
// 计分
const score = () => {
    let score = e('.each-score')
    let container = e('#id-div-mime')
    let sames = Number(container.dataset.sames)
    if (sames > 1) {
        let each_score = sames * 20
        score.innerHTML = String(each_score)
    } else {
        score.innerHTML = '0'
    }

}

const scores = () => {
    let score_container = e('.score-container')
    let each_score = e('.each-score')
    let scores = Number(score_container.innerHTML) + Number(each_score.innerHTML)
    score_container.innerHTML = String(scores)
}
// 下一轮
// 判断游戏结束
const aroud1 = (square, x, y, clickNum) => {
    if (x >= 0 && x < square.length && y >= 0 && y < square.length) {
        let ele = e(`[data-x='${x}'][data-y='${y}']`)
        let num = ele.innerHTML
        return num === clickNum
    }
}

const aroudCell = (square, x, y) => {
    let ele = e(`[data-x='${x}'][data-y='${y}']`)
    let clickNum = ele.innerHTML

    let aroud_1 = aroud1(square, x, y - 1, clickNum)

    let aroud_2 = aroud1(square, x - 1, y, clickNum)
    let aroud_3 = aroud1(square, x + 1, y, clickNum)

    let aroud_4 = aroud1(square, x, y + 1, clickNum)
    return (aroud_1 || aroud_2 || aroud_3 || aroud_4)
}

const gameOver = (square) => {
    let cells = es('.cell')
    let array = []
    for(let i = 0; i < cells.length; i++) {
        let cell = cells[i]
        let x = Number(cell.dataset.x)
        let y = Number(cell.dataset.y)
        if (cell.innerHTML !== '0') {
            array.push(aroudCell(square, x, y))

        }
    }
    if (!array.includes(true)) {
        log('gameover')
        alert()
    }
}

const alert = () => {
    let gameover = e('.game-message')
    gameover.classList.add('game-over')
    let p = find(gameover, 'p')
    let socres = e('.score-container')
    let score = socres.innerHTML
    p.innerHTML = `You score ${score}`
}

const bindClickReplay = () => {
    let button = e('.retry-button')
    button.addEventListener('click', () => {
        let gameover = e('.game-message')
        gameover.classList.remove('game-over')
        newGame()
    })
}

const newGame = () => {
    let square = randomSquare()
    renderSquare(square)
    refreshColor()
    let score = e('.score-container')
    score.innerHTML = '0'
    let container = e('#id-div-mime')
    container.dataset.sames = '0'
    container.dataset.hasred = 'false'
    return square
}

// 配色 css
const addCSS = (ele, e) => {
    for(let i = 1; i < 5; i ++) {
        if (ele.classList.contains(`color${i}`)) {
            ele.classList.remove(`color${i}`)
        }
    }
    ele.classList.add(e)
}

const refreshColor = () => {
    let cells = es('.cell')
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i]
        let e = cell.innerHTML
        addCSS(cell, `color${e}`)
    }
}



const __main = () => {
    newGame()
    bindClick1(newGame())
    bindClickReplay()

}

__main()