//
// My MetaPress Plugin
import React from 'react';
import { v4 as uuidv4 } from 'uuid'

import metadata from '../package.json'
import GamificationModifier from './gamificationModifier';
import ScoreUI from './score'

export default class GamificationPlugin extends React.PureComponent {

    // Plugin information
    id              = metadata.metapress?.id || metadata.name
    name            = metadata.metapress?.name || metadata.name
    description     = metadata.metapress?.description || metadata.description
    version         = metadata.version
    provides        = [ 'gamification', 'modifier:gamification' ]
    requires        = [ 'menubar', 'entities', 'dialogs' ]

    /** Create modifier */
    createModifier() {
        return new GamificationModifier()
    }

    /** Called on load */
    onLoad() {
        metapress.addEventListener('actionScripter_onObjectAction', this.updateScore)
        metapress.addEventListener('gamification_onObjectAction', this.updateScore)

        // Register UI
        this.totalRef = new ScoreUI()

        this.loadScore()

    }

    /** Load the score from the object */
    loadScore() {
        let pointsString = localStorage.getItem('mp.gamification.points')
        let pointsObject = null
        let score = 0
        if (pointsString) {
            pointsObject = JSON.parse(pointsString)

            for (let object in pointsObject) {
                score += pointsObject[object].points
            }
        }

        this.totalScore = score

        let scoreDiv = document.getElementById('scoreTotalDiv')
        scoreDiv.innerText = 'Score:' + score
    }

    /** Called when an event is received */
    updateScore = (data) => {

        // Get entity
        let entity = null
        
        if (data.entity) {
            entity = metapress.entities.get(data.entity)
        } 

        let sourceName = data.source
        let actionName = data.action || null
        let entityID = entity?.id || null
        let points = 0

        switch ( sourceName ) {
            case 'actionscripter':
                points = parseInt(entity.actionscripterpoints) || 0
                break;
            case 'openlink':
                points = parseInt(entity.openlinkpoints) || 0
                break;
            case 'click':
                points = parseInt(entity.clickpoints) || 0
                break;
        }

        if (data.points) {
            points = parseInt(data.points)
        }

        if (!points || points == 0) 
            return

        let pointsObject = localStorage.getItem('mp.gamification.points')
        let currentPoints = {}
        let currentEntity = {}

        if (pointsObject) {
            currentPoints = JSON.parse(pointsObject)
        }

        for (let object in currentPoints) {
            if (currentPoints[object].entity == entityID) {
                if (currentPoints[object].source == sourceName) {
                    if (currentPoints[object].action && currentPoints[object].action == actionName) {
                        delete currentPoints[object]
                    } else if (!currentPoints[object].action) {
                        delete currentPoints[object]
                    }
                } 
            }

            if (!entityID && currentPoints[object].source == sourceName) {
                delete currentPoints[object]
            }
        }

        let key = uuidv4()
        currentPoints = { ...currentPoints, [key]: key };
        currentEntity.id = uuidv4()
        currentEntity.source = sourceName
        currentEntity.action = actionName
        currentEntity.entity = entityID
        currentEntity.points = points

        currentPoints[key] = currentEntity

        currentPoints = { ...currentPoints }

        localStorage.setItem('mp.gamification.points', JSON.stringify(currentPoints));

        this.loadScore()
    }
  
}   