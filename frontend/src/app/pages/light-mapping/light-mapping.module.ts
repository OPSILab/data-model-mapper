import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NbButtonModule, NbCardModule, NbIconModule, NbSpinnerModule, NbToggleModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { LightMappingComponent } from './light-mapping.component';
import { LightMappingRoutingModule } from './light-mapping-routing.module';
import { JsonArrayEditorComponent } from './json-array-editor/json-array-editor.component';

@NgModule({
  declarations: [
    LightMappingComponent,
    JsonArrayEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    LightMappingRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule,
    NbToggleModule,
    TranslateModule.forChild({}),
  ]
})
export class LightMappingModule { }
