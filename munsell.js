import fs from 'fs'
import rl from 'readline'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

async function sRGBToMunsell (r, g, b) {
  if (r > 255 || g > 255 || b > 255) {
    throw new Error('sRGB values must be between 0 and 255')
  }

  return new Promise((resolve, reject) => {
    const stream = rl.createInterface({
      input: fs.createReadStream(path.join(dirname, 'data', 'sRGBToMunsell.txt')),
      crlfDelay: Infinity
    })

    let count = 0

    let result = {
      value: '',
      chroma: '',
      hue: ''
    }

    stream.on('line', line => {
      // skip first two lines
      if (count <= 1) {
        count++
        return
      }
      let hueVal = ''

      const [R, G, B, H, V, C] = line.split('\t').map(x => {
        if (x.match(/[A-Z]/)) {
          hueVal = x.match(/[A-Z]/g).join('')
        }
        return parseFloat(x.trim())
      })

      if (r === R && g === G && b === B) {
        result = {
          hue: H + hueVal,
          value: V,
          chroma: C
        }
        stream.close()
        resolve(result)
      }
    })

    stream.on('close', () => {
      if (result.hue === '' && result.value === '' && result.chroma === '') {
        reject(new Error('No match found'))
      }
    })

    stream.on('error', err => {
      reject(err)
    })
  })
}

async function munsellTosRGB (h, v, c) {
  if (typeof h !== 'string' || typeof v !== 'number' || typeof c !== 'number') {
    throw new Error('hue must be a string and value and chroma must be numbers')
  }

  return new Promise((resolve, reject) => {
    const stream = rl.createInterface({
      input: fs.createReadStream(path.join(dirname, 'data', 'MunsellRenotationTosRGB.txt')),
      crlfDelay: Infinity
    })

    let count = 0

    let result = {
      r: '',
      g: '',
      b: ''
    }

    stream.on('line', line => {
      // skip first line
      if (count === 0) {
        count++
        return
      }

      // ignore last element gamut
      const [H, V, C, R, G, B] = line.split('\t').map(x => x.trim())

      if (h === H && v.toString() === V && c.toString() === C) {
        result = {
          r: parseInt(R),
          g: parseInt(G),
          b: parseInt(B)
        }
        stream.close()
        resolve(result)
      }
    })

    stream.on('close', () => {
      if (result.r === '' && result.g === '' && result.b === '') {
        reject(new Error('No match found'))
      }
    })

    stream.on('error', err => {
      reject(err)
    })
  })
}

export {
  sRGBToMunsell,
  munsellTosRGB
}
