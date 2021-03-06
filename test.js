import * as tap from 'tap'
import { munsellTosRGB, sRGBToMunsell } from './munsell.js'

tap.test('sRGB to Munsell', async (t) => {
  t.test('1', async (t) => {
    const { hue, value } = await sRGBToMunsell(153, 34, 85)
    t.equal(hue, '8.7RP')
    t.equal(value, 3.46)
    t.end()
  })

  t.test('2', async (t) => {
    const { hue, chroma } = await sRGBToMunsell(0, 34, 153)
    t.equal(hue, '6.67PB')
    t.equal(chroma, 15.47)
    t.end()
  })
})

tap.test('Munsell to sRGB', async (t) => {
  t.test('1', async (t) => {
    const rgb = await munsellTosRGB('5.0R', 1, 2)
    t.same(rgb, { r: 46, g: 21, b: 29 })
    t.end()
  })
})
