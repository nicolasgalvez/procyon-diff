/**
 * A test to compare two screenshots. Check in ideal screenshots as comparison.
 */
const path = require('path')

const fs = require('fs')
const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
// import autoScroll from './autoscroll.js'

expect.extend({ toMatchImageSnapshot })

// get the calling directory
const callingDir = process.env.CALLING_DIR

// get the url from yargs --domain argument
const yargs = require('yargs')
const argv = yargs.argv
const prodDomain = argv.domain
// const headless = argv.headless
console.log('prodDomain', prodDomain)

const customConfig = {
  failureThreshold: 5,
  failureThresholdType: 'percent',
  'customSnapshotsDir': path.resolve(callingDir, 'tests',
    '__image_snapshots__'),
}
/**
 * Paths to test. Paths will be tested at each viewport.
 *
 * @type {[{url: string, callback: function, skipViews: string[]}]}
 */

// Define the path to the file
const filePath = path.resolve(callingDir, 'tests', 'pages.config.js')

// Load the file dynamically
const testPages = require(filePath)

console.log(testPages)

/**
 * Viewports to use for each page.
 * @type {[{name: string, width: number, height: number}]}
 */
const viewports = [
  // {
  // 	"name": "viewportDesktop",
  // 	"width": 1920,
  // 	"height": 1024
  // },
  {
    'name': 'viewportLaptop',
    'width': 1440,
    'height': 1024,
  },
  {
    'name': 'viewportTablet',
    'width': 768,
    'height': 1024,
  },
  {
    'name': 'viewportMobile', // iPhone SE
    'width': 375,
    'height': 667,
  },
]

const ignoredAreas = [
  // ".testimonial-posts",
]

jest.setTimeout(20000)

/**
 * Example test checking google.com.
 * Will fail the first time if there is no image to compare against in the tests __image_snapshots__ folder.
 */
describe('Visual', () => {
  let browser
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      // defaultViewport: null,
      args: ['--ignore-certificate-errors'],
    })
  })
  // Reuse tabs:
  afterEach(async () => {
    const pages = await browser.pages();
    await Promise.all(pages.map(page => page.close()));
  });
  
  testPages.forEach((testPage) => {
    let url = testPage
    console.log('testPage', testPage)
    let callback = null
    if (typeof testPage === 'object') {
      ({
        url,
        callback = () => { console.log('No callback provided') },
        skipViews = [],
      } = testPage)
    } else {
      console.log('Not an object')
    }

    // Test each viewport
    viewports.forEach((view) => {
      if (skipViews.length > 0) {
        // go to next test if current view is in the array
        if (skipViews.includes(view.name)) {
          return
        }
      }
      console.log('Testing', url, 'at', view.name)
      it(url + view.width, async () => {
        const page = await browser.newPage()
        await page.setViewport(view)
        console.log(prodDomain + url)
        // set the HTTP Basic Authentication credential
        // await page.authenticate({'username': BASIC_AUTH_USERNAME, 'password': BASIC_AUTH_PASSWORD});
        // if testPage is an object, parse the url and run the callback function
        if (typeof testPage === 'object') {
          await page.goto(prodDomain + url, { waitUntil: 'networkidle2' })
          // await callback(page);
        } else {
          await page.goto(prodDomain + url, { waitUntil: 'networkidle2' })
        }

        await scrollToBottom(page) // breaking on certain pages
        // await page.evaluate(() => { window.scroll(0, 1000); });
        // Hide ignored areas. Testimonials that are random ruin page layout tests
        await page.evaluate(() => {
          [].forEach.call(document.querySelectorAll('.sf-dump'), function (el) {
            el.style.visibility = 'hidden'
          })
        })

        const image = await page.screenshot({ fullPage: true })
        expect(image).toMatchImageSnapshot(customConfig)
      })
    })
  })

  afterAll(async () => {
    await browser.close()
  })
})

async function scrollToBottom (page) {
  const distance = 200 // should be less than or equal to window.innerHeight
  const delay = 1000
  while (await page.evaluate(
    () => document.scrollingElement.scrollTop + window.innerHeight <
      document.scrollingElement.scrollHeight)) {
    await page.evaluate((y) => {
      document.scrollingElement.scrollBy({
        top: y,
        left: 0,
        behavior: 'instant',
      })
    }, distance)
  }
  await new Promise(resolve => setTimeout(resolve, delay))
}

async function loadPagesFromCSV (filename) {
  const csv = require('csv-parser')
  const fs = require('fs')
  const results = []
  fs.createReadStream(filename).
    pipe(csv()).
    on('data', (data) => results.push(data)).
    on('end', () => {
      console.log(results)
    })
}