import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightMappingComponent } from './light-mapping.component';
import { LightMappingRoutingModule } from './light-mapping-routing.module';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LightMappingComponent
  ],
  imports: [
    CommonModule,
    LightMappingRoutingModule,
    NbCardModule,
    NbIconModule,
    TranslateModule.forChild({}),
  ]
})
export class LightMappingModule { }
