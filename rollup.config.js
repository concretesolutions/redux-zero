import typescript from "rollup-plugin-typescript2"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import peerDeps from "rollup-plugin-peer-deps-external"
import uglify from "rollup-plugin-uglify"
import filesize from "rollup-plugin-filesize"

const format = process.env.NODE_ENV
const isUmd = format === "umd"

function getFileName(file) {
  if (isUmd) {
    return `${file}.min.js`
  }
  return `${file}.js`
}

function getConfig(input, file) {
  const conf = {
    input,
    name: "redux-zero",
    sourcemap: true,
    output: {
      file: getFileName(file),
      format,
    },
    plugins: [
      peerDeps(),
      typescript({ useTsconfigDeclarationDir: true }),
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      commonjs(),
    ],
  }

  isUmd && conf.plugins.push(uglify(), filesize())

  return conf
}

const config = [
  getConfig("./src/index.ts", "dist/redux-zero"),
  getConfig("./src/react/index.ts", "react/index"),
  // getConfig("./src/preact/index.ts", "preact/index"),
  getConfig("./src/svelte/index.ts", "svelte/index"),
]

export default config
