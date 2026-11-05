# Data model mapper GUI

## Introduction

The Data model mapper GUI is the graphic user interface of the Data model mapper: it lets you write a mapper record
(source, configuration, schema, map), try it on your data and save it, so that the Data model mapper can use it.
What the mapper does and the meaning of each map and configuration field are explained in the
[Data model mapper README](https://github.com/OPSILab/data-model-mapper#readme).

The screenshots use made-up data.

## Layout

![Home](images/home.png)

- **Side menu**: *Home*, *Mapper records* (the saved mapper records), *Mapper editor* (create or edit a record).
- **Top bar**: the theme, the language (English / Italian), the logged user and the **?** button, which opens the
  online help (`data_model_mapper.helpUrl` in the GUI `config.json`).

## Mapper records

The list of the mapper records of the logged user.

![Mapper records](images/mapper-records.png)

- Filter by name or description with the fields under the column titles; **CLEAR FILTERS** empties them.
- **ADD MAPPER** opens the Mapper editor with a new record; **REFRESH** reloads the list.
- The selector under the table sets how many records are shown per page.

The **Status** column tells whether a record is *Under development* (orange) or *Completed* (green). The buttons of
the **Actions** column depend on it:

| Status | Button | What it does |
|---|---|---|
| Under development | pencil | opens the record in the Mapper editor |
| Under development | lock | registers the record: it becomes *Completed* and can no longer be edited |
| Under development | bin | deletes the record (asks for confirmation) |
| Completed | play | transforms a source with the record (see below) |
| Completed | open lock | deregisters the record: it goes back to *Under development* and can be edited again |

![Register](images/register-dialog.png)

![Delete](images/delete-dialog.png)

### Transforming with a completed record

The play button opens the transformation in three steps: **Source**, **Output** and **Body and curl**.

In *Source* give the data to transform, as in the [Source](#1-source) step of the editor (paste it, pick it from
the database or MinIO, or upload it), then press **Next**.

![Transform: source](images/transform-source.png)

In *Output* press **TRANSFORM**: the result appears in the editor below and can be saved with **DOWNLOAD** (JSON) or
**DOWNLOAD GEOJSON**. *Body and curl* shows the same request ready to be sent to the API (see
[Body and curl](#6-body-and-curl)).

![Transform: output](images/transform-output.png)

## Mapper editor

![Mapper editor](images/editor.png)

At the top:

- **Select mapper record** loads a saved record, with its source, configuration, schema and map.
- **CREATE NEW** empties the editor.
- **SAVE AS NEW** saves the editor content as a new record; **UPDATE** (shown when a record under development is
  opened from the list) saves the changes to that record. See [Saving](#saving).
- **EXPORT** downloads the record (see [Exporting](#exporting)); **UPLOAD** loads a record from a file or a url.

![Select mapper record](images/select-mapper-record.png)

Below, the record is written in six steps. Click a number to go to that step, or use **Back** and **Next** at the
bottom. A completed step is green.

![A loaded record](images/editor-record.png)

### 1. Source

The data to map. Choose the input type first, **CSV** or **JSON** (GeoJSON is JSON).

![Input type](images/select-input-type.png)

The source can be:

- written or pasted in the editor;
- taken from the Data model mapper: choose **db** (sources saved in its database) or **minio** (files in MinIO) in
  **From**, then the file in **Select source file**;
- uploaded with **UPLOAD**, from a file of your computer (**file**, then **BROWSE**) or from a url (**url**, then
  write the address), and confirmed with the **UPLOAD** button of the dialog.

![Upload: file or url](images/import-dialog.png)

![Upload from a url](images/import-from-url.png)

When the source is ready, press **UPDATE SOURCE FIELDS**: the fields of the source become the ones offered by the
guided mapping of the [Map file](#4-map-file) step.

**CSV.** Write the rows in *CSV TEXT*, and choose the separator of your file (comma, semi-colon or tab).

![CSV source](images/source-csv.png)

![Separator](images/separator.png)

*CSV TABLE* shows the same data as a table: if the columns are not split correctly, the separator is wrong.

![CSV table](images/source-csv-table.png)

**JSON.** The source is shown in a JSON editor; its **View** menu switches to **Code**, to write or paste the JSON
as text. If the objects to map are not at the top of the document, choose where they are with **Select path**
(`root.` is the top; the value at the chosen path must be an array).

![JSON source](images/source-json.png)

![Select path](images/select-path.png)

### 2. Configuration

The transform configuration of this record: the same fields as the `config.js` of the Data model mapper (their
meaning is in its README), here valid for this record only. Edit them in the editor and press **UPDATE CONFIG**;
**RESET CONFIG** brings back the configuration of the server.

![Configuration](images/configuration.png)

### 3. Schema

The JSON schema of the output, for example a Smart Data Model or any other JSON schema. Pick one saved in the
Data model mapper with **Select Json Schema**, upload one with **UPLOAD**, or write it in the editor.

![Schema](images/schema.png)

![Select a schema](images/select-schema.png)

**GENERATE MAPPER** writes the skeleton of the map from the schema: one key for every field of the output, to be
filled in the next step.

### 4. Map file

The map: for each output key, where its value comes from. It can be written by hand, in the tree or (from the menu
next to *Tree*) in code mode, following the syntax in the README: a source field name (e.g. `address`), a static
value (`static:Point`), an array that concatenates fields, nested objects for nested output fields.

![Map file](images/map-file.png)

Or with the guided dialog: click the small button at the left of a key and choose **Map**.

![Map menu](images/map-context-menu.png)

![Map dialog](images/map-dialog.png)

- **Select encode option**: `none`, or `base64` to encode the value.
- **Single or multi input**: `single` takes one value; `multi` concatenates several values (into an array or a string,
  depending on the type of the output field in the schema).
- **Direct or static input**: `direct` takes the value from a field of the source, `static` is a fixed value.

According to the choices:

| Choice | What to fill in |
|---|---|
| single + direct | the source field, from the list of the source fields |
| single + static | the static value |
| multi + direct | a source field, then **ADD ELEMENT**, for each field; *Values inserted* shows the list |
| multi + static | a static value, then **ADD ELEMENT**, for each value |

![Single, direct](images/map-single-direct.png)

![Single, static](images/map-single-static.png)

![Multi, direct](images/map-multi-direct.png)

![Multi, static](images/map-multi-static.png)

**CONFIRM** writes the mapping into the key; **RESET** starts the choices again.

### 5. Output

Try the record on the source:

- **PREVIEW** maps the source and shows the result;
- **TRANSFORM** runs the same mapping as a session of the Data model mapper and shows the result when it has ended,
  better for large sources;
- **DOWNLOAD** saves the result as JSON, **DOWNLOAD GEOJSON** as GeoJSON.

![Output](images/output-preview.png)

When the mapping report is enabled (`mappingReport` in the configuration), the last element of the result is the
report: how many objects were processed, how many were mapped and validated against the schema and how many were
not (`Mapped_and_NOT_Validated_Objects`), and what was written to Orion when the Orion writer is enabled.

![Output with the report](images/output-transform.png)

### 6. Body and curl

The request that does the same transformation through the API of the Data model mapper (`POST /api/map/transform`),
to use from other programs: the **curl** command and the request **payload**. Press **UPDATE** to rebuild them after
changing the record.

![Body and curl](images/body-curl.png)

## Saving

**SAVE AS NEW** asks for a name, a description and the status of the record (*Under development* or *Completed*), and
saves it in the Data model mapper. When the source or the schema differ from the ones loaded (or always, with
`alwaysPromptSaveSource` / `alwaysPromptSaveSchema` in the GUI `config.json`), the dialog also offers to save them as
separate records, to be reused by other maps.

![Save](images/save-dialog.png)

To change a saved record, open it from **Mapper records** with the pencil (records *Under development* only), edit it,
and press **UPDATE**. The name cannot be changed; description and status can.

![Update button](images/editor-update.png)

![Update](images/update-dialog.png)

## Exporting

**EXPORT** downloads the record: **Snippet** as the curl command (a `.bash` file), **File** as the JSON body of the
request (a `.json` file).

![Export](images/export-dialog.png)

**UPLOAD**, next to it, loads a record from a file or a url.

![Upload a record](images/upload-record-dialog.png)
