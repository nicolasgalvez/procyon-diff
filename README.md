# screenshot-diff
Barebones screenshot testing project.

* Uses jest/puppeteer/jest-stare
* Accepts a list of test pages 
* Accepts a list of viewports for each page

## Usage

1. Install by doing ye olde `npm install`
2. Run the test `npm run test`

That should launch a headless browser and take a screenshot and compare it with the one saved in the `__image_snapshots__` folder

The test should fail because the screenshot will be different.

Look in `__image_snapshots__/__diff_output__` to see an image with the differences outlined in the center picture.

If your UI changes you can delete the assiciated image in `__image_snapshots__` and then rerun the test. It will automatically create a new image if one is missing. Then the next time you run the test, it will compare as usual.

## TODO

- [ ] Allow S3 connections for AWS/cloudflare
- [ ] Allow pre-loading shots by datetime to compare with a specific test