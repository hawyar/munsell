import fs from 'fs'
import rl from 'readline'

// const munsellHueColors = {
//   R: 'Red',
//   YR: 'Yellow-Red',
//   Y: 'Yellow',
//   YG: 'Yellow-Green',
//   G: 'Green',
//   BG: 'Blue-Green',
//   B: 'Blue',
//   PB: 'Purple-Blue',
//   P: 'Purple',
//   RP: 'Red-Purple'
// }

async function sRGBToMunsell (r, g, b) {
  return new Promise((resolve, reject) => {
    const stream = rl.createInterface({
      input: fs.createReadStream('data/sRGBToMunsell.txt'),
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
      if (count > 1) {
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
      }
      count++
    })

    stream.on('close', () => {
      if (result.value === '') reject(new Error('No match found'))
    })

    stream.on('error', err => {
      reject(err)
    })
  })
}

export {
  sRGBToMunsell
}
