import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxConfigureService } from 'ngx-configure';
import { AppConfig } from '../../model/appConfig';

@Injectable({
  providedIn: 'root',
})
export class LightMappingService {
  private config: AppConfig;

  constructor(configService: NgxConfigureService, private http: HttpClient) {
    this.config = configService.config as AppConfig;
  }

  // GET: recupera l'array di dati da mappare. Endpoint definito in assets/config*.json -> light_mapping.get_url
  getData(): Promise<any[]> {
    return this.http.get<any[]>(this.config.light_mapping.get_url).toPromise();
  }

  // POST: invia l'array (eventualmente riordinato/modificato) all'endpoint di upload -> light_mapping.post_url
  uploadData(data: any[]): Promise<any> {
    return this.http.post<any>(this.config.light_mapping.post_url, data).toPromise();
  }
}
