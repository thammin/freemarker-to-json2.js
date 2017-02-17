const fs = require('fs')
const test = require('tape')
const transform = require('../')

test('it should transform and return the result.', t => {
  let out = fs.readFileSync(`${__dirname}/output.ftl`, 'utf-8')

  transform(`${__dirname}/input.yaml`)
    .then(result => {
      t.isEqual(result, out)
      t.end()
    })
})

test('it should output the result to a file if specified.', t => {
  let out = fs.readFileSync(`${__dirname}/output.ftl`, 'utf-8')

  transform(`${__dirname}/input.yaml`, `${__dirname}/temp.ftl`)
    .then(() => {
      let temp = fs.readFileSync(`${__dirname}/temp.ftl`, 'utf-8')

      t.isEqual(temp, out)
      t.end()
    })
})
