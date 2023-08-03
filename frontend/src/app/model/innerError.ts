/**
 * SDK Service API
 * SDK Service API for integration with cape
 *
 * The version of the OpenAPI document: 2.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ApiValidationError } from './apiValidationError';

/**
 * Error Response object
 */
export interface InnerError {
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  timestamp?: string;
  subErrors?: Array<ApiValidationError>;
}