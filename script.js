const axios = require('axios')
const screenshot = require('screenshot-desktop')
const fs = require('fs')

// usage: node script <yandexOauthToken> <yandexCloudFolderId>
if (process.argv.length < 4) throw new Error('Not Enough cli args')

const oauthToken = process.argv[2], folderId = process.argv[3]


async function getIamToken() {
  const axiosConfig = {
    method: 'post',
    url: 'https://iam.api.cloud.yandex.net/iam/v1/tokens',
    headers: { 'Content-Type': 'application/json' },
    data: { 'yandexPassportOauthToken': oauthToken }
  }

  const response = await axios(axiosConfig)

  return response.data.iamToken
}

async function getEncodedImage() {
  const path = await screenshot({ filename: './images/img.jpg' })
  const file = fs.readFileSync(path)
  const encoded = Buffer.from(file).toString('base64')

  return encoded
}

async function processImage(iamToken, folderId, encodedImage) {
  const axiosConfig = {
    method: 'post',
    url: 'https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${iamToken}`
    },
    data: {
      'folderId': folderId,
      'analyze_specs': [{
          'content': encodedImage,
          'features': [{
              'type': 'TEXT_DETECTION',
              'text_detection_config': {
                  'language_codes': ['*']
              }
          }]
      }]
    }
  }

  const response = await axios(axiosConfig)

  return response.data
}


async function main() {
  try {
    const iamToken = await getIamToken()
    const encoded = await getEncodedImage()
    const result = await processImage(iamToken, folderId, encoded) 

    console.log(JSON.stringify(result, null, ' '))
  } catch (error) {
    console.log(error)
  }
}

main()