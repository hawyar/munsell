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

    stream.on('line', line => {
      if (count > 0) {
        let hueVal = ''

        const [R, G, B, H, V, C] = line.split('\t').map(x => {
          if (x.match(/[A-Z]/)) {
            hueVal = x.match(/[A-Z]/g).join('')
          }
          return parseFloat(x.trim())
        })

        if (r === R && g === G && b === B) {
          stream.close()
          resolve({
            hue: H + hueVal,
            value: V,
            chroma: C
          })
        }
      }
      count++
    })

    stream.on('error', err => {
      reject(err)
    })
  })
}

export {
  sRGBToMunsell
}
