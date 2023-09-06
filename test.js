require('dotenv').config()
const request = require('request-promise')
const btoa = require('btoa')
const { ISSUER, TEST_CLIENT_ID, TEST_CLIENT_SECRET, DEFAULT_SCOPE } = process.env

const test = async () => {

  const token = btoa(`${TEST_CLIENT_ID}:${TEST_CLIENT_SECRET}`)

  try {
    const { token_type, access_token } = await request({
      uri: `${ISSUER}/v1/token`,
      json: true,
      method: 'POST',
      headers: {
        authorization: `Basic ${token}`,
      },
      form: {
        grant_type: 'client_credentials',
        scope: DEFAULT_SCOPE,
      },
    })

    console.log(token_type, access_token)
    
    const response = await request({
      uri: `base_uri`,
      json: true,
      headers: {
        authorization: [token_type, access_token].join(' '),
      },
    })

  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

test()