# Nebula Genesis

> `nebula-genesis` is part of the [**Nebula**](nebula.rimarok.com) suite.

Nebula connects [Notion API](developers.notion.com/) (as headless CMS) and [Astro](astro.build/) (a SSG, static site generator) to automatically create static websites.

**Nebula Genesis acts prior to the website generation** :

It's a npm module that query, download, cache and (optionnaly) parse Notion databases' pages to Markdown.

## Table of contents

- [Nebula Genesis](#nebula-genesis)
  - [Table of contents](#table-of-contents)
  - [How to use ?](#how-to-use-)
    - [1. Install](#1-install)
    - [2. Querying](#2-querying)
  - [Where is data downloaded ?](#where-is-data-downloaded-)
    - [Download location](#download-location)
      - [1. Cache folder](#1-cache-folder)
      - [2. Astro collection folder](#2-astro-collection-folder)
    - [Folder structure](#folder-structure)
  - [Arguments](#arguments)
    - [Required arguments](#required-arguments)
      - [NOTION\_TOKEN](#notion_token)
      - [DATABASE\_ID](#database_id)
    - [Optional arguments](#optional-arguments)
      - [FILTERS](#filters)
      - [SITE\_FOLDER\_PATH](#site_folder_path)
      - [CACHE\_FOLDER\_NAME](#cache_folder_name)
      - [ON\_OR\_AFTER](#on_or_after)
      - [REINIT\_CACHE](#reinit_cache)
      - [OUTPUT\_FORMAT](#output_format)
      - [ASTRO\_COLLECTION\_NAME](#astro_collection_name)
  - [Notion's features support](#notions-features-support)
    - [Blocks types' support](#blocks-types-support)
    - [Property types' support](#property-types-support)
  - [Development](#development)
    - [1. Clone repo on your computer](#1-clone-repo-on-your-computer)
    - [2. Install dependencies](#2-install-dependencies)
    - [3. Build dev script](#3-build-dev-script)
    - [4. Install in test site](#4-install-in-test-site)
  - [Publishing](#publishing)
    - [1. Build prod script](#1-build-prod-script)
    - [2. Publish on npm](#2-publish-on-npm)

## How to use ?

### 1. Install

Install `nebula-genesis` as a dev dependency in your website project.

```bash
npm i -D nebula-genesis
```

### 2. Querying

Query databases and pages according to your needs.

It is a normal use case to run 2 or more times `nebula-genesis`, with different [`CACHE_FOLDER_NAME`](#cachefoldername), to fetch content from mutiple databases or with differents filters.

This will download content in a `cache` folder, as detailed in [Download folder](#download-folder) section.

Required and optional arguments are detailed in the [Arguments](#arguments) section.

```bash
npx genesis [...args]
```

## Where is data downloaded ?

### Download location

Depending on [arguments], content will be stored at different locations.

#### 1. Cache folder

By default, content is stored in a cache folder, located at :

> [<SITE_FOLDER_PATH>](#sitefolderpath)/cache/[<CACHE_FOLDER_NAME>](#cachefoldername)

#### 2. Astro collection folder

If [<ASTRO_COLLECTION_NAME>](#astrocollectionname) is set,
pages are downloaded and parsed to the following location :

> [<SITE_FOLDER_PATH>](#sitefolderpath)/src/data[<ASTRO_COLLECTION_NAME>](#astrocollectionname)

Files (like images) from pages' blocks are directly stored inside [`<SITE_FOLDER_PATH>`](#sitefolderpath)`/static` folder.

Don't forget to ignore cached files from `./static`.

### Folder structure

Inside [`CACHE_FOLDER_NAME`](#cachefoldername) folder, content is stored on the following structure :

- `cache.json`, which contains `nebula-genesis` metadata, currently only the `LAST_RUN` date,
- `pages.json`, with the result of the main database query (`PageObjectResponse[]`),
- `pages` folder,
  - `<PAGE_ID>`,
    - `page.json`, with the result of the pages query (`BlockObjectResponse[]`).

## Arguments

### Required arguments

#### NOTION_TOKEN

`NOTION_TOKEN` is your Notion integration key.

You must connect relevant databases to your integration in order to query them.

#### DATABASE_ID

`DATABASE_ID` is the ID of the database you want to query.

### Optional arguments

#### FILTERS

`FILTERS` are JSON-formatted filters to apply to the database query.

See [Filter database entries (developers.notion.com)](https://developers.notion.com/reference/post-database-query-filter) for filters reference.

#### SITE_FOLDER_PATH

_Default value : `"."` (website project root)_.

`SITE_FOLDER_PATH` is the path to the folder where you want to store the generated files.

#### CACHE_FOLDER_NAME

`CACHE_FOLDER_NAME` is the name of the folder where data is cached.

See [Download location](#download-location) section for cache folder path.

#### ON_OR_AFTER

`ON_OR_AFTER` is the date from which you want to query pages.

#### REINIT_CACHE

`REINIT_CACHE` can be set with whatever value to ignore cache.

#### OUTPUT_FORMAT

`OUTPUT_FORMAT` can either be `'md'` (default) or "`json`".

#### ASTRO_COLLECTION_NAME

`ASTRO_COLLECTION_NAME` will write MD files in an Astro-shaped folder, structured as `/pages/<name>/<page-slug>.md`.

_Collections can then be set in website codesource, using `src/content.config.ts`_

## Notion's features support

### Blocks types' support

- Paragraph
- Heading 1
- Heading 2
- Heading 3
- Bulleted list item
- Numbered list item
- Quote
- Callout
- Image

### Property types' support

- rich_text
- title
- number
- date
- checkbox
- select
- multi_select

## Development

You can extend `nebula-genesis`'s features by locally developing its codebase, following these steps :

### 1. Clone repo on your computer

> `git clone github.com/abstract-core/nebula-genesis.git`

We find it esaier to clone sources in the same folder as the Astro test site project you will use (ex: in `dev/` you'll find `nebula-genesis/` and `my-astro-project/`).

### 2. Install dependencies

> `npm i`

### 3. Build dev script

> `npm run dev`

In order to transpile (from TS to JS), and to bundle files in a single script, we use `npx esbuild` to output a `build/index.js`.

This script has the `watch` flag turned on.

### 4. Install in test site

Taking the [1. Clone repo on your computer](#1-clone-repo-on-your-computer) example folder structure, you should execute the following script to install dev module in your test site :

> `npm i ../nebula-genesis`

## Publishing

### 1. Build prod script

> `npm run build`

### 2. Publish on npm

> `npm publish`
