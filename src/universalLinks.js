//Handle universal links into the app.
try {
	if (window.Capacitor) {

		//Properly navigates to target.
		function processRedirect(target) {
			//When reload is called instantly after changing href, the page doesn't navigate, and just reloads the current origin.
			//The href change persists though.

			//Therefore, we reload after changing href, and do not reload if we don't.

			console.log("Current URL: " + window.location.href)

			let url = new URL(target)
			if (url.hash === window.location.hash && url.pathname === window.location.pathname) {
				console.log("Same URLs. Skipping")
			}
			else if (url.pathname === window.location.pathname) {
				console.log("Same pathname. Setting and reloading. ")
				window.location.hash =  url.hash
				window.location.reload()
			}
			else {
				console.log("Different pathname. Setting")
                window.location.hash = url.hash //Hash might be different too. 
				window.location.pathname = url.pathname
			}
		}

		Capacitor.Plugins.App.addListener('appUrlOpen', (data) => {
		  console.log('App opened with URL: ' +  data.url);
		  processRedirect(data.url)
		});

		Capacitor.Plugins.App.getLaunchUrl().then((ret) => {
			if(ret && ret.url) {
				console.log('Launch url: ', ret.url);
				processRedirect(ret.url)
			}
		});
	}
}
catch (e) {console.error(e)}
