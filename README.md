# Gather the Docs

We're an institution where people often gather links to important documents in another document. I consider this something of an anti-pattern, since the presence of links in e.g. a google doc is no guarantee that people you share that document with can access those links. However, it's a user-friendly pattern that people like for everything from gathering links to syllabi to students gathering portfolio. This add-on will aim to support users using this pattern in "gathering" all of the documents that they have linked in a document by either copying them or moving them.

So, for example, if you have a google doc full of links to lesson plans, you could then organize you're entire curriculum by using this add-on to gather all of the lesson plans in a single place (potentially making copies if plans come from multiple locations).

## Implementation Plan

We're beginning with Google Slides, since we use that for student portfolios this year.

## Steps:
- Crawl slideshow for links
- Present user list of those links with options to...
  - Copy all  
  - Select which ones to copy
- Do the actual moving/gathering and give the user feedback on the process

## Next steps:
- Present user list of documents to copy or not copy
- Modify "copy" method to take a list of files.
- Allow selecting a folder instead of creating one (implement picker)
- Allow moving documents instead of copying them.

## Process
- Oct. 2023 - Prototype where we copy all the links in the slideshow works.



## About the Framework -  Google Apps Script + Svelte

I love Google Apps Script for whipping together projects for our Google Apps School, and I love svelte development in Visual Studio, but before now, I haven't been able to  bring them together. This repo will give me a recipe for fixing that!

## Quick Start

1. Clone this repository.
1. Install the dependencies: npm install
1. Run development server for Svelte: npm run dev
1. Build for production: npm run build
1. Create a new Google Apps Script project: npm run create-clasp-project
1. Push the build to Google Apps Script: npm run push-to-clasp

## Google-Apps-Script

We can use import and export and typescript to build Google Apps Script functions. Whatever is imported into main will be built for export.

The src/gas/serve.ts file contains several utility functions to serve your Svelte code within different Google Workspace apps:

doGet(e): Serves the Svelte application as a web page.
showDialog(title, modal, app): Shows the Svelte application as a dialog in Google Docs, Sheets, or Slides.
title: Title of the dialog.
modal: Whether the dialog should be modal.
app: The Google Workspace app to show the dialog in (DocumentApp, SpreadsheetApp, SlidesApp)

### Using google.script.run

To simplify things, we define a file `api.ts` in our src/gas/ directory which should contain all
functions that we will need in client side svelte code.

Functions from api.ts can then automatically be read so we can generate appropriate typescript
definition files and mock functions in src/svelte/mock/mockApi.ts

This magic happens automatically with `npm run dev`

So, for example, if you go into api.ts and you add a new function call:

```ts

function getNumberOfRowsInSheet (sheetname : string) : number {
  // ... add logic here...
}
```

The moment you save the file, a type definition file will be added to
`src/svelte/types` so that typing `google.script.run` will then autocomplete 
`getNumberOfRowsInSheet` and in addition a mock function will be defined in
`src/svelte/mock/mockApi` that returns a dummy value you can use for testing.

You should then update your mock files as needed accordingly to help with
local testing.

## Roadmap

- Proof of concept: build svelte interface served with GAS! (x)
- Improved type handling and testing framework. (x)