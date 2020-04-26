const { rollup } = require('rollup')
const fs = require('fs')
const config = require('./config')

const { terser } = require('rollup-plugin-terser')
const rollupCommonJS = require('@rollup/plugin-commonjs')
const rollupNodeResolve = require('@rollup/plugin-node-resolve')

const { nativeRequireRollupPlugin } = require('@tybys/native-require/plugins/rollup.js')

const p = function (...args) {
  const path = require('path')
  return path.isAbsolute(args[0]) ? path.join(...args) : path.join(__dirname, '..', ...args)
}

function getRollupConfig (minify) {
  const outputFilename = minify ? p(config.output, `${config.outputName}.min.js`) : p(config.output, `${config.outputName}.js`)
  const format = config.format != null ? config.format : 'umd'
  return {
    input: {
      input: p(config.entry),
      plugins: [
        nativeRequireRollupPlugin(),
        rollupNodeResolve(),
        rollupCommonJS({
          extensions: ['.js']
        }),
        ...(minify ? [terser({
          ...(config.terserOptions || {}),
          module: (config.terserOptions && config.terserOptions.module) || (['es', 'esm', 'module']).includes(format)
        })] : [])
      ]
    },
    output: {
      file: outputFilename,
      format: format,
      name: config.library,
      exports: 'named'
    }
  }
}

async function rollupBundle (rollupConfig) {
  return await Promise.all(rollupConfig.map(conf => rollup(conf.input).then(bundle => bundle.write(conf.output)))).then(() => {
    if (config.replaceESModule === true) {
      rollupConfig.forEach(conf => {
        let code = fs.readFileSync(p(conf.output.file), 'utf8')
        code = code.replace(/(.\s*)?Object\.defineProperty\s*\(\s*(exports|\S{1})\s*,\s*(['"])__esModule['"]\s*,\s*\{\s*value\s*:\s*(.*?)\s*\}\s*\)\s*;?/g, (_match, token, exp, quote, value) => {
          const iifeTemplate = (content, replaceVar) => {
            if (replaceVar != null && replaceVar !== '') {
              return `(function(${replaceVar}){${content.replace(new RegExp(exp, 'g'), replaceVar)}})(${exp})`
            }
            return `(function(){${content}})()`
          }
          const content = (iife) => `try{${iife ? 'return ' : ''}Object.defineProperty(${exp},${quote}__esModule${quote},{value:${value}})}catch(_){${iife ? 'return ' : ''}${exp}.__esModule=${value}${iife ? `,${exp}` : ''}}`
          const _token = token === undefined ? undefined : token.trim()
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (!_token) return content(false)
          if (_token === '{' || _token === ';') {
            return `${token}${content(false)}`
          } else if (_token === ')' || /^[a-zA-Z$_][a-zA-Z\d_]*$/.test(_token)) {
            return `${token};${content(false)}`
          } else {
            return `${token}${iifeTemplate(content(true), exp === 'this' ? 'e' : '')}`
          }
        })
        code = code.replace(/exports\.default/g, 'exports[\'default\']')
        fs.writeFileSync(p(conf.output.file), code, 'utf8')
      })
    }
  })
}

rollupBundle([getRollupConfig(false), getRollupConfig(true)])
