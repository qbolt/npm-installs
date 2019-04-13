#!/usr/bin/env node

const fs = require('fs')
const os = require('os')
const cp = require('child_process')
const path = require('path')
const Yargs = require('yargs')

const npmCommand = os.platform().startsWith('win') ? 'npm.cmd' : 'npm'

const resolvePath = p => path.resolve(p)

const isNodeModules = path => path.includes('node_modules')

const notNodeModules = path => !isNodeModules(path)

const isDirectory = path => fs.lstatSync(path).isDirectory()

const isNpmModule = path =>
  fs.existsSync(`${path}/package.json`) && fs.lstatSync(path).isDirectory()

const isNpmModuleAndNotNodeModules = path =>
  isNpmModule(path) && notNodeModules(path)

const createSpawnPromise = (...args) =>
  new Promise((resolve, reject) => {
    cp.spawn(...args).on('exit', (code, signal) => {
      if (!signal) resolve({ code, signal })
      else reject({ code, signal })
    })
  })

const npmInstallAndLog = path =>
  Promise.resolve()
    .then(() => console.log(`Starting \`npm install\` for '${path}'`))
    .then(() => createSpawnPromise(npmCommand, ['install', `--prefix`, path]))
    .then(() => console.log(`Completed '${path}'`))

const getSubPaths = p => fs.readdirSync(p).map(name => path.join(p, name))

const pathsToUniqueModules = (paths, depth = 0) => {
  const loop = (acc, d = depth, next = acc) => {
    if (d < 1 || next.length === 0) {
      return acc
    }
    const sub = next
      .map(getSubPaths)
      .flat()
      .filter(isDirectory)
    return [...loop([...acc, ...sub], d - 1, sub)]
  }
  const resolvedPaths = [...new Set(paths.map(resolvePath))]
  return loop(resolvedPaths, depth, resolvedPaths).filter(
    isNpmModuleAndNotNodeModules
  )
}

const parseArgs = argv => {
  const paths = [...argv._]
  const recursiveDepth = argv.depth
  if (paths.length < 1) {
    Yargs.showHelp()
  } else {
    const npmModules = pathsToUniqueModules(paths, recursiveDepth)
    const installPromises = npmModules.map(npmInstallAndLog)
    if (installPromises.length < 1) {
      console.log('No directories found containing package.json')
    } else {
      Promise.all(installPromises).then(() => console.log('Completed all'))
    }
  }
}

Yargs.scriptName('npm-installs')
  .usage('Usage: $0 <command> [...directories] [options]')
  .command(
    '$0',
    'Runs npm install on specified directories',
    {
      depth: {
        alias: ['d', 'recursive', 'r'],
        type: 'number',
        describe: 'Depth to recurse. (Ignores node_modules)',
        default: Infinity
      }
    },
    parseArgs
  )
  .demandCommand()
  .recommendCommands()
  .strict()
  .example('$0 proj1 proj2', 'Call `npm install` on proj1 and proj2')
  .example(
    '$0 projects -r',
    'Call `npm install` on projects and all subprojects recursively (Excluding node modules)'
  )
  .example(
    '$0 projects -d 2',
    'Call `npm install` on projects and all subprojects recursively with a depth of 2 (Excluding node modules)'
  )
  .showHelpOnFail(true)
  .help('?')
  .alias('?', ['help', 'h']).argv
