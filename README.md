# jest-compare-reporter
## What this is
A simple jest reporter that will output previous and current test coverage results. BYO git hooks to police yourself and make sure your code coverage doesn't fall.
## How to use it
1. `npm install jest-compare-reporter`
2. Add the reporter to your jest config (ex: https://jestjs.io/docs/configuration#coveragereporters-arraystring--string-options)  
   2a. Alternatively you can use it from the CLI (ex: https://jestjs.io/docs/cli#--reporters)  
3. This outputs a file that compares the coverage between the previous run and the current run.
4. Use the file however you'd like. I made it with the intention of being used with git hooks.
