const path = require("path")

	let prodConfig = {
		mode: "production", //Build for production
		entry: {
			"packages/index.js": "./src/index.js",
		},
  		watch: true,
		target: "web",
		devtool: "source-map",
		output: {
			path: __dirname,
			filename: "[name]",
		},
		optimization: {
			minimize: true //Consider using Uglify.js for minification.
			//https://github.com/mishoo/UglifyJS2/blob/ae67a4985073dcdaa2788c86e576202923514e0d/README.md#uglify-fast-minify-mode
		},
		stats: {
			colors: true
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							cacheDirectory: true, //Huge performance boost. Avoid recompiling when unneeded.
							cacheCompression: true, //true is default. Compress cached data written to disk.
  							sourceType: 'unambiguous', //Allow mixing CommonJS and ES6 modules.
							presets: [
								[
									'@babel/preset-env', {
									useBuiltIns: 'usage',
									corejs: "3.3.6"
								}]
							]
						}
					}
				}
			]
		}
	}


module.exports = function(env) {
	return prodConfig
}
