/**
 * Service Catalog API
 * Service Catalog APIs used to manage CRUD for Service Model descriptions.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { HasUsageRule } from './hasUsageRule';
import { HasInfo } from './hasInfo';
import { IsPersonalDataHandling } from './isPersonalDataHandling';
import { HasServiceInstance } from './hasServiceInstance';


export interface ServiceModel { 
    identifier?: string;
    title?: string;
    issued: string;
    createdByUserId: string;
    versionInfo?: string;
    serviceIconUrl: string;
    status: ServiceModelStatusEnum;
    isPublicService: boolean;
    hasInfo: HasInfo;
    hasServiceInstance: HasServiceInstance;
    hasUsageRule: Array<HasUsageRule>;
    isPersonalDataHandling?: Array<IsPersonalDataHandling>;
    id: string;
    type: string;
}
export enum ServiceModelStatusEnum {
    Completed = 'Completed',
    Deprecated = 'Deprecated',
    UnderDevelopment = 'UnderDevelopment',
    WithDrawn = 'WithDrawn'
};


