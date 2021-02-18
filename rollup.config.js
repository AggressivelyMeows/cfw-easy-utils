
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { terser } from "rollup-plugin-terser";

export default [{
    input: 'src/index.js',
    output: [{
        file: 'dist/cfw-easy-utils.js',
        format: 'cjs',
        plugins: [terser()]
    }]
}]