#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const yargs = require('yargs');

// Parse command-line arguments
const argv = yargs
  .option('domain', {
    alias: 'd',
    description: 'Specify the domain',
    type: 'string',
  })
  .option('pages', {
    alias: 'p',
    description: 'Specify the pages',
    type: 'string',
  })
  .help()
  .alias('help', 'h')
  .argv;

// Determine the root directory of the module
const rootDir = path.resolve(__dirname);

// Determine the directory from which the command is called
const currentDir = process.cwd();

// Define the command to run your desired npm script
const script = process.argv[2] || 'test';

// Build the command with additional arguments
let command = `npm test --`;
if (argv.domain) {
  command += ` --domain=${argv.domain}`;
}
if (argv.pages) {
  command += ` --pages=${argv.pages}`;
}

// Set environment variables to pass the current directory
const env = Object.create(process.env);
env.CALLING_DIR = currentDir;

// Execute the command from the module's root directory
execSync(command, { stdio: 'inherit', cwd: rootDir, env });