//These files have been edited to include labels. The code used to edit them is below: (You might need to run it twice if the images don't load properly the first time)

["north", "south", "east", "west"].forEach((wind) => {
	url = "/assets/tiles/winds/Unedited/" + wind + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "22px Arial"
		ctx.fillText(wind.slice(0,1).toUpperCase(), 17, 44)
	})
	img.src = url
	//document.body.appendChild(img)
})
