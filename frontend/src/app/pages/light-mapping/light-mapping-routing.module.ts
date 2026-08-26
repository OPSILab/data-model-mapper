import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LightMappingComponent } from './light-mapping.component';

const routes: Routes = [
  {
    path: '',
    component: LightMappingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LightMappingRoutingModule {}
