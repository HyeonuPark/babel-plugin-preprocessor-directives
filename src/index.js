const DEFINE_MAP = Symbol('defineMap')

const defineRE = /^\s*\#define\s+(\S+)(?:\s+(\S+))?\s*/
const undefRE = /^\s*\#undef\s+(\S+)\s*/
const ifdefRE = /^\s*\#ifdef\s+(\S+)\s*/
const ifndefRE = /^\s*\#ifndef\s+(\S+)\s*/
const endifRE = /^\s*\#endif\s*/

function checkDirectives (t, path, state) {
  let {directives, body} = path.node
  directives = directives || []

  const defineMap = state.get(DEFINE_MAP)

  let ifStackHeight = 0
  path.node.body = directives.concat(body).filter(node => {
    let {type} = node
    let value
    if (type === 'Directive') {
      value = node.value.value
    } else if (
      type === 'ExpressionStatement' &&
      node.expression.type === 'StringLiteral'
    ) {
      value = node.expression.value
    }

    if (value) {
      const ifdef = ifdefRE.exec(value)
      if (ifdef) {
        if (ifStackHeight > 0) {
          ifStackHeight++
          return false
        }
        if (!defineMap.has(ifdef[1])) {
          ifStackHeight++
        }
        return false
      }

      const ifndef = ifndefRE.exec(value)
      if (ifndef) {
        if (ifStackHeight > 0) {
          ifStackHeight++
          return false
        }
        if (defineMap.has(ifndef[1])) {
          ifStackHeight++
        }
        return false
      }

      const endif = endifRE.exec(value)
      if (endif) {
        if (ifStackHeight > 0) ifStackHeight--
        if (ifStackHeight <= 0) {
          ifStackHeight = 0
        }
        return false
      }
    }

    if (ifStackHeight > 0) return false

    if (value) {
      const define = defineRE.exec(value)
      if (define) {
        const key = define[1]
        let value = define[2]
        if (typeof value === 'undefined') value = null
        defineMap.set(key, value)
        return false
      }

      const undef = undefRE.exec(value)
      if (undef) {
        defineMap.delete(undef[1])
        return false
      }
    }

    return type !== 'Directive'
  })
}

module.exports = function ({types: t}) {
  return {
    visitor: {
      Program (path, state) {
        const defineMap = new Map()
        const predefined = state.opts.predefined
        if (typeof predefined === 'object') {
          Object.keys(predefined).forEach(key => {
            const value = predefined[key]
            if (typeof key !== 'string' || typeof value !== 'string') return
            defineMap.set(key, value)
          })
        }
        state.set(DEFINE_MAP, defineMap)
        checkDirectives(t, path, state)
      },

      BlockStatement (path, state) {
        checkDirectives(t, path, state)
      },

      Identifier (path, state) {
        const {name} = path.node
        const defineMap = state.get(DEFINE_MAP)
        const alias = defineMap.get(name)
        if (typeof alias === 'string' && alias !== name) {
          path.replaceWith(t.identifier(alias))
        }
      }
    }
  }
}
