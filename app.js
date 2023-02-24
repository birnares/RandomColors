const cols = document.querySelectorAll('.col')

// изменение цвета на странице путем нажания пробела 
document.addEventListener('keydown', event => {
    event.preventDefault()
    if (event.code.toLowerCase() === 'space') {
        setRandomColors() 
    }
})
// копирование название цвета при клике на текст
document.addEventListener('click', event => {
    const type = event.target.dataset.type
        
// добавляем проверку, чтобы всегда при клике на иконку мы получали именно ее, а не кнопку
    if(type === 'lock') {
        const node = event.target.tagName.toLowerCase() === 'i'
        ? event.target
        : event.target.children[0]
        
        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
    } else if (type === 'copy') {
        copyToClickboadrd(event.target.textContent)
    }
})

// создаем функцию для генерации рандомного цвета
function generateRandomColor(){
    // RGB (red, green, blue)
    // #FF0000 (red)
    // #00FF00 (green)
    // #0000FF (blue)

    const hexCodes = '01234567890ABCDEF'

    let color = ''
    for(let i = 0; i < 6; i++) {
        color += hexCodes[Math.floor(Math.random() *hexCodes.length)]
    }
    return '#' + color
}

function copyToClickboadrd(text) {
    return navigator.clipboard.writeText(text) // сама конструкция возвращает промис, на всякий случай пишу return если это нужно будет обработать
}

function setRandomColors(isInitial) {
    const colors = isInitial ? getColorsFromHash() : []
    cols.forEach((col, index) => {
        const isLocked = col.querySelector('i').classList.contains('fa-lock')
        const text = col.querySelector('h2')
        const button = col.querySelector('button')
        // const color = generateRandomColor() // используем библиотеку для упрощения работы
        // при помощи двойного тернарного оператора мы делаем проверку, если цветов при первичной загрузке нет, он сделает их рандомными, а если мы скидывает url, то цвета фиксируются в хэше и не меняются при загрузке страницы 
        const color = isInitial 
        ? colors[index] 
            ? colors[index] 
            : chroma.random()
        : chroma.random()

        if (isLocked) { 
            colors.push(text.textContent)
            return
        }
        
        if(!isInitial) {
            colors.push(color)
        }

        text.textContent = color
        col.style.background = color

        setTextColor(text, color)
        setTextColor(button, color)
    })

    updateColorHash(colors)
}

function setTextColor (text, color) {
    const luminance = chroma(color).luminance()
    text.style.color = luminance > 0.5 ? 'black' : 'white'
}

function updateColorHash(colors = []) {
    document.location.hash = colors.map(col => col.toString().substring(1)).join('-')
}

function getColorsFromHash () {
    if (document.location.hash.length > 1){
        return document.location.hash
        .substring(1)
        .split('-')
        .map(color => '#' + color)
    }
}

setRandomColors(true)