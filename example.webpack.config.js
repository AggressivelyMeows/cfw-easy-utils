module.exports = {
    context: __dirname,
    target: "webworker",
    entry: "./example.js",
    optimization: {
        // so we can get better error logs in the Workers editor.
        minimize: false
    },
}