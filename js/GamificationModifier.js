/**
 * Allows users to earn points from activities.
 */
 export default class GamificationModifier {

    /** Modifier info */
    name = 'Gamification'

    get settings () {
        let settings = [
            { type: 'description', name: `Assign points to entity actions.` },
            { type: 'number', id: 'openlinkpoints', name: 'Open Link', help: `Points gained whenever a user triggers the 'Open Link' action.`},
            { type: 'number', id: 'actionscripterpoints', name: 'Action Scripter', help: `Points gained whenever a user triggers an 'Action Scripter' action.`},
            { type: 'number', id: 'clickpoints', name: 'Click', help: `Points gained whenever a user clicks on the object.`},
        ]
        return settings
    }

    /** Entity */
    entity = null

    /** Called on load */
    onLoad() {
        metapress.messaging.send('global', 'gamification:score', {source: 'actionscripter', entity: this.entity.id, action:'action'})
        metapress.messaging.send('global', 'gamification:score', {source: 'openlink', entity: this.entity.id})
    }

    /** Called when the modifier has been unloaded */
    onUnload() {

    }
}