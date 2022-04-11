const emojiTestRegexPatternUrl = 'https://unpkg.com/emoji-test-regex-pattern@latest/dist/latest/javascript.txt'
const emojiDataUrl = 'https://unpkg.com/unicode-emoji-json@0.3.1/data-by-emoji.json'

const twemojiOptions = {
    folder: 'svg',
    ext: '.svg',
}

let emojiData = null
let emojiTestRegexPattern = null

const emojiDataPromise = fetch(emojiDataUrl).then(data => data.json()).then(json => emojiData = json)
const emojiTestRegexPatternPromise = fetch(emojiTestRegexPatternUrl).then(data => data.text()).then(text => emojiTestRegexPattern = text)

document.addEventListener('DOMContentLoaded', async () => {
    const renderInTwemojiToggle = document.querySelector('#render-in-twemoji-toggle')
    const contentInputField = document.querySelector('#content-input')
    const emojiExplainList = document.querySelector('#emoji-explain')
    const twemojiPreview = document.querySelector('.twemoji-preview')
    const twemojiPreviewContainer = document.querySelector('.twemoji-preview-container')
    const placeholders = document.querySelectorAll('.placeholder')

    const refreshTwemojiPreview = () => {
        if (renderInTwemojiToggle.checked) {
            twemojiPreviewContainer.style.display = 'flex'
            twemojiPreview.innerHTML = contentInputField.value
            twemoji.parse(twemojiPreview, twemojiOptions)
        } else {
            twemojiPreviewContainer.style.display = 'none'
        }
    }

    const refreshEmojiExplainList = () => {
        const content = contentInputField.value
        const emojiMatchResult = content.matchAll(emojiTestRegexPattern)
        emojiExplainList.innerHTML = ''
        const emojiSet = new Set()
        for (const emoji of emojiMatchResult) {
            emojiSet.add(emoji[0])
        }
        if (emojiSet.size === 0 && content.length !== 0) {
            emojiExplainList.innerHTML = '<div style="text-align: center">😢 No emoji detected</div>'
        } else {
            for (const emoji of emojiSet) {
                const emojiElement = document.createElement('li')
                emojiElement.appendChild(document.createTextNode(`${emoji}${emojiData.hasOwnProperty(emoji) ? `: ${emojiData[emoji].name}` : ''}`))
                emojiExplainList.appendChild(emojiElement)
            }
            if (renderInTwemojiToggle.checked) {
                twemoji.parse(emojiExplainList, twemojiOptions)
            }
        }
    }

    const refreshPlaceholder = () => {
        if (contentInputField.value.length !== 0) {
            placeholders.forEach(item => {
                item.style.display = 'none'
            })
        } else {
            placeholders.forEach(item => {
                item.style.display = 'block'
            })
        }
    }

    const refreshAllPanel = () => {
        refreshTwemojiPreview()
        refreshEmojiExplainList()
    }

    Promise.all([emojiDataPromise, emojiTestRegexPatternPromise]).then(() => {
        contentInputField.addEventListener('input', () => {
            refreshPlaceholder()
            refreshAllPanel()
        })

        renderInTwemojiToggle.addEventListener('change', e => {
            refreshAllPanel()
            if (e.target.checked) {
                window.localStorage.setItem('config', JSON.stringify({
                    twemoji: true
                }))
            } else {
                window.localStorage.setItem('config', JSON.stringify({
                    twemoji: false
                }))
            }
        })
        contentInputField.focus()
    })

    const configStr = window.localStorage.getItem('config')
    const config = JSON.parse(configStr)
    if (config.hasOwnProperty('twemoji') && config.twemoji) {
        renderInTwemojiToggle.checked = true;
        twemojiPreviewContainer.style.display = 'flex'
    }
})