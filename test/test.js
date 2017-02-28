const fs = require('fs')
const test = require('tape')
const transform = require('../')
const { safeLoad } = require('js-yaml')

const out = fs.readFileSync(`${__dirname}/output.ftl`, 'utf-8')

test('it should transform and return the result.', t => {
  transform(`${__dirname}/input.yaml`)
    .then(result => {
      t.isEqual(result, out)
      t.end()
    })
})

test('it should output the result to a file if specified.', t => {
  transform(`${__dirname}/input.yaml`, `${__dirname}/temp.ftl`)
    .then(() => {
      let temp = fs.readFileSync(`${__dirname}/temp.ftl`, 'utf-8')

      t.isEqual(temp, out)
      t.end()
    })
})

test('it should accept json file.', t => {
  let json = safeLoad(fs.readFileSync(`${__dirname}/input.yaml`, 'utf-8'))
  fs.writeFileSync(`${__dirname}/input.json`, JSON.stringify(json, null, '  '), 'utf-8')

  transform(`${__dirname}/input.json`)
    .then(result => {
      t.isEqual(result, out)
      t.end()
    })
})
