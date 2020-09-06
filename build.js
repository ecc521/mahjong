//There is a CSS viewport height bug for relative units in some mobile browsers. To counteract this, we will use CSS custom declarations where available.

//This isn't going to be a spec compliant parser, and will probably be a pain to maintain. We should use something real in the future.


const fs = require("fs")
const path = require("path")

function reformatCSSForViewportBug(inputText) {
	//Only works if declarations are single line, and with basic imports.
	let lines = inputText.split("\n")

	let newLines = []

	//Import import statements.
	lines.forEach((line, index) => {
		let matches = line.match(/\s*@import\s*['"](.*?)['"]/)
		if (matches !== null) {
			let fileName = matches[1]
			let newFileText = fs.readFileSync(path.join(__dirname, fileName), {encoding: "utf-8"})
			newLines = newLines.concat(newFileText.split("\n"))
			lines[index] = "" //Don't leave the import statement.
		}
	})

	lines = newLines.concat(lines)


	for (let i=lines.length - 1;i--;i>=0) {
		let line = lines[i]

		if (line.trim().startsWith("--")) {continue} //Variable declaration.

		let newLine = line.replace(/(-)?([\d.]+)vh/g, "calc(var(--vh) * $1$2)")
		newLine = newLine.replace(/(-)?([\d.]+)vw/g, "calc(var(--vw) * $1$2)")

		if (line !== newLine) { //Insert the new line below the current line
			lines.splice(i + 1, 0, newLine)
		}
	}

	return lines.join("\n")
}


function getImports(inputText) {
	let lines = inputText.split("\n")

	let imports = []

	//Import import statements.
	lines.forEach((line, index) => {
		let matches = line.match(/\s*@import\s*['"](.*?)['"]/)
		if (matches !== null) {
			let fileName = matches[1]
			imports.push(fileName)
		}
	})
	return imports
}


let indexCSSPath = path.join(__dirname, "index.css")
function buildCSS() {
	let startTime = Date.now()
	let indexCSS = fs.readFileSync(indexCSSPath, {encoding: "utf8"})
	fs.writeFileSync(path.join(__dirname, "packages", "index.css"), reformatCSSForViewportBug(indexCSS))
	console.log("Built CSS! (" + (Date.now() - startTime) + "ms)")
}

buildCSS()

let importantFiles = [indexCSSPath]
getImports(fs.readFileSync(indexCSSPath, {encoding:"utf-8"})).forEach((fileName) => {
	importantFiles.push(path.join(__dirname, fileName))
})

fs.watch(__dirname, {recursive: true}, function(eventType, fileName) {
	let filePath = path.join(__dirname, fileName)
	if (filePath === indexCSSPath) {
		importantFiles = [indexCSSPath]
		getImports(fs.readFileSync(indexCSSPath, {encoding:"utf-8"})).forEach((fileName) => {
			importantFiles.push(path.join(__dirname, fileName))
		})
	}

	if (importantFiles.includes(filePath)) {
		console.log(fileName + " changed. ")
		buildCSS()
	}
})
