module.exports = [
	{ 'url': '/' },
	{ 'url': '/sample-page' },
	{
		'url': '/sample-page/#headerBtn',
		'callback': async (page) => {
			// Select the element to hover
			const hoverElement = await page.$('#headerBtn');

			// Hover over the element
			await hoverElement.hover();
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