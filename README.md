# Nebula Genesis

`nebula-genesis` is part of the **Nebula** suite.

> Nebula connects Notion API and Astro to automatically create static websites.

Nebula Genesis acts prior to the website generation, by **querying and caching Notion data and files**.

## Table of contents

- [How to use](#how-to-use)
- [Download folder](#download-folder)
- [Arguments](#arguments)
  - [Notion token](#notion-token) (required)
  - [Database ID](#database-id) (required)
  - [Filters](#filters)
  - [Site folder path](#site-folder-path)
  - [Cache folder name](#cache-folder-name)
  - [On or after](#on-or-after)
  - [Reinit cache](#reinit-cache)
  - [Output format](#output-format)

## How to use

### 1. Install

Install `nebula-genesis` as a dev dependency in your website project.

```bash
npm i -D nebula-genesis
```

### 2. Run

Query databases and pages according to your needs.

It is a normal use case to run 2 or more times `nebula-genesis`, with different [`CACHE_FOLDER_NAME`](#cachefoldername), to fetch content from mutiple databases or varying filters.

This will download content in a `cache` folder, as detailed in [Download folder](#download-folder) section.

Required and optional arguments are detailed in the [Arguments](#arguments) section.

```bash
npx nebula-genesis [...args]
```

## Download folder

### Download location

Queryied content will be stored at the following location :

> <[SITE_FOLDER_PATH](#sitefolderpath)>/cache/<[CACHE_FOLDER_NAME](#cachefoldername)>

Files (like images)from pages' blocks are directly stored inside `./static` folder.

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
