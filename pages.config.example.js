module.exports = [
	{ 'url': '/' },
	{ 'url': '/sample-page' },
	{
		'url': '/sample-page/#headerBtn',
		'callback': async (page) => {
			// Select the element to hover
			await page.evaluate(async () => {
				const iframe = document.getElementById('iframeId')

				if (iframe && iframe.contentWindow && iframe.contentDocument) {
					const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
					const button = iframeDoc.querySelectorAll('.close-btn')

					if (button[0]) {
						button[0].click()
						console.log('Button clicked inside the iframe.')
					} else {
						console.log('Button not found inside the iframe.')
					}
				} else {
					console.log('Iframe is not accessible.')
				}
			})
		},
		skipViews: ['viewportMobile']
	},
	{
		'url': '/sample-page/#menu',
		'callback': async (page) => {
			// Select the menu toggle element
			const hoverElement = await page.$('#menu-toggle');

			// lopen the menu
			await hoverElement.click();
		}
	}
];