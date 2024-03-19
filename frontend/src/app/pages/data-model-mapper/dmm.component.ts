import { AppConfig } from './../../model/appConfig';
import { Component, OnInit, Inject, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { DMMService } from './dmm.service';
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrConfig,
  NbToastrService,
  NbWindowService,
} from '@nebular/theme';
import * as _ from "lodash"
import * as JSONEditor from '../../../../node_modules/jsoneditor/dist/jsoneditor.js';
import { DOCUMENT } from '@angular/common';
import { DialogImportComponent } from './dialog-import/dialog-import.component';
import { DialogDataMapComponent } from './dialog-dataMap/dialog-dataMap.component';
import { CreateMapComponent } from './create-map/create-map.component';
import { ExportFileComponent } from './export-file/export-file.component';
import { ErrorDialogMapperRecordService } from '../error-dialog/error-dialog-mapperRecord.service';
import { ActivatedRoute } from '@angular/router';
import { NgxConfigureService } from 'ngx-configure';
import editor from './mapperEditor'

let mapOptionsGl, mapGl = "Set your mapping fields here"//, mapperEditor

function o(obj) {
  return JSON.parse(JSON.stringify(obj))
}

@Component({
  selector: 'app-root',
  templateUrl: './dmm.component.html',
  styleUrls: ['./dmm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DMMComponent implements OnInit, OnChanges {

  //TODO check if properties cleaning is required

  backendDown
  inputID
  isNew = false;
  map
  mapOptions
  outputEditorContainer: any;
  sourceEditor: any;
  sourceEditorContainer: any;
  mapperEditorContainer: any;
  schemaEditorContainer
  selectBox: any;
  inputType: any;
  separatorItem = ';';
  csvSourceData: any;
  sourceRef: string = '';
  typeSource: string;
  mapperRecord
  emptySource
  mapObject
  flipped = false;
  csvtable: any;
  sourceRefFormat: string;
  paths: string[];
  mapperEditor: any;
  maps: any;
  mapper
  schemas
  selectedSchema
  schemaJson;
  outputEditor: any;
  outputEditorOptions: any;
  sourceJson: any;
  schemaFromFile
  selectedPath: any;
  selectMap
  schemaOrMap = "schema"
  name
  dialog = false
  mapperRecordId
  partialCsv: any;
  rows: string[];
  schemaEditor: any;
  selectedDataModel;
  options2: {
    mode: string; modes: string[]; // allowed modes
    onModeChange: (newMode: any, oldMode: any) => void; onCreateMenu: (items: any, node: any) => any;
  };
  dataModelURL: any;
  sourceDataURL: any;
  selectedSource
  sources: any;
  snippet: any;
  config: AppConfig;
  NGSI: Boolean
  savedSource: any;
  savedSchema: any;
  oldMap: any;
  configEditorContainer: HTMLElement;
  configEditor: any;
  transformSettings: any;
  tempSchema: any;
  schemaRef: string;
  schemaRefFormat: string;
  sourceOptions: any;
  schemaOptions: any;
  importedSchema: any;
  importedSource: any;
  sourceFrom
  openDialog = editor.openDialog
  exampleSource = [{
    "info": "set your source json here"
  }]
  exampleSchema = {
    info: "set your schema here"
  }

  exampleSchema2 = {
    info: "set your schema here",
    properties: {
      outputKey1: {
        "type": "string"
      },
      outputKey2: {
        "type": "string"
      }
    }
  }
  bodyEditorContainer: HTMLElement;
  bodyEditor: any;
  body: object;
  bodyEditorOptions: {
    mode: string; modes: string[]; // allowed modes
    onModeChange: (newMode: any, oldMode: any) => void;
  };
  curlEditorContainer: HTMLElement;
  curlEditor: any;
  curl: string;
  dbSources: object[];
  minioSources: object[];
  buckets: string[];
  minioObjectList: object[];
  minioObjName: string;
  bucket: string;
  etag: string;
  loading: boolean = false;
  loaded: boolean = true;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    protected dialogService: NbDialogService,
    public windowService: NbWindowService,
    public errorService: ErrorDialogMapperRecordService,
    public dmmService: DMMService,
    public toastrService: NbToastrService,
    public route: ActivatedRoute,
    public configService: NgxConfigureService,
    //public ref : any
    //public ref: NbDialogRef<any>,
  ) {
    this.config = configService.config as AppConfig;
  }

  updateMap() { mapGl = this.map }
  fixBrokenPageBug() { document.getElementsByTagName('html')[0].className = "" }
  rawSchema() { return !(this.dataModelURL || (this.selectedSchema && this.selectedSchema != "---select schema---" && typeof this.selectedSchema == "string")) }
  rawSource() { return !(this.sourceDataURL || this.selectedSource) }
  differences(object1, object2) { return JSON.stringify(object1) != JSON.stringify(object2) }
  ngOnChanges(changes: SimpleChanges): void { console.log(changes); }

  async ngOnInit(): Promise<void> {

    editor.mapperEditor = undefined

    this.sourceEditorContainer = this.document.getElementById('jsoneditor');
    this.configEditorContainer = this.document.getElementById('configEditor');
    this.mapperEditorContainer = this.document.getElementById('jsoneditor2');
    this.schemaEditorContainer = this.document.getElementById('schemaEditor');
    this.outputEditorContainer = this.document.getElementById('jsoneditor3');
    this.bodyEditorContainer = this.document.getElementById('bodyEditor');
    this.curlEditorContainer = this.document.getElementById('curlEditor');
    this.selectBox = <HTMLInputElement>this.document.getElementById('input-type');
    this.csvtable = this.document.getElementById('csv-table');

    try {
      await this.loadMapperList()
      await this.loadSchemaList()
      await this.loadSourceList()
    }
    catch (error) {
      this.handleError(error, false, false)
      if (error.status == 0 || error.error.status == 0) {
        error.statusText = undefined
        error.message = error.error.message = "Unable to reach server"
        this.backendDown = true
      }
      this.errorService.openErrorDialog(error)
    }

    this.sourceOptions = {
      mode: 'view',
      modes: ['view', 'code'], // allowed modes
      onModeChange: function (newMode, oldMode) { },
    };

    this.schemaOptions = {
      mode: 'view',
      modes: ['view', 'code'], // allowed modes
      onModeChange: function (newMode, oldMode) { },
    };

    this.sourceJson = [{
      "info": "set your source json here"
    }]

    this.selectedDataModel = this.exampleSchema

    let preview = {
      "preview": "set the source, set the json map and click preview to see the output json preview"
    }

    this.map = {
      "set a field from the output schema field list": "set a field from the source input"
    }

    this.body = {

    }

    this.sourceEditor = new JSONEditor(this.sourceEditorContainer, this.sourceOptions, this.sourceJson);

    this.schemaEditor = new JSONEditor(this.schemaEditorContainer, this.schemaOptions, this.selectedDataModel)

    this.schemaEditor.update(this.exampleSchema)

    await this.resetConfigSettings()

    this.outputEditorOptions = {
      mode: 'view',
      modes: ['view', 'preview'], // allowed modes
      onModeChange: function (newMode, oldMode) { },
    };

    this.bodyEditorOptions = {
      mode: 'preview',
      modes: ['view', 'preview'], // allowed modes
      onModeChange: function (newMode, oldMode) { },
    };

    if (this.selectedSchema)
      this.schemaJson = this.selectFilteredSchema()

    this.setMapEditor(false);

    if (!this.outputEditor)
      this.outputEditor = new JSONEditor(this.outputEditorContainer, this.outputEditorOptions, preview);
    else
      this.outputEditor.update(preview)

    this.bodyEditor = new JSONEditor(this.bodyEditorContainer, this.bodyEditorOptions, this.body);

    //this.curlEditor = new JSONEditor(this.curlEditorContainer, this.bodyEditorOptions, "");

    if (this.route.snapshot.params['inputID'] as string || this.inputID) {
      if (this.route.snapshot.params['inputID'] as string)
        this.inputID = this.route.snapshot.params['inputID'] as string;
      this.selectMap = this.inputID
      await this.mapChanged(this.inputID, false)
      if (this.inputType == "csv" && !this.emptySource)
        this.updateCSVTable()
      this.updateBody()
    }
    else {
      this.importedSchema = this.exampleSchema
      this.importedSource = o(this.sourceJson)
    }
  }

  setContext(unsaved, map, source, save) {//, schemaSaved, sourceSaved) {
    console.debug(unsaved.schema || this.rawSchema())
    return {
      unsaved,
      sources: this.sources,
      dataModels: this.schemas,
      save: save,
      path: this.selectedPath,
      sourceDataType: this.inputType,
      jsonMap: map,
      schema: unsaved.schema || this.rawSchema() ? JSON.parse(this.schemaEditor.getText()) : undefined,
      config: this.transformSettings,
      sourceDataURL: this.sourceDataURL,
      sourceDataID: this.minioObjName ? undefined : this.selectedSource,
      dataModelURL: this.dataModelURL,
      dataModelID: this.selectedSchema && this.selectedSchema != "---select schema---" ? this.selectedSchema : undefined,
      sourceData: unsaved.source || this.rawSource() ? this.setSource(source, true) : undefined,
      schemaSaved: false,
      sourceSaved: false,
      minioObjName: this.minioObjName,
      etag: this.etag,
      bucket: this.bucket
    }
  }

  unsaved() {
    return {
      schema: this.differences(this.importedSchema, JSON.parse(this.schemaEditor.getText())),
      source: this.differences(this.importedSource, this.inputType == "json" ? JSON.parse(this.sourceEditor.getText()) : this.csvSourceData)
    }
  }

  saveRecord() {
    let source, map, unsaved
    try {
      source = JSON.parse(this.sourceEditor.getText())
      map = JSON.parse(editor.mapperEditor.getText())
      unsaved = this.unsaved()

      this.dialogService.open(CreateMapComponent, {
        context: this.setContext(unsaved, map, source, true)
      }).onClose.subscribe(async (mapperRecord) => {
        if (mapperRecord) {
          this.mapperRecord = mapperRecord;
          this.isNew = true
          this.maps.push({
            id: mapperRecord.mapperRecordId,
            name: mapperRecord.name,
            description: mapperRecord.description,
            status: mapperRecord.status,
            map: JSON.parse(editor.mapperEditor.getText()),
            dataModel: this.schemaJson
          })
          this.selectMap = mapperRecord.mapperRecordId
          this.savedSchema = mapperRecord.saveSchema
          this.savedSource = mapperRecord.saveSource
          if (mapperRecord.saveSchema) {
            this.schemas.push({
              dataModel: JSON.parse(this.schemaEditor.getText()),
              id: mapperRecord.mapperRecordId,
              name: mapperRecord.name,
              description: mapperRecord.description,
            })
            this.importedSchema = JSON.parse(this.schemaEditor.getText())
            this.selectedDataModel = undefined
            this.dataModelURL = undefined
          }
          else if (this.importedSchema)
            this.schemaEditor.update(this.importedSchema)
          if (mapperRecord.saveSource) {
            this.sources.push({
              sourceData: this.inputType == "json" ? JSON.parse(this.sourceEditor.getText()) : undefined,
              sourceCSV: this.inputType == "json" ? undefined : this.csvSourceData,
              id: mapperRecord.mapperRecordId,
              name: mapperRecord.name,
              description: mapperRecord.description,
            })
            this.importedSource = this.inputType == "json" ? JSON.parse(this.sourceEditor.getText()) : this.csvSourceData
            this.selectedSource = undefined
            this.sourceDataURL = undefined
          }
          else if (this.importedSource)
            this.sourceEditor.update(this.importedSource)
        }
      });
    }
    catch (error) {
      console.log(error)
      this.handleError(error, true,
        this.sourceEditor.getText() == "" ? "Empty source" :
          editor.mapperEditor.getText() == "" ? "Empty mapper" :
            this.schemaEditor.getText() == "" ? "Empty schema" :
              "Error loading JSON")
    }
  }

  updateRecord() {
    let source, map, unsaved
    try {
      source = JSON.parse(this.sourceEditor.getText())
      map = JSON.parse(editor.mapperEditor.getText())
      unsaved = this.unsaved()

      this.dialogService.open(CreateMapComponent, {
        context: {
          ...this.setContext(unsaved, map, source, false),
          value: this.mapperRecord,
          name: this.name,
        }
      }).onClose.subscribe(async (mapperRecord) => {
        if (mapperRecord) {
          this.mapperRecord = mapperRecord;
          if (!this.savedSchema) this.savedSchema = mapperRecord.saveSchema
          if (!this.savedSource) this.savedSource = mapperRecord.saveSource
          if (mapperRecord.saveSchema) {
            this.schemas.push({
              dataModel: JSON.parse(this.schemaEditor.getText()),
              id: mapperRecord.mapperRecordId,
              name: mapperRecord.name,
              description: mapperRecord.description,
            })
            this.importedSchema = JSON.parse(this.schemaEditor.getText())
            this.selectedDataModel = undefined
            this.dataModelURL = undefined
          }
          if (mapperRecord.saveSource) {
            this.sources.push({
              sourceData: this.inputType == "json" ? JSON.parse(this.sourceEditor.getText()) : undefined,
              sourceCSV: this.inputType == "json" ? undefined : this.csvSourceData,
              id: mapperRecord.mapperRecordId,
              name: mapperRecord.name,
              description: mapperRecord.description,
            }
            )
            this.importedSource = JSON.parse(this.sourceEditor.getText())
            this.selectedSource = undefined
            this.sourceDataURL = undefined
          }
        }
      });
    }
    catch (error) {
      this.handleError(error, true,
        this.sourceEditor.getText() == "" ? "Empty source" :
          editor.mapperEditor.getText() == "" ? "Empty mapper" :
            this.schemaEditor.getText() == "" ? "Empty schema" :
              "Error loading JSON")
    }
  }

  getSchema() {
    try {
      if (this.tempSchema)
        return this.tempSchema
      this.schemaJson = this.schemaEditor?.getText() ? JSON.parse(this.schemaEditor.getText()) : this.exampleSchema
    }
    catch (error) {
      this.errorService.openErrorDialog(error)
    }
    return this.schemaJson
  }

  parsed = false

  async refParse(subObj) {
    console.debug("REF PARSE")
    if (!subObj) this.parsed = false
    let obj2 = subObj ? subObj : this.tempSchema || this.schemaJson
    for (let key in obj2) {
      console.debug(key)
      if (typeof obj2[key] == "object" || Array.isArray(obj2[key]))
        await this.refParse(obj2[key])
      else if (key.startsWith("$ref") || key.startsWith("dollarref")) {
        console.debug(key, subObj[key])
        this.parsed = true
      }
    }
    if (!subObj && !this.parsed) {
      console.debug("returning without backend")
      return this.tempSchema || this.schemaJson
    }
    else {
      console.debug(await this.dmmService.refParse(this.tempSchema || this.schemaJson))
      return await this.dmmService.refParse(this.tempSchema || this.schemaJson)
    }
  }

  generateMapper(schemaParsed) {

    if (this.map) {
      this.map = JSON.parse(editor.mapperEditor.getText())
      this.oldMap = JSON.parse(JSON.stringify(this.map))
    }
    try {
      this.map = this.getAllNestedProperties(schemaParsed);
      try {
        console.debug(this.map, this.oldMap)
        if (this.map && this.oldMap) this.compareMaps(this.oldMap, this.map)
      }
      catch (error) {
        this.handleError(error, false, false)
      }
      console.debug(this.map)
      this.generate_NGSI_ID()
      mapGl = this.map
      editor.mapperEditor.update(this.map)
      this.selectMap = "---select map---"
    }
    catch (error) {
      console.error("generateMapper")
      this.handleError(error, false, false)
      if (error?.status == 0 || error?.error?.status == 0) {
        error.statusText = undefined
        error.message = error.error.message = "Unable to import schema"
      }
      this.errorService.openErrorDialog(error)
      this.map = { "error": "Some errors occurred during generating map object" }
      this.schemaJson = this.exampleSchema
    }
  }

  async schemaChanged($event, from) {

    let errors
    if ($event && $event != "---select schema---") {
      if (this.dataModelURL && from != "url") {
        this.dataModelURL = undefined
      }
      if (this.selectedSchema)
        this.schemaJson = this.selectFilteredSchema();
      if (!this.schemaJson) {
        this.schemaJson = this.exampleSchema
      }

      try {
        //this.generateMapper(await this.refParse(false))
        if (from == "DB")
          this.schemaJson = await this.dmmService.cleanSchema(this.tempSchema || this.schemaJson) //TODO clean schema here in frontend or chose a different way to solve $ saving error on DB
        else
          this.schemaJson = await this.refParse(false)
        console.debug(this.schemaJson)
        this.selectedDataModel = this.schemaJson
        this.schemaEditor.update(this.selectedDataModel)
        //console.debug(this.selectedDataModel)
      }
      catch (error) {
        errors = true
        this.handleError(error, false, false)
        if (error?.status == 0 || error?.error?.status == 0) {
          error.statusText = undefined
          error.message = error.error.message = "Unable to import schema"
        }
        this.errorService.openErrorDialog(error)
        this.map = { "error": "Some errors occurred during generating map object" }
        this.schemaJson = this.exampleSchema

      }
      if (!errors) {
        if (typeof $event == 'string' && !errors)
          this.importedSchema = JSON.parse(this.schemaEditor.getText())
        this.onKeydownMain($event)
      }
      this.tempSchema = undefined
    }
  }

  sourceChanged($event) {

    //if ($event && $event != "---select schema---") {
    try {
      if (this.selectedSource) {
        if (this.sourceDataURL) this.sourceDataURL = undefined
        if (this.inputType == "json") {
          this.sourceJson = this.source();
          this.sourceEditor.update(this.sourceJson)
          if (this.selectedPath != "" && !this.sourceJson[this.selectedPath]) this.selectedPath = ""
          mapOptionsGl = this.selectMapJsonOptions(this.sourceEditor.getText(), "");
          this.paths = this.selectMapJsonOptions(this.sourceEditor.getText(), '')
          this.onUpdatePathForDataMap("", true)
          this.importedSource = JSON.parse(this.sourceEditor.getText())
        }
        else {
          this.csvSourceData = this.source()
          this.importedSource = this.csvSourceData
        }
      }
    }
    catch (error) {
      this.handleError(error, true, "Error during importing source")
    }
  }

  sourceFromChanged($event) {
    if ($event == "minio")
      this.minioSources = this.sources.filter(source => source.from == "minio")
    else
      this.dbSources = this.sources.filter(source => source.from != "minio")
  }

  async reset() {
    this.importedSchema = undefined
    this.importedSource = undefined
    this.mapperRecordId = undefined
    this.dataModelURL = undefined
    this.inputID = undefined
    this.name = undefined
    this.onUpdateInputType("")
    this.mapperRecord = {}
    this.parsed = false
    this.partialCsv = undefined
    this.paths = []
    this.rows = undefined
    this.savedSchema = undefined
    this.savedSource = undefined
    this.selectedSource = undefined
    this.schemaFromFile = undefined
    this.schemaOrMap = "schema"
    this.typeSource = undefined
    this.tempSchema = undefined
    this.tempMap = undefined
    this.sourceRef = ''
    this.sourceRefFormat = undefined
    this.schemaRef = '';
    this.schemaRefFormat = undefined;
    this.isNew = false
    this.selectedPath = undefined
    this.selectedSchema = "---select schema---"
    this.selectedDataModel = this.exampleSchema
    let preview = {
      "preview": "set the source, set the json map and click preview to see the output json preview"
    }
    this.sourceJson = [{
      "info": "set your source json here"
    }]
    this.map = {
      "set a field from the output schema field list": "set a field from the source input"
    }
    this.oldMap = undefined
    this.sourceEditor.update(this.sourceJson)
    editor.mapperEditor.update(this.map)
    this.schemaEditor.update(this.selectedDataModel)
    this.outputEditor.update(preview)
    this.selectMap = "---select map---"
    this.csvSourceData = ""
    this.displayCSV(this.csvSourceData, this.csvtable, this.separatorItem)
    await this.resetConfigSettings()
    this.onUpdatePathForDataMap("", true)
  }

  async setSchemaFromFile($event) {
    this.schemaFromFile = $event
    this.schemaJson =
      this.schemaFromFile

    this.map = this.getAllNestedProperties(await this.dmmService.refParse(this.schemaJson));
    mapGl = this.map
    editor.mapperEditor.update(this.map)
  }

  selectFilteredSchema() {
    try {
      return this.schemas.filter(filteredSchema => filteredSchema._id == this.selectedSchema)[0].dataModel
    }
    catch (error) {
      this.handleError(error, false, false)
      return { error: "Data model is empty or could not be loaded" }
    }
  }

  source() {
    let filteredSource = this.sources.filter(filteredSource => filteredSource._id == this.selectedSource || filteredSource.etag == this.selectedSource)[0]
    if (this.sourceFrom == "minio") {
      this.minioObjName = filteredSource.name
      this.bucket = filteredSource.bucket,
        this.etag = filteredSource.etag
    }
    else
      this.etag = this.bucket = this.minioObjName = undefined
    return filteredSource.source || filteredSource.sourceCSV
  }

  async loadMapperList() {
    try {
      this.maps = await this.dmmService.getMaps();
    }
    catch (error) {
      this.handleError(error, false, false)
      this.maps = []
      throw error
    }
  }

  async loadSchemaList() {
    try {
      this.schemas = await this.dmmService.getSchemas();
    }
    catch (error) {
      this.handleError(error, false, false)
      this.schemas = []
      throw error
    }
  }

  async loadSourceList() {
    try {
      this.sources = this.config.data_model_mapper.minioCache ? await this.dmmService.getDBSources() : await this.dmmService.getSources();
    }
    catch (error) {
      this.handleError(error, false, false)
      this.sources = []
      throw error
    }
  }

  async loadSourceFromDBList() {
    try {
      this.sources = await this.dmmService.getDBSources();
    }
    catch (error) {
      this.handleError(error, false, false)
      this.dbSources = []
      throw error
    }
  }

  async loadRawSourcesFromMinio() {
    try {
      this.minioSources = await this.dmmService.getMinioSources();
    }
    catch (error) {
      this.handleError(error, false, false)
    }
  }

  async loadBucketsFromMinio() {
    try {
      this.buckets = await this.dmmService.getMinioBucketsList();
    }
    catch (error) {
      this.handleError(error, false, false)

    }
  }

  async loadSourceFromMinioList(bucketName) {
    try {
      this.minioObjectList = await this.dmmService.getMinioSourcesList(bucketName);
    }
    catch (error) {
      this.handleError(error, false, false)
    }
  }

  async loadObjectFromMinio(bucketName, objectName) {
    try {
      this.selectedSource = await this.dmmService.getMinioObject(bucketName, objectName);
    }
    catch (error) {
      this.handleError(error, false, false)
    }
  }

  updateConfig($event) {
    if ($event) this.transformSettings.delimiter = $event
    this.configEditor.update(this.transformSettings)
  }

  async resetConfigSettings() {
    this.confirmMapping()
    try {
      this.transformSettings = await this.dmmService.getConfig()
    }
    catch (error) {
      this.handleError(error, false, false)
      this.transformSettings = await this.dmmService.getBackupConfig()
    }
    if (this.transformSettings.backup)
      this.transformSettings = this.transformSettings.backup
    if (!this.transformSettings.rowEnd)
      this.transformSettings.rowEnd = 1000
    !this.configEditor ?
      this.configEditor = new JSONEditor(this.configEditorContainer, this.options2, this.transformSettings)
      :
      this.configEditor.update(this.transformSettings)
    this.separatorItem = this.transformSettings.delimiter
  }

  setSource(source, limit) {
    if ((Array.isArray(source) || typeof source == "object") && limit && this.inputType == "json")
      if (this.selectedPath && this.selectedPath != ".root$$$") {
        source[this.selectedPath] = source[this.selectedPath].slice(0, 3)
      }
      else
        source = source.slice(0, 3)
    else if (limit) {
      this.partialCsv = ""
      this.displayCSV(this.csvSourceData, this.csvtable, this.separatorItem);
      if (this.rows)
        this.partialCsv = this.partialCsv
          .concat(this.rows[0])
          .concat(this.rows[1] ? "\r\n" : '')
          .concat(this.rows[1] || '')
          .concat(this.rows[2] ? "\r\n" : '')
          .concat(this.rows[2] || '')
          .concat(this.rows[3] ? "\r\n" : '')
          .concat(this.rows[3] || '')
    }
    return this.inputType == "csv" ? limit ? this.partialCsv : this.csvSourceData : source
  }

  setLoadingMessage(editor, editorContainer, editorOptions) {
    //while (this.loading && this.sleep(3000))
    if (!editor)
      editor = new JSONEditor(editorContainer, editorOptions, {});
    else editor.update({})
    editor.update({ "Loading": "..." })
  }

  async testMapperRecord() {
    this.updateConfigSettings(false)
    this.loading = true
    this.loaded = false
    this.setLoadingMessage(this.outputEditor, this.outputEditorContainer, this.outputEditorOptions)
    let output
    try {
      let m = JSON.parse(editor.mapperEditor.getText())
      m["targetDataModel"] = "DataModelTemp"
      let source = this.setSource(JSON.parse(this.sourceEditor.getText()), true)
      if (source[this.selectedPath])
        source = source[this.selectedPath]
      output = await this.dmmService.transform(this.inputType, this.minioObjName, this.bucket, this.etag, source, m, this.schemaJson, this.transformSettings)
    }
    catch (error) {
      if (!output)
        output = !error.status ? { "error": "Service unreachable" } : error.error
      this.handleError(error, false, false)
    }

    this.loading = false
    this.loaded = true
    if (!this.outputEditor)
      this.outputEditor = new JSONEditor(this.outputEditorContainer, this.outputEditorOptions, output);
    else this.outputEditor.update(output)
    this.showToast('primary', "Transformed", '');
  }

  sleep(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
    //var start = new Date().getTime();
    //while (new Date().getTime() < start + delay)
    //  console.debug("waiting")
  }

  /*async toggle() {
    await this.sleep(3)
    console.log("Now waiting")
    await this.sleep(3000)
    console.log("FINISH")
    this.loading = true
    console.log(this.loading)

  }*/

  async toggleLoadingAnimation() {
    this.loading = true
    console.log("Now waiting")
    await this.sleep(3000)
    this.loading = false
    console.log("FINISH")
    //await this.toggle()
    //setTimeout(() => this.loading = true, 1000);
    //setTimeout(() => this.loading = false, 3000);
  }

  async transform() {
    this.updateConfigSettings(false)
    let output
    this.loading = true
    this.loaded = false
    this.setLoadingMessage(this.outputEditor, this.outputEditorContainer, this.outputEditorOptions)
    try {
      let m = JSON.parse(editor.mapperEditor.getText())
      m["targetDataModel"] = "DataModelTemp"
      let source = this.setSource(JSON.parse(this.sourceEditor.getText()), false)

      if (source[this.selectedPath])
        source = source[this.selectedPath]

      output = await this.dmmService.transform(this.inputType, this.minioObjName, this.bucket, this.etag, source, m, this.schemaJson, this.transformSettings)
    }
    catch (error) {
      if (!output)
        if (!error.status && error.name == "HttpErrorResponse")
          output = { "error": "Service unreachable" }
        else if (error.status == 413) {
          try {
            output = await this.dmmService.transform(this.inputType, this.minioObjName, this.bucket, this.etag, { url: this.sourceDataURL }, JSON.parse(editor.mapperEditor.getText()), this.schemaJson, this.transformSettings)
          }
          catch (error) {
            console.error(error.message)
          }
        }
        else
          output = error.error
      this.handleError(error, false, false)
    }
    //setTimeout(() =>
    this.loading = false//, 3000);
    this.loaded = true
    try {
      output = output?.filter(e => e != null && e != undefined) || { error: "some errors occurred" }
    }
    catch (error) {
      console.error(error)
      output = { error: "some errors occurred" }
    }
    if (!this.outputEditor)
      this.outputEditor = new JSONEditor(this.outputEditorContainer, this.outputEditorOptions, output);
    else this.outputEditor.update(output)
    this.showToast('primary', "Transformed", '');
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 2500,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
      preventDuplicates: true,
    } as Partial<NbToastrConfig>;

    this.toastrService.show(body, title, config);
  }

  getAllNestedProperties(obj) {

    let properties = {};

    if (obj.allOf)
      for (let oneOf of obj.allOf)
        if (oneOf.properties)
          obj.properties = { ...obj.properties, ...oneOf.properties }

    if (obj.properties)
      for (let key in obj.properties)
        if (typeof obj.properties[key] == 'object' || (obj.properties[key] && obj.properties[key].properties))
          properties[key] = this.getAllNestedProperties(obj.properties[key]);
        else
          properties[key] = "";
    else
      return ""
    return properties;
  }

  compareMaps(oldMap, newMap) {
    for (let key in newMap) {
      console.debug(key)
      if (oldMap && oldMap[key])
        if (typeof newMap[key] == "object" || Array.isArray(newMap[key]))
          this.compareMaps(oldMap[key], newMap[key])
        else //if (oldMap[key] && (typeof oldMap[key] == "object" || Array.isArray(typeof oldMap[key])))
        {
          newMap[key] = JSON.parse(JSON.stringify(oldMap[key]))
          console.debug(newMap[key], "|", JSON.parse(JSON.stringify(oldMap[key])))
        }
    }
    if (this.transformSettings.NGSI_entity) {
      if (oldMap[this.transformSettings.entityNameField])
        newMap[this.transformSettings.entityNameField] = oldMap[this.transformSettings.entityNameField]
      if (!newMap.targetDataModel)
        newMap.targetDataModel = "DataModelTemp"
      if (oldMap.type)
        newMap.type = oldMap.type
    }

  }

  //skipArrays:Ignore the array part
  //keepObjKeys:Whether to keep the parent object keys

  getKeys(obj, keepObjKeys, skipArrays, keys = [], scope = []) {
    if (Array.isArray(obj)) {
      /*if (!skipArrays) scope.push('[' + obj.length + ']');
      obj.forEach((o) => this.getKeys(o, keepObjKeys, skipArrays, keys, scope), keys);*/
    } else if (obj && typeof obj === 'object' && obj.constructor === Object) {
      Object.keys(obj).forEach((k) => {
        if ((!Array.isArray(obj[k]) && !(typeof obj[k] === 'object')) || keepObjKeys) {
          let path = scope.concat(k).join('.').replace(/\.\[/g, '[');
          if (!keys.includes(path)) keys.push(path);
        }
        this.getKeys(obj[k], keepObjKeys, skipArrays, keys, scope.concat(k));
      }, keys);
    }
    return keys;
  }

  keys = []

  getKeys_2(obj, key, path) {
    if (key && key != "")
      obj = obj[key]
    if (typeof obj == "object" || Array.isArray(obj))
      for (let subKey in obj)
        if (typeof obj[subKey] == "object" || Array.isArray(obj[subKey]))
          this.getKeys_2(JSON.parse(JSON.stringify(obj)), subKey, path ? path + "." + subKey : subKey)
        else this.keys.push(path + "." + subKey)
    else this.keys.push(path)
  }

  onUpdateInputType(event) {

    const divJsonElement = document.getElementById('json-input');
    const divCSVElement = document.getElementById('csv-input');

    this.inputType = event

    if (event === 'csv') {
      divCSVElement.style.display = 'block';
      divJsonElement.style.display = 'none';
    } else if (event == 'json') {
      divCSVElement.style.display = 'none';
      divJsonElement.style.display = 'block';
    }
    else {
      divCSVElement.style.display = 'none';
      divJsonElement.style.display = 'none';
    }
  }

  onUpdatePathForDataMap($event, root) {
    if ($event == ".root$$$") $event = ""
    this.confirmMapping()
    this.paths = this.selectMapJsonOptions(this.sourceEditor.getText(), "")
    mapOptionsGl = this.selectMapJsonOptions(this.sourceEditor.getText(), $event);
    //if (!$event && !root)
    //  mapOptionsGl[0] = "---no keys for selected path---"
    if (!mapOptionsGl[0])
      mapOptionsGl[0] = "---no keys for selected path---"
    this.setMapEditor(true);
  }

  tempMap = { temp: undefined }

  deepInPath(path, value, map) {
    //for (let sub of path)
    if (path[1]) {
      let sub = path.shift()
      map[sub] = this.deepInPath(path, value, map[sub])// = this.deepInPath(path, value, map[sub])
      return map[sub]
    }
    else {
      map[path] = value
      return map
    }
  }

  updateMapper(path, value, map) {//, mapperEditor) {
    const deepInPath = (path, value, map) => {
      //for (let sub of path)
      if (path[1]) {
        let sub = path.shift()
        map[sub] = deepInPath(path, value, map[sub])// = this.deepInPath(path, value, map[sub])
        return map[sub]
      }
      else {
        map[path] = value
        return map
      }
    }
    //let fixedPath = ""
    if (path[1]) {
      map[path[0]] = deepInPath(path, value, map)
    }
    else map[path] = value
    try {
      editor.mapperEditor.update(map)
    }
    catch (error) {
      this.handleError(error, false, false)
      //editor.mapperEditor.update(map)
    }
  }

  setMapEditor(justOptions) {

    let updateMapper = this.updateMapper
    var dialogService = this.dialogService;

    //let map = this.map
    mapGl = this.map
    //editor.mapperEditor = editor.mapperEditor
    try {
      this.options2 = {
        mode: 'tree',
        modes: ['tree', 'code', 'view', 'preview'], // allowed modes
        onModeChange: function (newMode, oldMode) {
        },

        onCreateMenu: function (items, node) {
          const path = node.path

          // log the current items and node for inspection
          //console.log('items:', items, 'node:', node)

          var selectPath = path;
          function pathToMap() {
            //this.m = mOptions
            dialogService
              .open(DialogDataMapComponent, {
                context: { mapOptions: mapOptionsGl, selectPath: selectPath, map: mapGl },
              }).onClose.subscribe((value) => {
                let editor = require('./mapperEditor')
                if (value)
                  updateMapper(selectPath, value ? value[0] : "", mapGl)//, mapperEditor)// value[1] is the map
              });
          }

          if (path) {
            // items.push instead items = if you want to maintain other menu options
            items = [{
              text: 'Map', // the text for the menu item
              title: 'Put the map with source', // the HTML title attribute
              className: 'example-class',
              click: pathToMap // the function to call when the menu item is clicked
            }]
          }

          items.forEach(function (item, index, items) {
            if ("submenu" in item) {
              // if the item has a submenu property, it is a submenu heading
              // and contains another array of menu items. Let's colour
              // that yellow...
              items[index].className += ' submenu-highlight'
            } else {
              // if it's not a submenu heading, let's make it colorful
              items[index].className += ' rainbow'
            }
          })

          // note that the above loop isn't recursive, so it only alters the classes
          // on the top-level menu items. To also process menu items in submenus
          // you should iterate through any "submenu" arrays of items if the item has one.

          // next, just for fun, let's remove any menu separators (again just at the
          // top level menu). A menu separator is an item with a type : 'separator'
          // property
          items = items.filter(function (item) {
            return item.type !== 'separator'
          })

          // finally we need to return the items array. If we don't, the menu
          // will be empty.
          return items
        }
      };
    }
    catch (error) {
      this.handleError(error, false, false)
      console.error("Error during map setting set")
    }

    if (!editor.mapperEditor && !justOptions) editor.mapperEditor = new JSONEditor(this.mapperEditorContainer, this.options2, this.map);
    else if (!justOptions) editor.mapperEditor.update(this.map)
    if (editor.mapperEditor) this.map = JSON.parse(editor.mapperEditor.getText())
  }

  async buildSnippet() {
    let source = this.inputType == "json" ? JSON.parse(this.sourceEditor.getText()) : this.csvSourceData
    let token
    try {
      token = await this.dmmService.getToken()
    }
    catch (error) {
      console.error(error)
      token = error.error.text
    }

    let body = this.isNew ?
      {
        sourceData: source,
        mapID: this.mapperRecord.mapperRecordId
      }
      :
      this.bodyBuilder(source)

    return "curl -X POST \\\n'".concat(
      this.config.data_model_mapper.default_mapper_url) +
      "' \\\n-H \"Accept:application/json\" \\\n" +
      "-H \"Authorization:Bearer " + token + "\" \\\n" +
      "-H 'Content-Type: application/json' \\\n" +
      "-d '" + JSON.stringify(body) + "'"
  }

  bodyBuilder(source) {
    let body = {
      sourceDataType: this.inputType,
      path: this.selectedPath,
      mapData: JSON.parse(editor.mapperEditor.getText()),
      config: this.transformSettings
    }
    if (this.differences(this.importedSchema, JSON.parse(this.schemaEditor.getText())) || this.rawSchema()) body["dataModel"] = JSON.parse(this.schemaEditor.getText())
    else {
      if (this.selectedSchema && this.selectedSchema != "---select schema---")
        body["dataModelID"] = this.selectedSchema
      body["dataModelURL"] = this.dataModelURL
    }
    if (this.differences(this.importedSource, this.inputType == "json" ? JSON.parse(this.sourceEditor.getText()) : this.csvSourceData) || this.rawSource())
      body["sourceData"] = this.setSource(source, true)
    else {
      body["sourceDataURL"] = this.sourceDataURL
      if (this.minioObjName)
        body["sourceDataMinio"] = {
          name: this.minioObjName,
          bucket: this.bucket,
          etag: this.etag
        }
      else
        body["sourceDataID"] = this.selectedSource
    }
    return body
  }

  saveAsFile(): void {

    let source = JSON.parse(this.sourceEditor.getText())

    this.dialogService.open(ExportFileComponent).onClose.subscribe((content) => {
      if (content == "file")
        this.saveFile(JSON.stringify(this.bodyBuilder(source)), "json");
      else if (content == "snippet")
        this.saveFile(this.buildSnippet(), "bash");
    })
  }

  download() {
    this.saveFile(this.outputEditor.getText(), "json")
  }

  async saveFile(model, type): Promise<void> {
    const filename = (this?.name || this?.mapperRecord?.name || "exportedFile") + "." + type,
      blob = new Blob([model], {
        type: 'application/json;charset=utf-8',
      });

    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement('a');
      a.download = filename;
      a.href = URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');

      a.dispatchEvent(
        new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: false,
        })
      );
    }
  }

  confirmMapping() {
    try {
      mapGl = this.map = JSON.parse(editor.mapperEditor.getText())
    }
    catch (error) {
      error.message == "Cannot read properties of undefined (reading 'getText')" ? console.log() :
        this.handleError(error, false, false)
    }
  }

  handleError(error, modal, message) {
    if (message) {
      console.error(message)
      error.message += ". " + message
      if (!error.error)
        error.error = { message }
      else
        error.error.message += ". " + message
    }
    else
      console.error(error?.message || error?.error?.message || error?.statusText || error)
    if (modal)
      this.errorService.openErrorDialog(error)
    //console.error(error)
  }

  generate_NGSI_ID() {
    if (this.transformSettings.NGSI_entity) {
      if (!this.map[this.transformSettings.entityNameField])
        mapGl = this.map[this.transformSettings.entityNameField] = ""
      if (!this.map.targetDataModel)
        mapGl = this.map.targetDataModel = "DataModelTemp"
      if (!this.map.type)
        mapGl = this.map.type = ""
      editor.mapperEditor.update(this.map)
    }
    else {
      //if (this.map[this.transformSettings.entityNameField] || typeof this.map[this.transformSettings.entityNameField] == 'string')
      mapGl = this.map[this.transformSettings.entityNameField] = undefined
      mapGl = this.map.type = undefined
      //if (this.map.targetDataModel)
      mapGl = this.map.targetDataModel = undefined
      editor.mapperEditor.update("m")
      editor.mapperEditor.update(this.map)
    }
  }

  updateConfigSettings(touchMap) {
    let backSet = JSON.parse(JSON.stringify(this.transformSettings))
    try {
      if (touchMap) this.confirmMapping()
      this.transformSettings = JSON.parse(this.configEditor.getText())
      this.separatorItem = this.transformSettings.delimiter
      if (touchMap) this.generate_NGSI_ID()
      if (touchMap) this.generateMapper(this.getSchema())
    }
    catch (error) {
      this.transformSettings = backSet
      this.configEditor.update(this.transformSettings)
    }
  }

  async mapChanged($event, settingsFromFile) {
    if (settingsFromFile || ($event && $event != "---select map---")) {
      let mapSettings

      if ($event && $event != "---select map---")
        mapSettings = this.maps.filter(filteredMap => filteredMap._id == $event)[0]
      else mapSettings = JSON.parse(settingsFromFile)

      this.onUpdateInputType(mapSettings?.sourceDataType)

      if (mapSettings?.config)
        this.newConfig(mapSettings?.config)
      else this.resetConfigSettings()

      if (mapSettings.sourceDataID && !mapSettings.sourceData && !this.emptySource) {
        this.selectedSource = mapSettings.sourceDataID
        try {
          mapSettings.sourceData = await this.source()//TODO maybe source is already loaded. Check this.sourceEditor.getText()
          this.importedSource = o(mapSettings.sourceData)
        }
        catch (error) {
          if (error.message == "Cannot read properties of undefined (reading 'source')")
            error.message = "Source could not be loaded"
          this.handleError(error, false, false)
          mapSettings.sourceData = { error: "source is empty or could not be loaded" }
          this.importedSource = o(mapSettings.sourceData)
        }
      }
      else if (mapSettings.sourceDataMinio && !mapSettings.sourceData && !this.emptySource) {
        this.selectedSource = mapSettings.sourceDataMinio.etag
        try {
          mapSettings.sourceData = await this.dmmService.getMinioObject(mapSettings.sourceDataMinio.bucket, mapSettings.sourceDataMinio.name) //TODO maybe source is already loaded. Check this.sourceEditor.getText()
          this.importedSource = o(mapSettings.sourceData)
        }
        catch (error) {
          if (error.message == "Cannot read properties of undefined (reading 'source')")
            error.message = "Source could not be loaded"
          this.handleError(error, false, false)
          mapSettings.sourceData = { error: "source is empty or could not be loaded" }
          this.importedSource = o(mapSettings.sourceData)
        }
      }
      else if (mapSettings.sourceDataURL && !mapSettings.sourceData && !this.emptySource) {
        this.sourceDataURL = mapSettings.sourceDataURL
        if (this.selectedSource) this.selectedSource = undefined
        try {
          mapSettings.sourceData = await this.dmmService.getRemoteSource(mapSettings.sourceDataURL, mapSettings.sourceDataType);
          this.importedSource = o(mapSettings.sourceData)
        }
        catch (error) {
          this.handleError(error, false, false)
          mapSettings.sourceData = { error: "some errors occurred when downloading remote source" }
          this.importedSource = o(mapSettings.sourceData)
        }
      }
      else if (!mapSettings.sourceData) {
        mapSettings.sourceData = this.exampleSource
        this.importedSource = o(mapSettings.sourceData)
        this.csvSourceData = "" //TODO verify if this is sufficient
        this.updateCSVTable()
        this.sourceEditor.update(mapSettings.sourceData)
      }
      else {
        this.importedSource = o(mapSettings.sourceData)
      }

      if (mapSettings.dataModelID && !mapSettings.dataModel) {
        this.selectedSchema = mapSettings.dataModelID
        mapSettings.dataModel = await this.selectFilteredSchema()
        this.importedSchema = o(mapSettings.dataModel)
        if (!mapSettings.dataModel) {
          mapSettings.dataModel = { error: "schema is empty or could not be loaded" }
          this.importedSchema = o(mapSettings.dataModel)
        }
      }
      else if (mapSettings.dataModelURL && !mapSettings.dataModel) {
        this.dataModelURL = mapSettings.dataModelURL
        if (this.selectedDataModel) this.selectedDataModel = undefined
        try {
          mapSettings.dataModel = await this.dmmService.getRemoteSource(mapSettings.dataModelURL, "json");
          this.importedSchema = o(mapSettings.dataModel)
        }
        catch (error) {
          this.handleError(error, false, false)
          mapSettings.dataModel = { error: "Some errors occurred when downloading remote schema" }
          this.importedSchema = o(mapSettings.dataModel)
        }
      }

      this.schemaJson = mapSettings.dataModel
      this.importedSchema = o(mapSettings.dataModel)

      if (mapSettings.sourceDataType == "json" && !this.emptySource) {
        //this.sourceJson = this.source();
        this.sourceEditor.update(mapSettings.sourceData) //TODO maybe source editor is already updated. Check this.sourceEditor.getText()
        if (mapSettings.path || mapSettings.path == '') {
          this.selectedPath = mapSettings.path
          mapOptionsGl = this.selectMapJsonOptions(this.sourceEditor.getText(), mapSettings.path);
        }
        else {
          this.selectedPath = ""
          mapOptionsGl = this.selectMapJsonOptions(this.sourceEditor.getText(), "");
        }
        //if (mapSettings.path) this.paths = this.selectMapJsonOptions(this.sourceEditor.getText(), '')
        //else
        this.paths = this.selectMapJsonOptions(this.sourceEditor.getText(), '')
        if (mapSettings.path) this.onUpdatePathForDataMap(mapSettings.path, false)
        else this.onUpdatePathForDataMap("", true)
      }
      else if (mapSettings.sourceDataType == "csv" && !this.emptySource) {
        this.importedSource = this.csvSourceData = typeof mapSettings.sourceData == "string" ? mapSettings.sourceData : JSON.stringify(mapSettings.sourceData)
        this.updateCSVTable()
      }
      else if (!this.emptySource)
        this.onUpdateInputType("")

      mapGl = this.map = mapSettings.map || mapSettings.mapData
      this.mapperRecord = {}
      if (mapSettings._id) this.mapperRecord.mapperRecordId = mapSettings._id
      if (mapSettings.name) this.name = mapSettings.name
      if (mapSettings.description) this.mapperRecord.description = mapSettings.description
      if (mapSettings.status) this.mapperRecord.status = mapSettings.status
      if (this.mapperRecord.mapperRecordId) this.isNew = true
      editor.mapperEditor.update(this.map)
      this.selectedSchema = "---select schema---"
      this.selectedSource = undefined
      //this.loading = true
      //this.loaded = false
      this.setLoadingMessage(this.schemaEditor, this.schemaEditorContainer, this.schemaOptions)
      if (mapSettings.dataModel) this.schemaEditor.update(await this.dmmService.cleanSchema(mapSettings.dataModel))
      //this.loading = false
      //this.loaded = true
    }
  }

  newConfig(config: any) {
    this.transformSettings = config
    this.configEditor.update(config)
    if (config?.delimiter) this.separatorItem = config?.delimiter
  }

  updateCSVTable() {
    try {
      this.displayCSV(this.csvSourceData, this.csvtable, this.separatorItem)
      mapOptionsGl = this.csvSourceData.slice(0, this.csvSourceData.indexOf("\n")).split(this.separatorItem)
      this.setMapEditor(true);
    }
    catch (error) {
      if (this.inputType != "json")
        this.handleError(error, false, false)
    }
  }

  verifyRoot($event) {
    return $event == ".root$$$"
  }

  import(field, typeSource: string): void {
    this.typeSource = typeSource;
    this.dialogService
      .open(DialogImportComponent, field == "map" ? { context: { map: true } } : { context: { type: typeSource } })
      .onClose.subscribe(async (result: { content: string; source: string; format: string; mapSettings }) => {
        if (result?.mapSettings)
          this.mapChanged(false, result.mapSettings)
        else if (result && result?.content) {
          if (typeSource == 'csv') {
            this.sourceRef = result?.source;
            this.sourceRefFormat = result?.format;
            if (this.sourceRefFormat == "url")
              this.sourceDataURL = result.source
            this.csvSourceData = result.content;
            this.displayCSV(this.csvSourceData, this.csvtable, this.separatorItem);
            mapOptionsGl = this.csvSourceData.slice(0, this.csvSourceData.indexOf("\n")).split(this.separatorItem);
            if (this.selectedSource) this.selectedSource = undefined
            this.importedSource = this.csvSourceData
          }
          else if (field == 'source') {
            this.sourceRef = result?.source;
            this.sourceRefFormat = result?.format;
            if (this.sourceRefFormat == "url") {
              this.sourceDataURL = result.source
              if (this.selectedSource) this.selectedSource = undefined
            }
            if (!this.sourceEditor) {
              this.sourceEditor = new JSONEditor(this.sourceEditorContainer, this.sourceOptions, JSON.parse(result.content));
              this.importedSource = JSON.parse(result.content)
            }
            else
              try {
                this.sourceEditor.setText(result.content);
                if (this.selectedSource) this.selectedSource = undefined
                this.importedSource = JSON.parse(result.content)
              }
              catch (error) {
                this.handleError(error, false, false)
                this.sourceEditor.update({ message: "you must import a valid json" })
              }

            try {
              mapOptionsGl = this.selectMapJsonOptions(this.sourceEditor.getText(), "");
              this.paths = this.selectMapJsonOptions(result.content, '')
            }
            catch (error) {
              this.handleError(error, false, false)
            }

            this.onUpdatePathForDataMap("", true)
          }
          else if (field == 'schema') {
            this.schemaRef = result?.source;
            this.schemaRefFormat = result?.format;
            if (this.schemaRefFormat == "url") {
              this.dataModelURL = result.source
              this.selectedSchema = "---select schema---"
            }
            try {
              this.tempSchema = JSON.parse(result.content)
            }
            catch (error) {
              this.handleError(error, false, false)
              this.schemaJson = { "error": "import a valid schema" }
            }
            this.schemaChanged(this.getSchema(), "url")
          }
        }
      });
  }

  properties

  canGenerateSchema

  onKeydownMain($event) {

    this.canGenerateSchema = true
  }

  updateBody() {
    this.bodyEditor.update(this.isNew ?
      {
        sourceData: this.inputType == "json" ? JSON.parse(this.sourceEditor.getText()) : this.csvSourceData,
        mapID: this.mapperRecord.mapperRecordId
      }
      :
      this.bodyBuilder(this.inputType == "json" ? JSON.parse(this.sourceEditor.getText()) : this.csvSourceData))
  }

  async updateCurl() {
    //while (curl != this.buildSnippet().replace("\\", " "))
    //curl = this.buildSnippet().replace("\\", " ")
    this.curl = await this.buildSnippet()
    //this.curlEditor.update(this.buildSnippet())
  }

  onKeydownReactive($event) {
    try {
      let schema = JSON.parse(this.schemaEditor?.getText())
      if //( &&!this.schemaJson?.properties
        (
        schema?.properties ||
        schema?.allOf?.filter(o => o?.properties)[0] ||
        schema?.anyOf?.filter(o => o?.properties)[0]
        //)
      ) {
        this.schemaJson = schema
        //if (!this.schemaJson.properties) {
        this.properties = true
        //this.schemaEditor.update(this.schemaJson)
        //}
      }
    }
    catch (error) {
      this.properties = false
      if (!error.message.startsWith("Expected") &&
        !error.message.startsWith("Unexpected"))
        this.handleError(error, false, false)
    }
  }


  selectMapJsonOptions(content: string, path: string): string[] {
    let options = []
    let allMapOptions = []
    let arrayTemp
    let arrayTemp2 = JSON.parse(content)
    let root = false
    if (path == "") root = true
    if (Array.isArray(JSON.parse(content)[path]) || (root && Array.isArray(JSON.parse(content)))) {
      if (root && Array.isArray(JSON.parse(content)))
        for (let element of JSON.parse(content)) {
          arrayTemp = [element]
          arrayTemp2 = arrayTemp
          allMapOptions = allMapOptions.concat(this.getKeys(_.get(arrayTemp2, path + '[0]', arrayTemp2), true, true))
        }
      else for (let element of JSON.parse(content)[path]) {
        arrayTemp = [element]
        arrayTemp2[path] = arrayTemp
        allMapOptions = allMapOptions.concat(this.getKeys(_.get(arrayTemp2, path + '[0]', arrayTemp2), true, true))
      }
      options = allMapOptions.filter((item, pos) => allMapOptions.indexOf(item) === pos)
      return options
    }
    return this.getKeys(_.get(JSON.parse(content), path + '[0]', JSON.parse(content)), true, true)
  }

  displayCSV(csvData: string, element: HTMLElement, separator: string) {
    // Split the CSV data into an array of rows
    var divElement = document.createElement('div');
    divElement.style.overflowY = "auto";
    divElement.style.height = "200px";

    this.rows = csvData?.split('\n');

    // Create a table element
    var table = document.createElement('table');
    table.className = 'table table-striped';

    // Loop through each row in the CSV data
    this.rows?.forEach((rowData, index) => {
      // Split the row into an array of cells
      const cells = rowData.split(separator);

      // Create a table row element

      const row = document.createElement(index === 0 ? 'thead' : 'tr');

      // Loop through each cell in the row and add it to the table cell element
      cells.forEach((cellData) => {
        const cell = document.createElement(index === 0 ? 'th' : 'td');
        cell.textContent = cellData;
        row.appendChild(cell);
      });

      // Add the row to the table
      table.appendChild(row);
    });

    // Add the table to the document

    divElement.appendChild(table);
    element.textContent = ""
    element.appendChild(divElement);
  }

}
