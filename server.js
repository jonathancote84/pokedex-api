require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const POKEDEX = require('./pokedex.json')

console.log(process.env.API_TOKEN)
const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`,`Fairy`,`Fighting`,`Fire`,`Flying`,`Ghost`,`Grass`,`Ground`,`Ice`,`Normal`,`Poisin`,`Psychic`,`Rock`,`Steel`,`Water`]

app.use(function validateBearerToken(req, res, next) {

    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

   
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next() 
})

function handleGetTypes(req, res) {
    res.json(validTypes)
}

app.get('/types', handleGetTypes)

function handleGetPokemon(req, res) {
    let response = POKEDEX.pokemon;

    //filter our pokemon by name if name query param is present
    if (req.query.name) {
        response = response.filter(pokemon => 
        // case insensitive searching
        pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
        )
    }

    //filter our pokemon by type is type query param is present
    if (req.query.type) {
        response = response.filter(pokemon => 
            pokemon.type.includes(req.query.type)
        )
    }

    res.json(response)
}

app.get('/pokemon', handleGetPokemon)

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})