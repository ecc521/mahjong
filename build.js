//There is a CSS viewport height bug for relative units in some mobile browsers. To counteract this, we will use CSS custom declarations where available.

const fs = require("fs")
const path = require("path")

function reformatCSSForViewportBug(inputText) {
	//This isn't going to be a spec compliant parser. It only works if declarations are single line.
	let lines = inputText.split("\n")

	for (let i=lines.length - 1;i--;i>=0) {
		let line = lines[i]

		if (line.trim().startsWith("--")) {continue} //Variable declaration.

		let newLine = line.replace(/(-)?([\d.]+)vh/g, "calc(var(--vh) * $1$2)")

		if (line !== newLine) { //Insert the new line below the current line
			lines.splice(i + 1, 0, newLine)
		}
	}

	return lines.join("\n")
}

let indexCSSPath = path.join(__dirname, "index.css")
function buildCSS() {
	let startTime = Date.now()
	let indexCSS = fs.readFileSync(indexCSSPath, {encoding: "utf8"})
	fs.writeFileSync(path.join(__dirname, "packages", "index.css"), reformatCSSForViewportBug(indexCSS))
	console.log("Built CSS! (" + (Date.now() - startTime) + "ms)")
}

buildCSS()
fs.watchFile(indexCSSPath, buildCSS)
