// webpack.config.js
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'd3-brush-handles.js',
        library: {
            type: 'umd',
            name: 'd3BrushHandles',
        },
        // prevent error: `Uncaught ReferenceError: self is not define`
        globalObject: 'this',
    },
};