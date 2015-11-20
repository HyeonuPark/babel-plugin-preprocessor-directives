import {expect} from 'chai'

const basename = __dirname.split('/').reverse()[0]

let myVar = 'foo'
'#ifndef unknownFlag'
myVar = 'bar'
'#endif'

'#define myFlag'
let otherVar = 'foo'
'#ifndef myFlag'
otherVar = 'bar'
'#endif'

describe(`${basename}-ifndef in module scope`, () => {
  it('should not ignore ifndef block with unsetted flag', () => {
    expect(myVar).to.equal('bar')
  })

  it('should ignore ifndef block with setted flag', () => {
    expect(otherVar).to.equal('foo')
  })
})

describe(`${basename}-ifndef in block scope`, () => {
  it('should not ignore ifndef block with unsetted flag', () => {
    let someVar = 'foo'
    '#ifndef whoKnowFlag'
    someVar = 'bar'
    '#endif'
    expect(someVar).to.equal('bar')
  })

  it('should ignore ifndef block with setted flag', () => {
    '#define anotherFlag'
    let justVar = 'foo'
    '#ifndef anotherFlag'
    justVar = 'bar'
    '#endif'
    expect(justVar).to.equal('foo')
  })
})
