//These files have been edited to include numbers. The code used to edit them is below: (You might need to run it twice if the images don't load properly the first time)


for (let i=1;i<=1;i++) {
	url = "/assets/tiles/characters/Unedited/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "25px Arial"
		ctx.fillText(i, 12, 41)
	})
	img.src = url
	//document.body.appendChild(img)
}


for (let i=2;i<=3;i++) {
	url = "/assets/tiles/characters/Unedited/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "25px Arial"
		ctx.fillText(i, 12, 42)
	})
	img.src = url
	//document.body.appendChild(img)
}


for (let i=4;i<=4;i++) {
	url = "/assets/tiles/characters/Unedited/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "23px Arial"
		ctx.fillText(i, 17, 39)
	})
	img.src = url
	//document.body.appendChild(img)
}

for (let i=5;i<=6;i++) {
	url = "/assets/tiles/characters/Unedited/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "25px Arial"
		ctx.fillText(i, 15, 44)
	})
	img.src = url
	//document.body.appendChild(img)
}


for (let i=7;i<=9;i++) {
	url = "/assets/tiles/characters/Unedited/" + i + ".png"
	let img = document.createElement("img")
	img.addEventListener("load", function() {
		let cnv = document.createElement("canvas")
		cnv.width = 96;cnv.height=128
		let ctx = cnv.getContext("2d")
		ctx.drawImage(img, 0, 0)
		document.body.appendChild(cnv)
		ctx.fillStyle = "#b66d17" //From top of tiles.
		//ctx.fillStyle = "#e78723" //2 rows into border from white
		ctx.font = "25px Arial"
		ctx.fillText(i, 16, 47)
	})
	img.src = url
	//document.body.appendChild(img)
}
