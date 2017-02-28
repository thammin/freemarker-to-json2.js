const fs = require('fs')
const { safeLoad } = require('js-yaml')
const { convert } = require('json-to-json-schema')

module.exports = transform

/**
 * main transform
 * @param {String} input - input file of yaml
 * @param {String} output - output file of ftl
 */
function transform (input, output) {
  return new Promise((resolve, reject) => {
    if (!input) {
      reject(new Error('Please specific input file.'))
    }

    let inputJson = safeLoad(fs.readFileSync(input, 'utf-8'))
    let schema = convert(inputJson)
    let result = walk(schema.properties, {})

    if (output) {
      fs.writeFileSync(output, result, 'utf-8')
    }

    resolve(result)
  })
}

/**
 * walk every key of an object
 * @param {Object} schema - json schema object
 * @param {String?} option.shortpath - a short relative path to certain value. Exp: `abc.def.ghi`
 * @param {String?} option.indent - estimated indent string
 * @param {String?} option.breakRoot - an extra middle root that overwrite the main root of relative path
 */
function walk (schema, option) {
  option.indent = (option.indent || '')

  let start = `{\n`
  let end = `\n${option.indent}}`
  let properties = []

  for (let key in schema) {
    let extendedPath = option.shortpath ? `${option.shortpath}.${key}` : key
    let recursion = print(schema[key], {
      shortpath: extendedPath,
      indent: option.indent + '  ',
      breakRoot: option.breakRoot
    })
    properties.push(`  ${option.indent}"${key}": ${recursion}`)
  }

  return start + properties.join(',\n\n') + end
}

/**
 * print every type of object schema
 * @param {Object} schema - json schema object
 * @param {String?} option.shortpath - a short relative path to certain value. Exp: `abc.def.ghi`
 * @param {String?} option.indent - estimated indent string
 * @param {String?} option.breakRoot - an extra middle root that overwrite the main root of relative path
 */
function print (schema, option) {
  let { root, sub } = split(option.shortpath)

  switch (schema.type) {
    case 'object':
      return walk(schema.properties, option)

    case 'array':
      let arrayRoot = sub ? `item.${sub}` : option.shortpath
      let start = `\n${option.indent}<@arrayFrame ${arrayRoot}; item>`
      let end = `</@arrayFrame>`
      let recursion = print(schema.items, {
        shortpath: sub ? 'item' : option.shortpath,
        indent: option.indent,
        breakRoot: 'item'
      })

      return start + recursion + end

    case 'string':
    case 'integer':
    case 'boolean':
      if (option.breakRoot) {
        if (sub) {
          return `\${get(${option.breakRoot}, '${sub}')}`
        } else {
          return `\${get(${option.breakRoot})}`
        }
      } else {
        if (sub) {
          return `\${get(${root}, '${sub}')}`
        } else {
          return `\${get(${root})}`
        }
      }

    default:
      return 'null'
  }
}

/**
 * split shortpath to root and subpath
 * @param {String} shortpath - a short relative path to certain value. Exp: `abc.def.ghi`
 * @returns {Object} an object which contains main root and sub path of `shortpath`
 */
function split (shortpath) {
  let [root, ...sub] = shortpath.split('.')

  return {
    root,
    sub: sub.join('.')
  }
}
