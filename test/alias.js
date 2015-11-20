import {expect} from 'chai'

const basename = __dirname.split('/').reverse()[0]

describe(`${basename}-Identifiers`, () => {
  it('should be replaced when matching alias is defined', () => {
    let data = {someReallyLongAndAnnoyingName: 'foo'}
    '#define shorten someReallyLongAndAnnoyingName'
    expect(data.shorten).to.equal('foo')
  })
})
