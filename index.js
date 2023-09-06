require('dotenv').config()
const express = require('express')
const app = express()
const OktaJwtVerifier = require('@okta/jwt-verifier')
const users = require('./users.json')
const { ISSUER } = process.env

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: ISSUER,
})

app.use( async (req, res, next) => {
  
  try {

    const { authorization } = req.headers;

    if (!authorization) throw new Error('You must send an Authorization header')

    const [authType, token] = authorization.split(' ')
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token')

    await oktaJwtVerifier.verifyAccessToken(token)

    next()

  } catch (error) {
    res.sendStatus(401)
  }
  
})

app.get('/', async (req, res) => {
  res.json('Hello World!')
})

app.get('/users', async (req, res) => {
  res.json(users)
})

app.get('/users/:id', async (req, res) => {

  data = ''

  for (const p of users) {
    
    if (p.id === req.params.id) {
      data = p;
      break;
    }
  }

  (data) ? res.json(data) : res.json('ID não cadastrado')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))