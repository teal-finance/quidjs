import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const isProduction = !process.env.ROLLUP_WATCH;

export default [
  {
    input: 'src/requests.ts',
    output: [
      {
        file: 'dist/quid.min.js',
        format: 'iife',
        name: '$quid',
        plugins: [
          isProduction && terser({ format: { comments: false } })
        ]
      }],
    plugins: [
      typescript(),
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
    ],
  },
  {
    input: 'src/main.ts',
    output: [
      {
        file: 'dist/quid.esm.js',
        format: 'es'
      }],
    plugins: [
      typescript(),
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
    ],
  },
];