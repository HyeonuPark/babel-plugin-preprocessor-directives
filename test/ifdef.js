import {expect} from 'chai'

const basename = __dirname.split('/').reverse()[0]

let myVar = 'foo'
'#ifdef unknownFlag'
myVar = 'bar'
'#endif'

'#define myFlag'
let otherVar = 'foo'
'#ifdef myFlag'
otherVar = 'bar'
'#endif'

describe(`${basename}-ifdef in module scope`, () => {
  it('should ignore ifdef block with unsetted flag', () => {
    expect(myVar).to.equal('foo')
  })

  it('should not ignore ifdef block with setted flag', () => {
    expect(otherVar).to.equal('bar')
  })
})

describe(`${basename}-ifdef in block scope`, () => {
  it('should ignore ifdef block with unsetted flag', () => {
    let someVar = 'foo'
    '#ifdef whoKnowFlag'
    someVar = 'bar'
    '#endif'
    expect(someVar).to.equal('foo')
  })

  it('should not ignore ifdef block with setted flag', () => {
    '#define anotherFlag'
    let justVar = 'foo'
    '#ifdef anotherFlag'
    justVar = 'bar'
    '#endif'
    expect(justVar).to.equal('bar')
  })
})
