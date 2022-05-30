import * as tap from 'tap'
import { sRGBToMunsell } from './munsell.js'

tap.test('sRGB to Munsell', async (t) => {
  const munsell = await sRGBToMunsell(0, 34, 153)
  console.log(munsell)
  t.pass('ok')
  //   t.equal(value, '2.15')
  //   t.equal(chroma, '15.47')
  t.end()
})
