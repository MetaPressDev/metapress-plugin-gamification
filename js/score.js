/**
 * User interface for achievement notifications.
 */
 export default class ScoreUI {

    /** Constructor for the score UI */
    constructor() {
        this._init()
    }

    /** Initialize score UI */
    _init() {
        if (!metapress?.contentDiv) {
            setTimeout(() => this._init(), 1000)
        }

        // Create container
        this.container = document.createElement('div')
        this.container.id = 'scoreTotalDiv'
        this.container.style.position = 'absolute'
        this.container.style.top = '10px'
        this.container.style.right = '10px'
        this.container.style.pointerEvents = 'none'
        this.container.style.textShadow= '2px 2px #000'
        this.container.style.zIndex = 2
        this.container.style.fontSize = '30px'
        this.container.style.fontFamily = 'fantasy'
        this.container.style.color = 'gold'

        metapress.contentDiv.appendChild(this.container)

        // Listen for any achievements that are unlocked
        metapress.addEventListener('achievement.unlocked', this.onAchievementUnlocked)
    }

 }