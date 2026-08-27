import { Component, OnInit } from '@angular/core';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrConfig, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ErrorDialogService } from '../error-dialog/error-dialog.service';
import { LightMappingService } from './light-mapping.service';

@Component({
  selector: 'ngx-light-mapping',
  templateUrl: './light-mapping.component.html',
  styleUrls: ['./light-mapping.component.scss'],
})
export class LightMappingComponent implements OnInit {
  data: any[] = [];
  loading = false;
  saving = false;
  loaded = false;
  dirty = false;

  constructor(
    private lightMappingService: LightMappingService,
    private errorDialogService: ErrorDialogService,
    private toastrService: NbToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    void this.load();
  }

  load = async (): Promise<void> => {
    this.loading = true;
    try {
      const result = await this.lightMappingService.getData();
      this.data = Array.isArray(result) ? result : [];
      this.loaded = true;
      this.dirty = false;
    } catch (error) {
      this.errorDialogService.openErrorDialog(error);
    } finally {
      this.loading = false;
    }
  };

  onChanged(): void {
    this.dirty = true;
  }

  save = async (): Promise<void> => {
    this.saving = true;
    try {
      await this.lightMappingService.uploadData(this.data);
      this.dirty = false;
      this.showToast('success', this.translate.instant('general.lightMapping.saveSuccess') as string, '');
    } catch (error) {
      this.errorDialogService.openErrorDialog(error);
    } finally {
      this.saving = false;
    }
  };

  private showToast(type: NbComponentStatus, title: string, body: string): void {
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
}
