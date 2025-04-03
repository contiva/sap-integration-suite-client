/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** IntegrationRuntimeArtifact */
export interface ComSapHciApiIntegrationRuntimeArtifact {
  Id?: string | null;
  Version?: string | null;
  Name?: string | null;
  Type?: string | null;
  DeployedBy?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  DeployedOn?: string | null;
  Status?: string | null;
  ErrorInformation?: ComSapHciApiRuntimeArtifactErrorInformation;
}

/** IntegrationRuntimeArtifactPlaceholder */
export interface ComSapHciApiIntegrationRuntimeArtifactPlaceholder {
  BinaryFile?: string | null;
}

/** IntegrationRuntimeArtifact_Request */
export interface ComSapHciApiIntegrationRuntimeArtifactRequest {
  Id?: string | null;
  Version?: string | null;
  Name?: string | null;
  Type?: string | null;
}

/** RuntimeArtifactErrorInformation */
export interface ComSapHciApiRuntimeArtifactErrorInformation {
  Id?: string | null;
}

/** IntegrationDesigntimeArtifact */
export interface ComSapHciApiIntegrationDesigntimeArtifact {
  Id?: string | null;
  Version?: string | null;
  PackageId?: string | null;
  Name?: string | null;
  Description?: string | null;
  /** @format base64url */
  ArtifactContent?: string | null;
  /** Collection of Configuration */
  Configurations?: {
    results?: ComSapHciApiConfiguration[];
  };
  /** Collection of Resource */
  Resources?: {
    results?: ComSapHciApiResource[];
  };
}

/** IntegrationDesigntimeArtifact (for creation) */
export interface ComSapHciApiIntegrationDesigntimeArtifactCreate {
  Name?: string;
  Id?: string;
  PackageId?: string;
  /**
   * @format base64url
   * @example "integration flow zip content in base64-encoded format"
   */
  ArtifactContent?: string | null;
}

/** IntegrationDesigntimeArtifact (for update) */
export interface ComSapHciApiIntegrationDesigntimeArtifactUpdate {
  Name?: string;
  /**
   * @format base64url
   * @example "integration flow zip content in base64-encoded format"
   */
  ArtifactContent?: string | null;
}

/** MessageMappingDesigntimeArtifact */
export interface ComSapHciApiMessageMappingDesigntimeArtifact {
  Id?: string | null;
  Version?: string | null;
  PackageId?: string | null;
  Name?: string | null;
  Description?: string | null;
  /** @format base64url */
  ArtifactContent?: string | null;
  /** Collection of Resource */
  Resources?: {
    results?: ComSapHciApiResource[];
  };
}

/** MessageMappingDesigntimeArtifact (for creation) */
export interface ComSapHciApiMessageMappingDesigntimeArtifactCreate {
  Name?: string;
  Id?: string;
  PackageId?: string;
  Description?: string;
  /**
   * @format base64url
   * @example "integration flow zip content in base64-encoded format"
   */
  ArtifactContent?: string | null;
}

/** MessageMappingDesigntimeArtifact (for update) */
export interface ComSapHciApiMessageMappingDesigntimeArtifactUpdate {
  Name?: string;
  Description?: string;
  /**
   * @format base64url
   * @example "integration flow zip content in base64-encoded format"
   */
  ArtifactContent?: string | null;
}

/** BuildAndDeployStatus */
export interface ComSapHciApiBuildAndDeployStatus {
  d: {
    __metadata: {
      id: string;
      uri: string;
      type: string;
    };
    TaskId: string;
    Status: string;
  };
}

/** Configuration */
export interface ComSapHciApiConfiguration {
  ParameterKey?: string;
  ParameterValue?: string;
  DataType?: string;
}

/** Configuration (for update) */
export interface ComSapHciApiConfigurationUpdate {
  /** @example "new value" */
  ParameterValue?: string;
  /** @example "xsd:integer" */
  DataType?: string;
}

/** Resource */
export interface ComSapHciApiResource {
  /** @example "file name" */
  Name?: string;
  /** @example "edmx/groovy/jar/js/mmap/opmap/wsdl/xsd/xslt" */
  ResourceType?: string;
  /** @example "" */
  ReferencedResourceType?: string | null;
  /**
   * @format base64url
   * @example "resource in base64 encoded format"
   */
  ResourceContent?: string | null;
}

/** Resource (for create) */
export interface ComSapHciApiResourceCreate {
  /** @example "file name" */
  Name?: string;
  /** @example "edmx/groovy/jar/js/mmap/opmap/wsdl/xsd/xslt" */
  ResourceType?: string;
  /** @example "" */
  ReferencedResourceType?: string | null;
  /**
   * @format base64url
   * @example "resource in base64 encoded format"
   */
  ResourceContent?: string | null;
}

/** Resource (for update) */
export interface ComSapHciApiResourceUpdate {
  /**
   * @format base64url
   * @example "resource in base64 encoded format"
   */
  ResourceContent?: string;
}

/** ServiceEndpoint */
export interface ComSapHciApiServiceEndpoint {
  /** @example "string" */
  Name?: string | null;
  Id?: string;
  Title?: string;
  Version?: string;
  Summary?: string;
  Description?: string;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04Z"
   */
  LastUpdated?: string | null;
  /** @example "AS2, AS4, ODATAV2, SOAP" */
  Protocol?: string;
  EntryPoints?: ComSapHciApiEntryPoint[];
  ApiDefinitions?: ComSapHciApiDefinition[];
}

/** EntryPoint */
export interface ComSapHciApiEntryPoint {
  Name?: string;
  Url?: string;
  /** @example "string" */
  Type?: string | null;
  /** @example "string" */
  AdditionalInformation?: string | null;
}

/** APIDefinition */
export interface ComSapHciApiDefinition {
  Url?: string;
  Name?: string;
}

/** CustomTagsConfiguration */
export interface ComSapHciApiCustomTagsConfiguration {
  customTagsConfiguration: {
    tagName: string;
    isMandatory: boolean;
  }[];
}

/** CustomTagsConfiguration (for creation) */
export interface ComSapHciApiCustomTagsConfigurationCreate {
  /**
   * @format base64url
   * @example "JSON representation of custom tags definition in base64-encoded format"
   */
  customTagsConfiguration?: string | null;
}

/** IntegrationPackage */
export interface ComSapHciApiIntegrationPackage {
  Id?: string;
  Name?: string;
  /** @example "string" */
  Description?: string | null;
  ShortText?: string;
  /** @example "string" */
  Version?: string | null;
  /** @example "string" */
  Vendor?: string | null;
  /** @example "string" */
  Mode?: string | null;
  /** @example "SAP Cloud Integration or SAP Process Orchestration or SuccessFactors Integration Center" */
  SupportedPlatform?: string | null;
  /** @example "string" */
  ModifiedBy?: string | null;
  /** @example "string" */
  CreationDate?: string | null;
  /** @example "string" */
  ModifiedDate?: string | null;
  /** @example "string" */
  CreatedBy?: string | null;
  /** @example "string" */
  Products?: string | null;
  /** @example "string" */
  Keywords?: string | null;
  /** @example "string" */
  Countries?: string | null;
  /** @example "string" */
  Industries?: string | null;
  /** @example "string" */
  LineOfBusiness?: string | null;
  IntegrationDesigntimeArtifacts?: ComSapHciApiIntegrationDesigntimeArtifact[];
}

/** IntegrationPackage (for create) */
export interface ComSapHciApiIntegrationPackageCreate {
  /** @example "string" */
  Id: string | null;
  Name?: string;
  /** @example "string" */
  Description?: string | null;
  ShortText?: string;
  /** @example "string" */
  Version?: string | null;
  /** @example "SAP Cloud Integration or SAP Process Orchestration or SuccessFactors Integration Center" */
  SupportedPlatform?: string | null;
  /** @example "string" */
  Products?: string | null;
  /** @example "string" */
  Keywords?: string | null;
  /** @example "string" */
  Countries?: string | null;
  /** @example "string" */
  Industries?: string | null;
  /** @example "string" */
  LineOfBusiness?: string | null;
}

/** IntegrationPackage (for update) */
export interface ComSapHciApiIntegrationPackageUpdate {
  Name?: string;
  /** @example "string" */
  Description?: string | null;
  ShortText?: string;
  /** @example "string" */
  Version?: string | null;
  /** @example "string" */
  Vendor?: string | null;
  /** @example "string" */
  Mode?: string | null;
  /** @example "SAP Cloud Integration or SAP Process Orchestration or SuccessFactors Integration Center" */
  SupportedPlatform?: string | null;
  /** @example "string" */
  Products?: string | null;
  /** @example "string" */
  Keywords?: string | null;
  /** @example "string" */
  Countries?: string | null;
  /** @example "string" */
  Industries?: string | null;
  /** @example "string" */
  LineOfBusiness?: string | null;
}

export interface ComSapHciApiSandboxError {
  code?: string;
  message?: string;
}

export interface OdataError {
  error: OdataErrorMain;
}

export interface OdataErrorMain {
  code: string;
  message: {
    lang: string;
    value: string;
  };
}

export interface OdataErrorDetail {
  code: string;
  message: string;
  target?: string;
}

/** Custom Tags (for update) */
export interface ComSapHciApiCustomTagsUpdate {
  /** @example "new value" */
  Value?: string;
}

/** ValueMappingDesigntimeArtifact */
export interface ComSapHciApiValueMappingDesigntimeArtifact {
  Id?: string;
  Version?: string;
  PackageId?: string;
  Name?: string;
  Description?: string;
  ArtifactContent?: string;
}

/** ValueMappingDesigntimeArtifact (for creation) */
export interface ComSapHciApiValueMappingDesigntimeArtifactCreate {
  Name?: string;
  Id?: string;
  PackageId?: string;
  Description?: string;
  /**
   * @format base64url
   * @example "integration flow zip content in base64-encoded format"
   */
  ArtifactContent?: string | null;
}

/** ValMapSchema */
export interface ComSapHciApiValMapSchema {
  SrcAgency?: string;
  SrcId?: string;
  TgtAgency?: string;
  TgtId?: string;
  State?: string | null;
  /** ValMaps */
  DefaultValMaps?: {
    results?: ComSapHciApiValMaps[];
  };
  /** ValMaps */
  ValMaps?: {
    results?: ComSapHciApiValMaps[];
  };
}

/** ValMaps */
export interface ComSapHciApiValMaps {
  Id?: string;
  /** Value */
  Value?: {
    results?: ComSapHciApiValue[];
  };
}

/** Value */
export interface ComSapHciApiValue {
  SrcValue?: string;
  TgtValue?: string;
}

/** IntegrationAdapterDesigntimeArtifact */
export interface ComSapHciApiIntegrationAdapterDesigntimeArtifact {
  Id?: string | null;
  Version?: string | null;
  PackageId?: string | null;
  Name?: string | null;
  /**
   * @format base64url
   * @example "integration adapter esa file content in base64-encoded format"
   */
  ArtifactContent?: string | null;
}

/** IntegrationAdapterDesigntimeArtifact (for import) */
export interface ComSapHciApiIntegrationAdapterDesigntimeArtifactImport {
  PackageId?: string;
  /**
   * @format base64url
   * @example "integration adapter esa file content in base64-encoded format"
   */
  ArtifactContent?: string | null;
}

/** MDIDeltaToken */
export interface ComSapHciApiMDIDeltaToken {
  d: {
    __metadata: {
      id: string;
      uri: string;
      type: string;
    };
    Operation: string;
    Entity: string;
    Version: string;
    DeltaToken: string;
    LastUpdateTimestamp: string;
  };
}

/** ScriptCollectionDesigntimeArtifact */
export interface ComSapHciApiScriptCollectionDesigntimeArtifact {
  Id?: string | null;
  Version?: string | null;
  PackageId?: string | null;
  Name?: string | null;
  Description?: string | null;
  /** @format base64url */
  ArtifactContent?: string | null;
  /** Collection of Resource */
  Resources?: {
    results?: ComSapHciApiResource[];
  };
}

/** ScriptCollectionDesigntimeArtifact (for creation) */
export interface ComSapHciApiScriptCollectionDesigntimeArtifactCreate {
  Name?: string;
  Id?: string;
  PackageId?: string;
  /**
   * @format base64url
   * @example "script collection zip content in base64-encoded format"
   */
  ArtifactContent?: string | null;
}

/** Script collection resource (for create) */
export interface ComSapHciApiScriptCollectionDesigntimeArtifactResourceCreate {
  /** @example "file name" */
  Name?: string;
  /** @example "groovy/jar/js/" */
  ResourceType?: string;
  /** @example "" */
  ReferencedResourceType?: string | null;
  /**
   * @format base64url
   * @example "resource in base64 encoded format"
   */
  ResourceContent?: string | null;
}

/** ScriptCollectionDesigntimeArtifact (for update) */
export interface ComSapHciApiScriptCollectionDesigntimeArtifactUpdate {
  Name?: string;
  /**
   * @format base64url
   * @example "script collection zip content in base64-encoded format"
   */
  ArtifactContent?: string | null;
}

/** ScriptCollectionDesigntimeArtifact (for update) */
export interface ComSapHciApiDesignGuidelineExecutionResultsSkip {
  GudelineId?: string;
  /** true = skip, false = revert */
  IsGuidelineSkipped?: boolean;
  SkipReason?: string;
}

/** DesignGuidlineExecutionResult */
export interface ComSapHciApiDesignGuidlineExecutionResult {
  ExecutionId?: string | null;
  ArtifactVersion?: string | null;
  ExecutionStatus?: string | null;
  ExecutionTime?: string | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://{Account Short Name}-tmn.{SSL Host}.{Landscapehost}/api/v1";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Integration Content
 * @version 1.0.0
 * @baseUrl https://{Account Short Name}-tmn.{SSL Host}.{Landscapehost}/api/v1
 * @externalDocs https://help.sap.com/docs/SAP_INTEGRATION_SUITE/51ab953548be4459bfe8539ecaeee98d/d1679a80543f46509a7329243b595bdb.html
 *
 * Integration content enables you to read, update, deploy, or undeploy integration artifacts (such as integration flows) on a tenant.
 * This API is implemented based on OData version 2 specification.
 *  If you like to request the OData API on your tenant, you need to know how to find out the address of the HTTP call. For more information, see [HTTP Calls and URL Components](https://help.sap.com/docs/SAP_INTEGRATION_SUITE/51ab953548be4459bfe8539ecaeee98d/ca75e12fc5904d96a038aef6c00db5fc.html).
 *  If you face problems using the API, you can create a ticket. Check out for the right support component on this page: [Support Components](https://help.sap.com/docs/SAP_INTEGRATION_SUITE/51ab953548be4459bfe8539ecaeee98d/bd2d883ae8ee4e2696038be7741d93d7.html).
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description You can use the following request to get the CSRF token for this session, which is required for write access via POST, PUT and DELETE operations. Copy the received X-CSRF-Token from the response header.<br> **In API sandbox this request is not relevant!**
   *
   * @tags CSRF Token Handling
   * @name GetRoot
   * @summary Get CSRF token.
   * @request GET:/
   * @secure
   */
  getRoot = (params: RequestParams = {}) =>
    this.request<void, OdataError>({
      path: `/`,
      method: "GET",
      secure: true,
      ...params,
    });

  copyIntegrationPackage = {
    /**
     * @description You can use the following request to copy an integration package from 'Discover' to 'Design' section. If the package already exists, either the existing package can be overwritten or a new package with a suffix for name and Id can be created. <br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to create an integration package.
     *
     * @tags Integration Package - Discover
     * @name CopyIntegrationPackageCreate
     * @summary Copy an integration package.
     * @request POST:/CopyIntegrationPackage
     * @secure
     */
    copyIntegrationPackageCreate: (
      query: {
        /**
         * Id of integration package - enclosed in single quotes <br>
         * Example: ```'ERPtoSuccessFactorsEmployeeCentralEmployeeandOrganizationalData'```.<br>
         * The Id can be found in the package URL.
         */
        Id: string;
        /**
         * If the package already exists, it can be overwritten by the copied package, or a new package could be created with a new suffix, which needs to be provided by query parameter 'Suffix'.<br>
         *  OVERWRITE_MERGE - With this mode, the package will be copied and overwritten to an existing/already copied package from Discover, would keep the configurations (of externalized parameters) intact for the existing/already copied package's artifacts.
         * @uniqueItems true
         */
        ImportMode?: ("'CREATE_COPY'" | "'OVERWRITE'" | "'OVERWRITE_MERGE'")[];
        /**
         * Suffix is required, if a package with the same name already exists and an additional copy of the same package should be created. The entered value must be enclosed in single quotes.<br>
         * Example: Entered Suffix ```'ABC'``` creates a new package, where ```.ABC``` is added to the name and to the artifacts Ids.<br>
         * Note: Only relevant for query parameter 'ImportMode' ```'CREATE_COPY'```.
         */
        Suffix?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiIntegrationPackage;
        },
        OdataError
      >({
        path: `/CopyIntegrationPackage`,
        method: "POST",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  integrationPackages = {
    /**
     * @description You can use the following request to get all integration packages.
     *
     * @tags Integration Packages - Design
     * @name IntegrationPackagesList
     * @summary Get all integration packages.
     * @request GET:/IntegrationPackages
     * @secure
     */
    integrationPackagesList: (
      query?: {
        /**
         * Custom Tag property defined in the tenant settings. You can provide multiple values.<br>
         * Example1: ```Author=Fred```
         * Example2: ```Author=Fred|John```
         */
        Author?: string;
        /**
         * Custom Tag property defined in the tenant settings. You can provide multiple values.<br>
         * Example1: ```LoB=Sales```
         * Example2: ```LoB=Sales|Marketing```
         */
        LoB?: string;
        /**
         * Show only the first n items.
         * @min 0
         */
        $top?: number;
        /**
         * Skip the first n items.
         * @min 0
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          value?: ComSapHciApiIntegrationPackage[];
        },
        OdataError
      >({
        path: `/IntegrationPackages`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to create/import an integration package.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to create integration package.
     *
     * @tags Integration Packages - Design
     * @name IntegrationPackagesCreate
     * @summary Create/Import new integration package.
     * @request POST:/IntegrationPackages
     * @secure
     */
    integrationPackagesCreate: (
      IntegrationPackage: ComSapHciApiIntegrationPackageCreate,
      query?: {
        /**
         * You can use the Overwrite parameter to overwrite an existing package.
         * @uniqueItems true
         */
        Overwrite?: ("true" | "false")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiIntegrationPackage, OdataError>({
        path: `/IntegrationPackages`,
        method: "POST",
        query: query,
        body: IntegrationPackage,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  integrationPackagesId = {
    /**
     * @description You can use the following request to get an integration packages by Id.
     *
     * @tags Integration Packages - Design
     * @name IntegrationPackagesList
     * @summary Get integration package by ID
     * @request GET:/IntegrationPackages('{Id}')
     * @secure
     */
    integrationPackagesList: (id: string, params: RequestParams = {}) =>
      this.request<ComSapHciApiIntegrationPackage, OdataError>({
        path: `/IntegrationPackages('${id}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update an existing integration package.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update integration package.
     *
     * @tags Integration Packages - Design
     * @name IntegrationPackagesUpdate
     * @summary Update integration package.
     * @request PUT:/IntegrationPackages('{Id}')
     * @secure
     */
    integrationPackagesUpdate: (
      id: string,
      IntegrationPackage: ComSapHciApiIntegrationPackageUpdate,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationPackages('${id}')`,
        method: "PUT",
        body: IntegrationPackage,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete an existing integration package.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete integration package.
     *
     * @tags Integration Packages - Design
     * @name IntegrationPackagesDelete
     * @summary Delete integration package.
     * @request DELETE:/IntegrationPackages('{Id}')
     * @secure
     */
    integrationPackagesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/IntegrationPackages('${id}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description You can use the following request to download an integration package of as .zip file. Download fails if the package contains one or more artifacts in draft state.
     *
     * @tags Integration Packages - Design
     * @name ValueList
     * @summary Download integration package by ID
     * @request GET:/IntegrationPackages('{Id}')/$value
     * @secure
     */
    valueList: (id: string, params: RequestParams = {}) =>
      this.request<File, OdataError>({
        path: `/IntegrationPackages('${id}')/$value`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get all integration flows of an integration package by package Id.
     *
     * @tags Integration Packages - Design
     * @name IntegrationDesigntimeArtifactsList
     * @summary Get all integration flows of a package.
     * @request GET:/IntegrationPackages('{Id}')/IntegrationDesigntimeArtifacts
     * @secure
     */
    integrationDesigntimeArtifactsList: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          value?: ComSapHciApiIntegrationDesigntimeArtifact[];
        },
        OdataError
      >({
        path: `/IntegrationPackages('${id}')/IntegrationDesigntimeArtifacts`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get an integration flow of an integration package by package Id, integration flow and integration flow version.
     *
     * @tags Integration Packages - Design
     * @name IntegrationDesigntimeArtifactsIdVersionList
     * @summary Get an integration flow of a package.
     * @request GET:/IntegrationPackages('{Id}')/IntegrationDesigntimeArtifacts(Id='{ArtifactId}',Version='{ArtifactVersion}')
     * @secure
     */
    integrationDesigntimeArtifactsIdVersionList: (
      id: string,
      artifactId: string,
      artifactVersion: string,
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiIntegrationDesigntimeArtifact, OdataError>({
        path: `/IntegrationPackages('${id}')/IntegrationDesigntimeArtifacts(Id='${artifactId}',Version='${artifactVersion}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get all message mappings of an integration package by package Id.
     *
     * @tags Integration Packages - Design
     * @name MessageMappingDesigntimeArtifactsList
     * @summary Get all message mappings of an integration package.
     * @request GET:/IntegrationPackages('{Id}')/MessageMappingDesigntimeArtifacts
     * @secure
     */
    messageMappingDesigntimeArtifactsList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "Version" | "PackageId" | "Name" | "Description" | "ArtifactContent")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          value?: ComSapHciApiMessageMappingDesigntimeArtifact[];
        },
        OdataError
      >({
        path: `/IntegrationPackages('${id}')/MessageMappingDesigntimeArtifacts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Use the following request to get a message mapping of an integration package by package Id, message mapping Id, and message mapping version.
     *
     * @tags Integration Packages - Design
     * @name MessageMappingDesigntimeArtifactsIdVersionList
     * @summary Get message mapping of an integration package.
     * @request GET:/IntegrationPackages('{Id}')/MessageMappingDesigntimeArtifacts(Id='{ArtifactId}',Version='{ArtifactVersion}')
     * @secure
     */
    messageMappingDesigntimeArtifactsIdVersionList: (
      id: string,
      artifactId: string,
      artifactVersion: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "Version" | "PackageId" | "Name" | "Description" | "ArtifactContent")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          value?: ComSapHciApiMessageMappingDesigntimeArtifact[];
        },
        OdataError
      >({
        path: `/IntegrationPackages('${id}')/MessageMappingDesigntimeArtifacts(Id='${artifactId}',Version='${artifactVersion}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get all value mappings of an integration package by package Id.
     *
     * @tags Integration Packages - Design
     * @name ValueMappingDesigntimeArtifactsList
     * @summary Get all value mappings of a package.
     * @request GET:/IntegrationPackages('{Id}')/ValueMappingDesigntimeArtifacts
     * @secure
     */
    valueMappingDesigntimeArtifactsList: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          value?: ComSapHciApiValueMappingDesigntimeArtifact[];
        },
        OdataError
      >({
        path: `/IntegrationPackages('${id}')/ValueMappingDesigntimeArtifacts`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get a value mapping of an integration package by package Id, valuen mapping and value mapping version.
     *
     * @tags Integration Packages - Design
     * @name ValueMappingDesigntimeArtifactsIdVersionList
     * @summary Get a value mapping of a package.
     * @request GET:/IntegrationPackages('{Id}')/ValueMappingDesigntimeArtifacts(Id='{ArtifactId}',Version='{ArtifactVersion}')
     * @secure
     */
    valueMappingDesigntimeArtifactsIdVersionList: (
      id: string,
      artifactId: string,
      artifactVersion: string,
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiValueMappingDesigntimeArtifact, OdataError>({
        path: `/IntegrationPackages('${id}')/ValueMappingDesigntimeArtifacts(Id='${artifactId}',Version='${artifactVersion}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get all script collections of an integration package by package Id.
     *
     * @tags Integration Packages - Design
     * @name ScriptCollectionDesigntimeArtifactsList
     * @summary Get all script collections of a package.
     * @request GET:/IntegrationPackages('{Id}')/ScriptCollectionDesigntimeArtifacts
     * @secure
     */
    scriptCollectionDesigntimeArtifactsList: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          value?: ComSapHciApiScriptCollectionDesigntimeArtifact[];
        },
        OdataError
      >({
        path: `/IntegrationPackages('${id}')/ScriptCollectionDesigntimeArtifacts`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get script collection of an integration package by package Id, script collection Id and script collection version.
     *
     * @tags Integration Packages - Design
     * @name ScriptCollectionDesigntimeArtifactsIdVersionList
     * @summary Get a script collection of a package.
     * @request GET:/IntegrationPackages('{Id}')/ScriptCollectionDesigntimeArtifacts(Id='{ScriptCollectionArtifactID}',Version='{ArtifactVersion}')
     * @secure
     */
    scriptCollectionDesigntimeArtifactsIdVersionList: (
      id: string,
      artifactId: string,
      artifactVersion: string,
      scriptCollectionArtifactId: string,
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiScriptCollectionDesigntimeArtifact, OdataError>({
        path: `/IntegrationPackages('${id}')/ScriptCollectionDesigntimeArtifacts(Id='${scriptCollectionArtifactId}',Version='${artifactVersion}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get custom tags of an integration package by package Id.
     *
     * @tags Integration Packages - Design
     * @name CustomTagsList
     * @summary Get Custom Tags of a package.
     * @request GET:/IntegrationPackages('{Id}')/CustomTags
     * @secure
     */
    customTagsList: (
      id: string,
      query?: {
        /**
         * Show only the first n items.
         * @min 0
         */
        $top?: number;
        /**
         * Skip the first n items.
         * @min 0
         */
        $skip?: number;
        /**
         * Order items by property values, see [Orderby System Query Option](https://www.odata.org/documentation/odata-version-2-0/uri-conventions/)
         * @uniqueItems true
         */
        $orderby?: ("Name" | "Name desc")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationPackages('${id}')/CustomTags`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update a Custom Tag.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required  permissions to update Custom Tags.
     *
     * @tags Integration Packages - Design
     * @name LinksCustomTagsUpdate
     * @summary Update a Custom Tag.
     * @request PUT:/IntegrationPackages('{Id}')/$links/CustomTags('{Name}')
     * @secure
     */
    linksCustomTagsUpdate: (
      id: string,
      name: string,
      Value: ComSapHciApiCustomTagsUpdate,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationPackages('${id}')/$links/CustomTags('${name}')`,
        method: "PUT",
        body: Value,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  customTagConfigurationsCustomTags = {
    /**
     * @description You can use the following request to get all custom tags.
     *
     * @tags Custom Tags Configuration
     * @name ValueList
     * @summary Get all custom tags.
     * @request GET:/CustomTagConfigurations('CustomTags')/$value
     * @secure
     */
    valueList: (params: RequestParams = {}) =>
      this.request<
        {
          value?: ComSapHciApiCustomTagsConfiguration[];
        },
        OdataError
      >({
        path: `/CustomTagConfigurations('CustomTags')/$value`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  customTagConfigurations = {
    /**
     * @description You can use the following request to create or upload custom tags configuration.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to create integration flows.
     *
     * @tags Custom Tags Configuration
     * @name CustomTagConfigurationsCreate
     * @summary Create/upload custom tags configuration.
     * @request POST:/CustomTagConfigurations
     * @secure
     */
    customTagConfigurationsCreate: (
      CustomTagConfiguration: ComSapHciApiCustomTagsConfigurationCreate,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/CustomTagConfigurations`,
        method: "POST",
        body: CustomTagConfiguration,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  integrationDesigntimeArtifacts = {
    /**
     * @description You can use the following request to create or upload an integration flow.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to create integration flows.
     *
     * @tags Integration Flow
     * @name IntegrationDesigntimeArtifactsCreate
     * @summary Create/upload an integration flow.
     * @request POST:/IntegrationDesigntimeArtifacts
     * @secure
     */
    integrationDesigntimeArtifactsCreate: (
      IntegrationFlow: ComSapHciApiIntegrationDesigntimeArtifactCreate,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiIntegrationDesigntimeArtifact;
        },
        OdataError
      >({
        path: `/IntegrationDesigntimeArtifacts`,
        method: "POST",
        body: IntegrationFlow,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  integrationDesigntimeArtifactsIdIdVersionVersion = {
    /**
     * @description You can use the following request to get an integration flow by Id and version.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, the following integration flows with Id and version are available: * '__IntegrationFlow_FAILED_DEPLOYMENT__' with version '__1.0.0__' * '__IntegrationFlow_MessageStore_COMPLETED_PROCESSING__' with version '__1.0.0__' * '__IntegrationFlow_AdapterData_FAILED_PROCESSING__' with version '__1.0.0__' * '__IntegrationFlowWithConfiguration__' with version '__1.0.5__'
     *
     * @tags Integration Flow
     * @name IntegrationDesigntimeArtifactsIdVersionList
     * @summary Get an integration flow by Id and version.
     * @request GET:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')
     * @secure
     */
    integrationDesigntimeArtifactsIdVersionList: (
      id: string,
      version: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Name" | "Version" | "PackageId")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiIntegrationDesigntimeArtifact;
        },
        OdataError
      >({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update an integration flow.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update integration flows.
     *
     * @tags Integration Flow
     * @name IntegrationDesigntimeArtifactsIdVersionUpdate
     * @summary Update an integration flow.
     * @request PUT:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')
     * @secure
     */
    integrationDesigntimeArtifactsIdVersionUpdate: (
      id: string,
      version: string,
      IntegrationDesigntimeArtifact: ComSapHciApiIntegrationDesigntimeArtifactUpdate,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')`,
        method: "PUT",
        body: IntegrationDesigntimeArtifact,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete an integration flow.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete integration flows.
     *
     * @tags Integration Flow
     * @name IntegrationDesigntimeArtifactsIdVersionDelete
     * @summary Delete an integration flow.
     * @request DELETE:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')
     * @secure
     */
    integrationDesigntimeArtifactsIdVersionDelete: (id: string, version: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to download an integration flow as zip file. Integration flows of configure-only packages cannot be downloaded.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox the following integration flows with Id and version are available: * '__IntegrationFlow_FAILED_DEPLOYMENT__' with version '__1.0.0__' * '__IntegrationFlow_MessageStore_COMPLETED_PROCESSING__' with version '__1.0.0__' * '__IntegrationFlow_AdapterData_FAILED_PROCESSING__' with version '__1.0.0__' * '__IntegrationFlowWithConfiguration__' with version '__1.0.5__'
     *
     * @tags Integration Flow
     * @name ValueList
     * @summary Download an integration flow as zip file.
     * @request GET:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/$value
     * @secure
     */
    valueList: (id: string, version: string, params: RequestParams = {}) =>
      this.request<File, OdataError>({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/$value`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to get the configuration parameters (key/value pairs) of an integration artifact by Id and version.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, the following integration flow contains configuration parameters: '__IntegrationFlowWithConfiguration__' with version '__1.0.5__'
     *
     * @tags Configurations of Integration Flow
     * @name ConfigurationsList
     * @summary Get configurations of an integration flow by Id and version.
     * @request GET:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/Configurations
     * @secure
     */
    configurationsList: (
      id: string,
      version: string,
      query?: {
        /**
         * Returns a subset of the entries, which matches the filter condition.<br>
         * Supported operators: ```eq``` and ```ne```<br>
         * Supported string functions: ```substringof```, ```startswith``` and ```endswith```.<br>
         * Example: ```substringof('Receiver_',ParameterKey) eq true```
         */
        $filter?: string;
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("ParameterKey" | "ParameterValue" | "DataType")[];
        /**
         * Order items by property values.
         * @uniqueItems true
         */
        $orderby?: ("ParameterKey" | "ParameterKey desc")[];
        /**
         * Response format can be JSON or XML.
         * @uniqueItems true
         * @default "json"
         */
        $format?: ("json" | "xml")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiConfiguration[];
          };
        },
        OdataError
      >({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/Configurations`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get the number of configuration parameters (key/value pairs) for an integration artifact by Id and version.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, the following integration flow contains configuration parameters: '__IntegrationFlowWithConfiguration__' with version '__1.0.5__'
     *
     * @tags Configurations of Integration Flow
     * @name ConfigurationsCountList
     * @summary Get number of configuration parameters.
     * @request GET:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/Configurations/$count
     * @secure
     */
    configurationsCountList: (
      id: string,
      version: string,
      query?: {
        /**
         * Returns a subset of the entries, which matches the filter condition.<br>
         * Supported operators: ```eq``` and ```ne```<br>
         * Supported string functions: ```substringof```, ```startswith``` and ```endswith```.<br>
         * Example: ```substringof('Receiver_',ParameterKey) eq true```
         */
        $filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/Configurations/$count`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to update the value for a configuration parameters of an integration flow.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions for integration flows.You need to configure an API endpoint for your account, where you have the required write permissions to update configuration parameters of an integration flow.
     *
     * @tags Configurations of Integration Flow
     * @name LinksConfigurationsUpdate
     * @summary Update configuration parameter of an integration flow.
     * @request PUT:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/$links/Configurations('{ParameterKey}')
     * @secure
     */
    linksConfigurationsUpdate: (
      id: string,
      version: string,
      parameterKey: string,
      ConfigurationParameter: ComSapHciApiConfigurationUpdate,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/$links/Configurations('${parameterKey}')`,
        method: "PUT",
        body: ConfigurationParameter,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to get all resources of an integration flow.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).
     *
     * @tags Resources of Integration Flow
     * @name ResourcesList
     * @summary Get all resources of an integration flow.
     * @request GET:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/Resources
     * @secure
     */
    resourcesList: (
      id: string,
      version: string,
      query?: {
        /**
         * Returns a subset of the entries, which matches the filter condition.<br>
         * Supported operators: ```eq``` and ```ne```<br>
         * Supported string functions: ```substringof```, ```startswith``` and ```endswith```.<br>
         * Example: ```substringof('wsdl',Name) eq true```
         */
        $filter?: string;
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Name" | "ResourceType" | "ReferencedResourceType")[];
        /**
         * Order items by property values.
         * @uniqueItems true
         */
        $orderby?: (
          | "Name"
          | "Name desc"
          | "ResourceType"
          | "ResourceType desc"
          | "Name,ResourceType"
          | "Name desc,ResourceType desc"
        )[];
        /**
         * Response format can be JSON or XML.
         * @uniqueItems true
         * @default "json"
         */
        $format?: ("json" | "xml")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Collection of Resource */
          d?: {
            results?: ComSapHciApiResource[];
          };
        },
        OdataError
      >({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/Resources`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add a resource to an integration flow.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update integration flows.
     *
     * @tags Resources of Integration Flow
     * @name ResourcesCreate
     * @summary Add a Resource to an integration flow.
     * @request POST:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/Resources
     * @secure
     */
    resourcesCreate: (id: string, version: string, Resource: ComSapHciApiResourceCreate, params: RequestParams = {}) =>
      this.request<
        {
          d?: ComSapHciApiResource;
        },
        OdataError
      >({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/Resources`,
        method: "POST",
        body: Resource,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get the number of all resources for an integration flow.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).
     *
     * @tags Resources of Integration Flow
     * @name ResourcesCountList
     * @summary Get number of resource.
     * @request GET:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/Resources/$count
     * @secure
     */
    resourcesCountList: (
      id: string,
      version: string,
      query?: {
        /**
         * Returns a subset of the entries, which matches the filter condition.<br>
         * Supported operators: ```eq``` and ```ne```<br>
         * Supported string functions: ```substringof```, ```startswith``` and ```endswith```.<br>
         * Example: ```substringof('wsdl',Name) eq true```
         */
        $filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/Resources/$count`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description You can use the following request to get a resource of an integration flow.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).
     *
     * @tags Resources of Integration Flow
     * @name ResourcesNameResourceTypeList
     * @summary Get a resource of an integration flow.
     * @request GET:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/Resources(Name='{Name}',ResourceType='{Type}')
     * @secure
     */
    resourcesNameResourceTypeList: (
      id: string,
      version: string,
      name: string,
      type: ("edmx" | "groovy" | "jar" | "js" | "mmap" | "opmap" | "wsdl" | "xsd" | "xslt")[],
      query?: {
        /**
         * Reference to another resource type (only for resource type 'xsd' the reference to 'wsdl' is allowed).
         * @uniqueItems true
         */
        ReferencedResourceType?: "wsdl"[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Name" | "ResourceType" | "ReferencedResourceType")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiResource;
        },
        OdataError
      >({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/Resources(Name='${name}',ResourceType='${type}')`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to download resource content of an integration flow. <br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).
     *
     * @tags Resources of Integration Flow
     * @name ResourcesNameResourceTypeValueList
     * @summary Download resource content of an integration flow.
     * @request GET:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/Resources(Name='{Name}',ResourceType='{Type}')/$value
     * @secure
     */
    resourcesNameResourceTypeValueList: (
      id: string,
      version: string,
      name: string,
      type: ("edmx" | "groovy" | "jar" | "js" | "mmap" | "opmap" | "wsdl" | "xsd" | "xslt")[],
      query?: {
        /**
         * Reference to another resource type (only for resource type 'xsd' the reference to 'wsdl' is allowed).
         * @uniqueItems true
         */
        ReferencedResourceType?: "wsdl"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/Resources(Name='${name}',ResourceType='${type}')/$value`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to update a resource of an integration flow.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update an integration flow.
     *
     * @tags Resources of Integration Flow
     * @name LinksResourcesNameResourceTypeUpdate
     * @summary Update a resource of an integration flow.
     * @request PUT:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/$links/Resources(Name='{Name}',ResourceType='{Type}')
     * @secure
     */
    linksResourcesNameResourceTypeUpdate: (
      id: string,
      version: string,
      name: string,
      type: ("edmx" | "groovy" | "jar" | "js" | "mmap" | "opmap" | "wsdl" | "xsd" | "xslt")[],
      Resource: ComSapHciApiResourceUpdate,
      query?: {
        /**
         * Reference to another resource type (only for resource type 'xsd' the reference to 'wsdl' is allowed).
         * @uniqueItems true
         */
        ReferencedResourceType?: "wsdl"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/$links/Resources(Name='${name}',ResourceType='${type}')`,
        method: "PUT",
        query: query,
        body: Resource,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete a resource of an integration flow.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update integration flows.
     *
     * @tags Resources of Integration Flow
     * @name LinksResourcesNameResourceTypeDelete
     * @summary Delete a resource of an integration flow.
     * @request DELETE:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/$links/Resources(Name='{Name}',ResourceType='{Type}')
     * @secure
     */
    linksResourcesNameResourceTypeDelete: (
      id: string,
      version: string,
      name: string,
      type: ("edmx" | "groovy" | "jar" | "js" | "mmap" | "opmap" | "wsdl" | "xsd" | "xslt")[],
      query?: {
        /**
         * Reference to another resource type (only for resource type 'xsd' the reference to 'wsdl' is allowed).
         * @uniqueItems true
         */
        ReferencedResourceType?: "wsdl"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/$links/Resources(Name='${name}',ResourceType='${type}')`,
        method: "DELETE",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to get the status of the guidelines execution.
     *
     * @tags Integration Flow - Design Guidelines
     * @name DesignGuidelineExecutionResultsList
     * @summary Get guidelines execution status.
     * @request GET:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/DesignGuidelineExecutionResults
     * @secure
     */
    designGuidelineExecutionResultsList: (id: string, version: string, params: RequestParams = {}) =>
      this.request<
        {
          value?: ComSapHciApiDesignGuidlineExecutionResult[];
        },
        OdataError
      >({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/DesignGuidelineExecutionResults`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get the results of the guidelines execution.
     *
     * @tags Integration Flow - Design Guidelines
     * @name DesignGuidelineExecutionResultsList2
     * @summary Get guidelines execution results.
     * @request GET:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/DesignGuidelineExecutionResults('{ExecutionId}')
     * @originalName designGuidelineExecutionResultsList
     * @duplicate
     * @secure
     */
    designGuidelineExecutionResultsList2: (
      id: string,
      version: string,
      executionId: string,
      query?: {
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: "DesignGuidelines"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          value?: ComSapHciApiDesignGuidlineExecutionResult[];
        },
        OdataError
      >({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/DesignGuidelineExecutionResults('${executionId}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get the report of the guidelines execution as a file.
     *
     * @tags Integration Flow - Design Guidelines
     * @name DesignGuidelineExecutionResultsValueList
     * @summary Download guidelines execution report.
     * @request GET:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/DesignGuidelineExecutionResults('{ExecutionId}')/$value
     * @secure
     */
    designGuidelineExecutionResultsValueList: (
      id: string,
      version: string,
      executionId: string,
      query?: {
        /** Type of the report file. */
        type?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, OdataError>({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/DesignGuidelineExecutionResults('${executionId}')/$value`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to revert or skip a guidline.
     *
     * @tags Integration Flow - Design Guidelines
     * @name LinksDesignGuidelineExecutionResultsUpdate
     * @summary Revert or skip a guideline.
     * @request PUT:/IntegrationDesigntimeArtifacts(Id='{Id}',Version='{Version}')/$links/DesignGuidelineExecutionResults('{ExecutionId}')
     * @secure
     */
    linksDesignGuidelineExecutionResultsUpdate: (
      id: string,
      version: string,
      executionId: string,
      SkipRevertGuideline: ComSapHciApiDesignGuidelineExecutionResultsSkip,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationDesigntimeArtifacts(Id='${id}',Version='${version}')/$links/DesignGuidelineExecutionResults('${executionId}')`,
        method: "PUT",
        body: SkipRevertGuideline,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  integrationDesigntimeArtifactSaveAsVersion = {
    /**
     * @description You can use the following request to update an artifact with new specified version.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update integration flows.
     *
     * @tags Integration Flow
     * @name IntegrationDesigntimeArtifactSaveAsVersionCreate
     * @summary Update an artifact with version.
     * @request POST:/IntegrationDesigntimeArtifactSaveAsVersion
     * @secure
     */
    integrationDesigntimeArtifactSaveAsVersionCreate: (
      query: {
        /**
         * Id of integration artifact <br>
         * Example: ```IntegrationFlowWithConfiguration```
         */
        Id: string;
        /**
         * New version of integration artifact <br>
         *  (e.g. ```1.0.5```).
         */
        SaveAsVersion: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationDesigntimeArtifactSaveAsVersion`,
        method: "POST",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  deployIntegrationDesigntimeArtifact = {
    /**
     * @description You can use the following request to deploy an integration flow.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to deploy integration flows.
     *
     * @tags Integration Flow
     * @name DeployIntegrationDesigntimeArtifactCreate
     * @summary Deploy an integration flow.
     * @request POST:/DeployIntegrationDesigntimeArtifact
     * @secure
     */
    deployIntegrationDesigntimeArtifactCreate: (
      query: {
        /**
         * Id of integration artifact - enclosed in single quotes <br>
         * Example: ```'IntegrationFlowWithConfiguration'```
         */
        Id: string;
        /**
         * Version of integration artifact - enclosed in single quotes  <br>
         * You can enter either ```'active'``` or the version name (e.g. ```'1.0.5'```) for retrieving the current version.
         * @default "'active'"
         */
        Version: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/DeployIntegrationDesigntimeArtifact`,
        method: "POST",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  messageMappingDesigntimeArtifacts = {
    /**
     * @description You can use the following request to get all message mappings deployed on the tenant.
     *
     * @tags Message Mappings
     * @name MessageMappingDesigntimeArtifactsList
     * @summary Get all message mappings.
     * @request GET:/MessageMappingDesigntimeArtifacts
     * @secure
     */
    messageMappingDesigntimeArtifactsList: (
      query?: {
        /**
         * Show only the first n items.
         * @min 0
         */
        $top?: number;
        /**
         * Skip the first n items.
         * @min 0
         */
        $skip?: number;
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "Version" | "PackageId" | "Name" | "Description" | "ArtifactContent")[];
        /**
         * Order items by property values, see [Orderby System Query Option](https://www.odata.org/documentation/odata-version-2-0/uri-conventions/). Default order: by 'Name' ascending
         * @uniqueItems true
         */
        $orderby?: ("Name" | "Name desc")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          value?: ComSapHciApiMessageMappingDesigntimeArtifact[];
        },
        OdataError
      >({
        path: `/MessageMappingDesigntimeArtifacts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to create/upload a message mapping. In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to upload message mappings.
     *
     * @tags Message Mappings
     * @name MessageMappingDesigntimeArtifactsCreate
     * @summary Create/Upload a message mapping.
     * @request POST:/MessageMappingDesigntimeArtifacts
     * @secure
     */
    messageMappingDesigntimeArtifactsCreate: (
      MessageMapping: ComSapHciApiValueMappingDesigntimeArtifactCreate,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiMessageMappingDesigntimeArtifactCreate;
        },
        OdataError
      >({
        path: `/MessageMappingDesigntimeArtifacts`,
        method: "POST",
        body: MessageMapping,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  messageMappingDesigntimeArtifactsIdIdVersionVersion = {
    /**
     * @description You can use the following request to get a deployed message mapping deployed by Id and version.
     *
     * @tags Message Mappings
     * @name MessageMappingDesigntimeArtifactsIdVersionList
     * @summary Get message mapping by Id and version.
     * @request GET:/MessageMappingDesigntimeArtifacts(Id='{Id}',Version='{Version}')
     * @secure
     */
    messageMappingDesigntimeArtifactsIdVersionList: (
      id: string,
      version: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Name" | "Version" | "PackageId")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiMessageMappingDesigntimeArtifact;
        },
        OdataError
      >({
        path: `/MessageMappingDesigntimeArtifacts(Id='${id}',Version='${version}')`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update a message mapping.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update message mappings.
     *
     * @tags Message Mappings
     * @name MessageMappingDesigntimeArtifactsIdVersionUpdate
     * @summary Update a message mapping.
     * @request PUT:/MessageMappingDesigntimeArtifacts(Id='{Id}',Version='{Version}')
     * @secure
     */
    messageMappingDesigntimeArtifactsIdVersionUpdate: (
      id: string,
      version: string,
      MessageMappingDesigntimeArtifact: ComSapHciApiMessageMappingDesigntimeArtifactUpdate,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/MessageMappingDesigntimeArtifacts(Id='${id}',Version='${version}')`,
        method: "PUT",
        body: MessageMappingDesigntimeArtifact,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete a message mapping.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete integration flows.
     *
     * @tags Message Mappings
     * @name MessageMappingDesigntimeArtifactsIdVersionDelete
     * @summary Delete a message mapping.
     * @request DELETE:/MessageMappingDesigntimeArtifacts(Id='{Id}',Version='{Version}')
     * @secure
     */
    messageMappingDesigntimeArtifactsIdVersionDelete: (id: string, version: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/MessageMappingDesigntimeArtifacts(Id='${id}',Version='${version}')`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to download a message mapping as zip file. Message mappings of configure-only packages cannot be downloaded<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br>
     *
     * @tags Message Mappings
     * @name ValueList
     * @summary Download a message mapping as zip file.
     * @request GET:/MessageMappingDesigntimeArtifacts(Id='{Id}',Version='{Version}')/$value
     * @secure
     */
    valueList: (id: string, version: string, params: RequestParams = {}) =>
      this.request<File, OdataError>({
        path: `/MessageMappingDesigntimeArtifacts(Id='${id}',Version='${version}')/$value`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  deployMessageMappingDesigntimeArtifact = {
    /**
     * @description You can use the following request to deploy a message mapping.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to deploy message mappings.
     *
     * @tags Message Mappings
     * @name DeployMessageMappingDesigntimeArtifactCreate
     * @summary Deploy a message mapping.
     * @request POST:/DeployMessageMappingDesigntimeArtifact
     * @secure
     */
    deployMessageMappingDesigntimeArtifactCreate: (
      query: {
        /** Id of message mapping - enclosed in single quotes <br> */
        Id: string;
        /**
         * Version of message mapping - enclosed in single quotes  <br>
         * You can enter either ```'active'``` or the version name (e.g. ```'1.0.5'```) for retrieving the current version.
         * @default "'active'"
         */
        Version: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/DeployMessageMappingDesigntimeArtifact`,
        method: "POST",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  messageMappingDesigntimeArtifactSaveAsVersion = {
    /**
     * @description You can use the following request to update an artifact with new specified version.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update message mappings flows.
     *
     * @tags Message Mappings
     * @name MessageMappingDesigntimeArtifactSaveAsVersionCreate
     * @summary Update an artifact with version.
     * @request POST:/MessageMappingDesigntimeArtifactSaveAsVersion
     * @secure
     */
    messageMappingDesigntimeArtifactSaveAsVersionCreate: (
      query: {
        /** Id of message mapping <br> */
        Id: string;
        /**
         * New version of message mapping <br>
         *  (e.g. ```1.0.5```).
         */
        SaveAsVersion: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/MessageMappingDesigntimeArtifactSaveAsVersion`,
        method: "POST",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  buildAndDeployStatusTaskIdTaskId = {
    /**
     * @description You can use the following request to get the [Build and Deploy Status](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d8934e0d3ab649ecb5ae744663c7962c.html) of an artifact by task Id. For an example scenario that shows you how to use this request in a sequence with other API calls, refer to the SAP Help Portal documentation [Get Runtime Status of Deployed Integration Flow](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/49c733687c80415aa5b67d58cda99dbf.html).
     *
     * @tags Build and Deploy Status
     * @name BuildAndDeployStatusTaskIdList
     * @summary Get build and deploy status for task Id.
     * @request GET:/BuildAndDeployStatus(TaskId='{taskId}')
     * @secure
     */
    buildAndDeployStatusTaskIdList: (taskId: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: ComSapHciApiBuildAndDeployStatus;
        },
        OdataError
      >({
        path: `/BuildAndDeployStatus(TaskId='${taskId}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  integrationRuntimeArtifacts = {
    /**
     * @description You can use the following request to get all deployed integration artifacts.<br> In API sandbox the following integration flows are deployed:<br> * '__Integration Flow - FAILED DEPLOYMENT__' with deployment error information * '__Integration Flow with MessageStore - COMPLETED PROCESSING__' with attachments and message store entries * '__Integration Flow with Adapter Data - FAILED PROCESSING__' with message processing log error information, attachments, custom header properties and adapater data
     *
     * @tags Runtime Artifacts
     * @name IntegrationRuntimeArtifactsList
     * @summary Get all deployed integration artifacts.
     * @request GET:/IntegrationRuntimeArtifacts
     * @secure
     */
    integrationRuntimeArtifactsList: (
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "Version" | "Name" | "Type" | "DeployedBy" | "DeployedOn" | "Status")[];
        /**
         * Filter items by property values (not possible for DeployedOn). No nesting possible. Only logical operator ```or``` is allowed. <br>
         * Example1: ```Status eq 'ERROR'``` returns all deployed integration artifacts in status 'ERROR'.<br>
         * Example2: ```Status eq 'ERROR' or Version eq '1.0.0'```
         */
        $filter?: string;
        /**
         * Show only the first n items.
         * @min 0
         */
        $top?: number;
        /**
         * Skip the first n items.
         * @min 0
         */
        $skip?: number;
        /**
         * Count the number of retrieved entries by selecting ```allpages```.
         * @uniqueItems true
         */
        $inlinecount?: "allpages"[];
        /**
         * Order items by property values, see [Orderby System Query Option](https://www.odata.org/documentation/odata-version-2-0/uri-conventions/)
         * @uniqueItems true
         */
        $orderby?: (
          | "Id"
          | "Id desc"
          | "Version"
          | "Version desc"
          | "Name"
          | "Name desc"
          | "Type"
          | "Type desc"
          | "DeployedBy"
          | "DeployedBy desc"
          | "DeployedOn"
          | "DeployedOn desc"
          | "Status"
          | "Status desc"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiIntegrationRuntimeArtifact[];
          };
        },
        OdataError
      >({
        path: `/IntegrationRuntimeArtifacts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description __This method is NOT SUPPORTED in CF__. Please use DeployIntegrationDesigntimeArtifact API in the Integration Flow section!
     *
     * @tags Runtime Artifacts
     * @name IntegrationRuntimeArtifactsCreate
     * @summary Deploy an integration artifact.
     * @request POST:/IntegrationRuntimeArtifacts
     * @secure
     */
    integrationRuntimeArtifactsCreate: (
      IntegrationRuntimeArtifact: ComSapHciApiIntegrationRuntimeArtifactPlaceholder,
      params: RequestParams = {},
    ) =>
      this.request<void, void | OdataError>({
        path: `/IntegrationRuntimeArtifacts`,
        method: "POST",
        body: IntegrationRuntimeArtifact,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to get the number of all deployed integration artifacts.
     *
     * @tags Runtime Artifacts
     * @name CountList
     * @summary Get number of deployed integration artifacts.
     * @request GET:/IntegrationRuntimeArtifacts/$count
     * @secure
     */
    countList: (
      query?: {
        /**
         * Filter the returned count by property values (not possible for DeployedOn). No nesting possible. Only logical operator ```or``` is allowed. <br>
         * Example1: ```Status eq 'ERROR'``` returns all deployed integration artifacts in status 'ERROR'.<br>
         * Example2: ```Status eq 'ERROR' or Version eq '1.0.0'```
         */
        $filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IntegrationRuntimeArtifacts/$count`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
  integrationRuntimeArtifactsId = {
    /**
     * @description You can use the following request to get a deployed integration artifact by Id.<br> In API sandbox integration flows with following Ids are deployed: * '__IntegrationFlow_FAILED_DEPLOYMENT__' with deployment error information * '__IntegrationFlow_MessageStore_COMPLETED_PROCESSING__' with attachments and message store entries * '__IntegrationFlow_AdapterData_FAILED_PROCESSING__' with message processing log error information, attachments, custom header properties and adapter data
     *
     * @tags Runtime Artifacts
     * @name IntegrationRuntimeArtifactsList
     * @summary Get a deployed integration artifact by Id.
     * @request GET:/IntegrationRuntimeArtifacts('{Id}')
     * @secure
     */
    integrationRuntimeArtifactsList: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: ComSapHciApiIntegrationRuntimeArtifact;
        },
        OdataError
      >({
        path: `/IntegrationRuntimeArtifacts('${id}')`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to undeploy an integration artifact.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to undeploy an integration artifact.
     *
     * @tags Runtime Artifacts
     * @name IntegrationRuntimeArtifactsDelete
     * @summary Undeploy an integration artifacts.
     * @request DELETE:/IntegrationRuntimeArtifacts('{Id}')
     * @secure
     */
    integrationRuntimeArtifactsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, OdataError | void>({
        path: `/IntegrationRuntimeArtifacts('${id}')`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to get error information of a deployed integration artifact by Id.<br> In API sandbox, only the deployed integration flow with Id '__IntegrationFlow_FAILED_DEPLOYMENT__' provides the required error information.
     *
     * @tags Error Information of Runtime Artifact
     * @name ErrorInformationValueList
     * @summary Get error information of a deployed integration artifact.
     * @request GET:/IntegrationRuntimeArtifacts('{Id}')/ErrorInformation/$value
     * @secure
     */
    errorInformationValueList: (id: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/IntegrationRuntimeArtifacts('${id}')/ErrorInformation/$value`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  serviceEndpoints = {
    /**
     * @description You can use the following request to get all endpoints provided for deployed integration flows.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [SAP Cloud Integration - OData API for accessing the service endpoints](https://blogs.sap.com/2019/03/25/sap-cloud-platform-integration-odata-api-for-accessing-the-service-endpoints/).
     *
     * @tags Endpoints of Runtime Artifacts
     * @name ServiceEndpointsList
     * @summary Get endpoints of integration flows.
     * @request GET:/ServiceEndpoints
     * @secure
     */
    serviceEndpointsList: (
      query?: {
        /**
         * Show only the first n items.
         * @min 0
         */
        $top?: number;
        /**
         * Skip the first n items.
         * @min 0
         */
        $skip?: number;
        /**
         * Returns a subset of the entries, which matches the filter condition.<br>
         * Example: ```Name eq 'IntegrationFlowWithConfiguration'``` provides all endpoints of the deployed integration flow with the ID IntegrationFlowWithConfiguration.<br>
         * Example: ```Protocol eq 'SOAP'``` provides all endpoints of the deployed integration flows with SOAP protocol type.
         */
        $filter?: string;
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Name"
          | "Id"
          | "Title"
          | "Version"
          | "Summary"
          | "Description"
          | "LastUpdated"
          | "Protocol"
          | "EntryPoints"
          | "ApiDefinitions"
        )[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: ("EntryPoints" | "ApiDefinitions")[];
        /**
         * Count the number of retrieved entries by selecting ```allpages```.
         * @uniqueItems true
         */
        $inlinecount?: "allpages"[];
        /**
         * Response format can be JSON or XML.
         * @uniqueItems true
         * @default "json"
         */
        $format?: ("json" | "xml")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          value?: ComSapHciApiServiceEndpoint[];
        },
        OdataError
      >({
        path: `/ServiceEndpoints`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get the number of all endpoints provided for deployed integration flows.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [SAP Cloud Integration - OData API for accessing the service endpoints](https://blogs.sap.com/2019/03/25/sap-cloud-platform-integration-odata-api-for-accessing-the-service-endpoints/).
     *
     * @tags Endpoints of Runtime Artifacts
     * @name CountList
     * @summary Get number of endpoints.
     * @request GET:/ServiceEndpoints/$count
     * @secure
     */
    countList: (
      query?: {
        /**
         * Returns a subset of the entries, which matches the filter condition.<br>
         * Example: ```Name eq 'IntegrationFlowWithConfiguration'``` provides all endpoints of the deployed integration flow with the ID IntegrationFlowWithConfiguration.<br>
         * Example: ```Protocol eq 'SOAP'``` provides all endpoints of the deployed integration flows with SOAP protocol type.
         */
        $filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/ServiceEndpoints/$count`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
  valueMappingDesigntimeArtifacts = {
    /**
     * @description You can use the following request to get all Value Mappings in the tenant.
     *
     * @tags Value Mappings
     * @name ValueMappingDesigntimeArtifactsList
     * @summary Get all value mappings.
     * @request GET:/ValueMappingDesigntimeArtifacts
     * @secure
     */
    valueMappingDesigntimeArtifactsList: (
      query?: {
        /**
         * Show only the first n items.
         * @min 0
         */
        $top?: number;
        /**
         * Skip the first n items.
         * @min 0
         */
        $skip?: number;
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "Version" | "PackageId" | "Name" | "Description" | "ArtifactContent")[];
        /**
         * Order items by property values, see [Orderby System Query Option](https://www.odata.org/documentation/odata-version-2-0/uri-conventions/). Default order: by 'Name' ascending
         * @uniqueItems true
         */
        $orderby?: ("Name" | "Name desc")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          value?: ComSapHciApiValueMappingDesigntimeArtifact[];
        },
        OdataError
      >({
        path: `/ValueMappingDesigntimeArtifacts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to upload a value mapping. In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to upload value mappings.
     *
     * @tags Value Mappings
     * @name ValueMappingDesigntimeArtifactsCreate
     * @summary Upload a value mapping.
     * @request POST:/ValueMappingDesigntimeArtifacts
     * @secure
     */
    valueMappingDesigntimeArtifactsCreate: (
      ValueMapping: ComSapHciApiValueMappingDesigntimeArtifactCreate,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiValueMappingDesigntimeArtifact;
        },
        OdataError
      >({
        path: `/ValueMappingDesigntimeArtifacts`,
        method: "POST",
        body: ValueMapping,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  valueMappingDesigntimeArtifactsIdIdVersionVersion = {
    /**
     * @description You can use the following request to get a specific Value Mapping in the tenant.
     *
     * @tags Value Mappings
     * @name ValueMappingDesigntimeArtifactsIdVersionList
     * @summary Get specific Value Mapping.
     * @request GET:/ValueMappingDesigntimeArtifacts(Id='{Id}',Version='{Version}')
     * @secure
     */
    valueMappingDesigntimeArtifactsIdVersionList: (id: string, version: string, params: RequestParams = {}) =>
      this.request<
        {
          value?: ComSapHciApiValueMappingDesigntimeArtifact[];
        },
        OdataError
      >({
        path: `/ValueMappingDesigntimeArtifacts(Id='${id}',Version='${version}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to delete a value mapping.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete value mapppings.
     *
     * @tags Value Mappings
     * @name ValueMappingDesigntimeArtifactsIdVersionDelete
     * @summary Delete a value mapping artifact.
     * @request DELETE:/ValueMappingDesigntimeArtifacts(Id='{Id}',Version='{Version}')
     * @secure
     */
    valueMappingDesigntimeArtifactsIdVersionDelete: (id: string, version: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/ValueMappingDesigntimeArtifacts(Id='${id}',Version='${version}')`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to download a value mapping as zip file. Value mappings of configure-only packages cannot be downloaded. In API sandbox, the following integration flows with Id and version are available: * '__IntegrationFlow_FAILED_DEPLOYMENT__' with version '__1.0.0__' * '__IntegrationFlow_MessageStore_COMPLETED_PROCESSING__' with version '__1.0.0__' * '__IntegrationFlow_AdapterData_FAILED_PROCESSING__' with version '__1.0.0__' * '__IntegrationFlowWithConfiguration__' with version '__1.0.5__'
     *
     * @tags Value Mappings
     * @name ValueList
     * @summary Download an integration flow as zip file.
     * @request GET:/ValueMappingDesigntimeArtifacts(Id='{Id}',Version='{Version}')/$value
     * @secure
     */
    valueList: (id: string, version: string, params: RequestParams = {}) =>
      this.request<File, OdataError>({
        path: `/ValueMappingDesigntimeArtifacts(Id='${id}',Version='${version}')/$value`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to get all bidirectional agency identifiers in the Value Mapping.
     *
     * @tags Value Mappings
     * @name ValMapSchemaList
     * @summary Get all value mapping agency identifiers.
     * @request GET:/ValueMappingDesigntimeArtifacts(Id='{Id}',Version='{Version}')/ValMapSchema
     * @secure
     */
    valMapSchemaList: (
      id: string,
      version: string,
      query?: {
        /**
         * Returns a subset of the entries, which matches the filter condition. The only supported expression is:.<br>
         * ```State eq 'Configured'```<br>
         *  It provides all the bidirectional agency identifiers that are in configured state.
         */
        $filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          value?: ComSapHciApiValMapSchema[];
        },
        OdataError
      >({
        path: `/ValueMappingDesigntimeArtifacts(Id='${id}',Version='${version}')/ValMapSchema`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get all the value mappings for a specific bidirectional agency identifier.
     *
     * @tags Value Mappings
     * @name ValMapSchemaSrcAgencySrcIdTgtAgencyTgtIdValMapsList
     * @summary Get all value mappings for specific agency identifiers.
     * @request GET:/ValueMappingDesigntimeArtifacts(Id='{Id}',Version='{Version}')/ValMapSchema(SrcAgency='{SrcAgency}',SrcId='{SrcId}',TgtAgency='{TgtAgency}',TgtId='{TgtId}')/ValMaps
     * @secure
     */
    valMapSchemaSrcAgencySrcIdTgtAgencyTgtIdValMapsList: (
      id: string,
      version: string,
      srcAgency: string,
      srcId: string,
      tgtAgency: string,
      tgtId: string,
      query?: {
        /**
         * Returns a subset of the entries, which matches the filter condition.<br>
         * Example: ```Value/SrcValue eq 'SourceValue' and Value/TgtValue eq 'TargetValue'``` provides all the value mappings based on the source and target value for a specific bidirectional agency identifier.
         */
        $filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          value?: ComSapHciApiValMaps[];
        },
        OdataError
      >({
        path: `/ValueMappingDesigntimeArtifacts(Id='${id}',Version='${version}')/ValMapSchema(SrcAgency='${srcAgency}',SrcId='${srcId}',TgtAgency='${tgtAgency}',TgtId='${tgtId}')/ValMaps`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get all the default value mappings for a specific bidirectional agency identifier.
     *
     * @tags Value Mappings
     * @name ValMapSchemaSrcAgencySrcIdTgtAgencyTgtIdDefaultValMapsList
     * @summary Get all default value mappings for specific agency identifiers.
     * @request GET:/ValueMappingDesigntimeArtifacts(Id='{Id}',Version='{Version}')/ValMapSchema(SrcAgency='{SrcAgency}',SrcId='{SrcId}',TgtAgency='{TgtAgency}',TgtId='{TgtId}')/DefaultValMaps
     * @secure
     */
    valMapSchemaSrcAgencySrcIdTgtAgencyTgtIdDefaultValMapsList: (
      id: string,
      version: string,
      srcAgency: string,
      srcId: string,
      tgtAgency: string,
      tgtId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          value?: ComSapHciApiValMaps[];
        },
        OdataError
      >({
        path: `/ValueMappingDesigntimeArtifacts(Id='${id}',Version='${version}')/ValMapSchema(SrcAgency='${srcAgency}',SrcId='${srcId}',TgtAgency='${tgtAgency}',TgtId='${tgtId}')/DefaultValMaps`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  deployValueMappingDesigntimeArtifact = {
    /**
     * @description You can use the following request to deploy a value mapping.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to deploy value mappings.
     *
     * @tags Value Mappings
     * @name DeployValueMappingDesigntimeArtifactCreate
     * @summary Deploy a value mapping.
     * @request POST:/DeployValueMappingDesigntimeArtifact
     * @secure
     */
    deployValueMappingDesigntimeArtifactCreate: (
      query: {
        /**
         * Id of value mapping artifact - enclosed in single quotes <br>
         * Example: ```'ValueMapping1'```
         */
        Id: string;
        /**
         * Version of value mapping artifact - enclosed in single quotes  <br>
         * You can enter either ```'active'``` or the version name (e.g. ```'1.0.5'```) for retrieving the current version.
         * @default "'active'"
         */
        Version: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/DeployValueMappingDesigntimeArtifact`,
        method: "POST",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  valueMappingDesigntimeArtifactSaveAsVersion = {
    /**
     * @description You can use the following request to update an artifact with new specified version.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update value mappings.
     *
     * @tags Value Mappings
     * @name ValueMappingDesigntimeArtifactSaveAsVersionCreate
     * @summary Update an artifact with version.
     * @request POST:/ValueMappingDesigntimeArtifactSaveAsVersion
     * @secure
     */
    valueMappingDesigntimeArtifactSaveAsVersionCreate: (
      query: {
        /**
         * Id of value mapping artifact <br>
         * Example: ```ValueMapping1```
         */
        Id: string;
        /**
         * New version of value mapping artifact <br>
         *  (e.g. ```1.0.5```).
         */
        SaveAsVersion: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/ValueMappingDesigntimeArtifactSaveAsVersion`,
        method: "POST",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  upsertValMaps = {
    /**
     * @description You can use the following request to create a value mapping using function import UpsertValMaps.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to create value mappings.
     *
     * @tags Value Mappings
     * @name UpsertValMapsCreate
     * @summary Create new value mapping.
     * @request POST:/UpsertValMaps
     * @secure
     */
    upsertValMapsCreate: (
      query: {
        /**
         * Id of value mappping artifact.<br>
         * Example: ```'ValueMapping1'```.<br>
         */
        Id: string;
        /**
         * Version of the value mapping artifact.<br>
         * Example: ```'active'```.<br>
         */
        Version: string;
        /**
         * Source Agency.<br>
         * Example: ```'SourceAgency'```.<br>
         */
        SrcAgency: string;
        /**
         * Source Id.<br>
         * Example: ```'123'```.<br>
         */
        SrcId: string;
        /**
         * Target Agency.<br>
         * Example: ```'TargetAgency'```.<br>
         */
        TgtAgency: string;
        /**
         * Target Id.<br>
         * Example: ```'456'```.<br>
         */
        TgtId: string;
        /**
         * Source Value.<br>
         * Example: ```'John'```.<br>
         */
        SrcValue: string;
        /**
         * Target Value.<br>
         * Example: ```'Jan'```.<br>
         */
        TgtValue: string;
        /** Boolean value: true or false */
        IsConfigured: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/UpsertValMaps`,
        method: "POST",
        query: query,
        secure: true,
        ...params,
      }),
  };
  updateDefaultValMap = {
    /**
     * @description You can use the following request to update a default value mapping in the value mapping artifact.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to create value mappings.
     *
     * @tags Value Mappings
     * @name UpdateDefaultValMapCreate
     * @summary Update default value mapping in value mapping artifact.
     * @request POST:/UpdateDefaultValMap
     * @secure
     */
    updateDefaultValMapCreate: (
      query: {
        /**
         * Id of value mappping artifact.<br>
         * Example: ```'ValueMapping1'```.<br>
         */
        Id: string;
        /**
         * Version of the value mapping artifact.<br>
         * Example: ```'active'```.<br>
         */
        Version: string;
        /**
         * Source Agency.<br>
         * Example: ```'SourceAgency'```.<br>
         */
        SrcAgency: string;
        /**
         * Source Id.<br>
         * Example: ```'123'```.<br>
         */
        SrcId: string;
        /**
         * Target Agency.<br>
         * Example: ```'TargetAgency'```.<br>
         */
        TgtAgency: string;
        /**
         * Target Id.<br>
         * Example: ```'456'```.<br>
         */
        TgtId: string;
        /** Boolean value: true or false */
        IsConfigured: string;
        /** Value Mapping Id */
        ValMapId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/UpdateDefaultValMap`,
        method: "POST",
        query: query,
        secure: true,
        ...params,
      }),
  };
  deleteValMaps = {
    /**
     * @description You can use the following request to delete a code list mapping along with all of its related code value mappings using function import DeleteValMaps.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to create value mappings.
     *
     * @tags Value Mappings
     * @name DeleteValMapsCreate
     * @summary Delete a Value Mapping CLM.
     * @request POST:/DeleteValMaps
     * @secure
     */
    deleteValMapsCreate: (
      query: {
        /**
         * Id of value mappping artifact.<br>
         * Example: ```'ValueMapping1'```.<br>
         */
        Id: string;
        /**
         * Version of the value mapping artifact.<br>
         * Example: ```'active'```.<br>
         */
        Version: string;
        /**
         * Source Agency.<br>
         * Example: ```'SourceAgency'```.<br>
         */
        SrcAgency: string;
        /**
         * Source Id.<br>
         * Example: ```'123'```.<br>
         */
        SrcId: string;
        /**
         * Target Agency.<br>
         * Example: ```'TargetAgency'```.<br>
         */
        TgtAgency: string;
        /**
         * Target Id.<br>
         * Example: ```'456'```.<br>
         */
        TgtId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/DeleteValMaps`,
        method: "POST",
        query: query,
        secure: true,
        ...params,
      }),
  };
  integrationAdapterDesigntimeArtifacts = {
    /**
     * @description You can use the following request to import an integration adapter artifact.<br> This API is available only in the Cloud Foundry environment. <br>For more information, see SAP Help Portal documentation at [Environment-Specific Aspects Integration Developers Should Know](https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/639a0612e32c498fa7480580d90c9ea6.html?locale=en-US).<br>In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to import adapters.
     *
     * @tags Integration Adapter
     * @name IntegrationAdapterDesigntimeArtifactsCreate
     * @summary Import integration adapter artifact.
     * @request POST:/IntegrationAdapterDesigntimeArtifacts
     * @secure
     */
    integrationAdapterDesigntimeArtifactsCreate: (
      IntegrationAdapter: ComSapHciApiIntegrationAdapterDesigntimeArtifactImport,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiIntegrationAdapterDesigntimeArtifact;
        },
        OdataError
      >({
        path: `/IntegrationAdapterDesigntimeArtifacts`,
        method: "POST",
        body: IntegrationAdapter,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  deployIntegrationAdapterDesigntimeArtifact = {
    /**
     * @description You can use the following request to deploy an integration adapter.<br> This API is available only in Cloud Foundry environment. In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to deploy integration adapter.
     *
     * @tags Integration Adapter
     * @name DeployIntegrationAdapterDesigntimeArtifactCreate
     * @summary Deploy an integration adapter.
     * @request POST:/DeployIntegrationAdapterDesigntimeArtifact
     * @secure
     */
    deployIntegrationAdapterDesigntimeArtifactCreate: (
      query: {
        /**
         * Id of integration adapter artifact - enclosed in single quotes <br>
         * Example: ```'IntegrationAdapterId'```
         */
        Id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/DeployIntegrationAdapterDesigntimeArtifact`,
        method: "POST",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  integrationAdapterDesigntimeArtifactsIdId = {
    /**
     * @description You can use the following request to delete an integration adapter. <br> This API is available only in Cloud Foundry environment. In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete integration adapter.
     *
     * @tags Integration Adapter
     * @name IntegrationAdapterDesigntimeArtifactsIdDelete
     * @summary Delete an integration adapter.
     * @request DELETE:/IntegrationAdapterDesigntimeArtifacts(Id='{Id}')
     * @secure
     */
    integrationAdapterDesigntimeArtifactsIdDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/IntegrationAdapterDesigntimeArtifacts(Id='${id}')`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  mdiDeltaTokenOperationOperationEntityEntityVersionVersion = {
    /**
     * @description You can use the following request to get the delta token for the SAP Master Data Integration receiver adapter (MDI receiver adapter). This feature is only available with SAP Integration Suite. For more information on the MDI adapter, see SAP Help Portal documentation at [SAP Master Data Integration Receiver Adapter]( https://help.sap.com/docs/integration-suite/sap-integration-suite/e91e373bbb5b49ccbc2977152def61a2.html).
     *
     * @tags MDI Delta Token
     * @name MdiDeltaTokenOperationEntityVersionList
     * @summary Perform Read operation on MDI delta token database.
     * @request GET:/MDIDeltaToken(Operation='{Operation}',Entity='{Entity}',Version='{Version}')
     * @secure
     */
    mdiDeltaTokenOperationEntityVersionList: (
      operation: string,
      entity: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiMDIDeltaToken;
        },
        OdataError
      >({
        path: `/MDIDeltaToken(Operation='${operation}',Entity='${entity}',Version='${version}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to delete the delta token for the SAP Master Data Integration receiver adapter (MDI receiver adapter). This feature is only available with SAP Integration Suite. For more information on the MDI adapter, see SAP Help Portal documentation at [SAP Master Data Integration Receiver Adapter]( https://help.sap.com/docs/integration-suite/sap-integration-suite/e91e373bbb5b49ccbc2977152def61a2.html).
     *
     * @tags MDI Delta Token
     * @name MdiDeltaTokenOperationEntityVersionDelete
     * @summary Perform Delete operation on MDI delta token database.
     * @request DELETE:/MDIDeltaToken(Operation='{Operation}',Entity='{Entity}',Version='{Version}')
     * @secure
     */
    mdiDeltaTokenOperationEntityVersionDelete: (
      operation: string,
      entity: string,
      version: string,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/MDIDeltaToken(Operation='${operation}',Entity='${entity}',Version='${version}')`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  scriptCollectionDesigntimeArtifacts = {
    /**
     * @description You can use the following request to create or upload a script collection.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) and to the following SAP Community blog [Remote OData APIs for Integration Flows](https://blogs.sap.com/2018/07/06/cloud-integration-remote-odata-apis-for-integration-flows/).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to create script collections.
     *
     * @tags Script Collections
     * @name ScriptCollectionDesigntimeArtifactsCreate
     * @summary Create/upload a script collection.
     * @request POST:/ScriptCollectionDesigntimeArtifacts
     * @secure
     */
    scriptCollectionDesigntimeArtifactsCreate: (
      ScriptCollection: ComSapHciApiScriptCollectionDesigntimeArtifactCreate,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiScriptCollectionDesigntimeArtifact;
        },
        OdataError
      >({
        path: `/ScriptCollectionDesigntimeArtifacts`,
        method: "POST",
        body: ScriptCollection,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  scriptCollectionDesigntimeArtifactsIdIdVersionVersion = {
    /**
     * @description You can use the following request to get a script collection flow by Id and version.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html)</br>
     *
     * @tags Script Collections
     * @name ScriptCollectionDesigntimeArtifactsIdVersionList
     * @summary Get a script collection by Id and version.
     * @request GET:/ScriptCollectionDesigntimeArtifacts(Id='{Id}',Version='{Version}')
     * @secure
     */
    scriptCollectionDesigntimeArtifactsIdVersionList: (
      id: string,
      version: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Name" | "Version" | "PackageId")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiScriptCollectionDesigntimeArtifact;
        },
        OdataError
      >({
        path: `/ScriptCollectionDesigntimeArtifacts(Id='${id}',Version='${version}')`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update a script collection artifact.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update integration flows.
     *
     * @tags Script Collections
     * @name ScriptCollectionDesigntimeArtifactsIdVersionUpdate
     * @summary Update a script collection artifact.
     * @request PUT:/ScriptCollectionDesigntimeArtifacts(Id='{Id}',Version='{Version}')
     * @secure
     */
    scriptCollectionDesigntimeArtifactsIdVersionUpdate: (
      id: string,
      version: string,
      ScriptCollectionArtifact: ComSapHciApiScriptCollectionDesigntimeArtifactUpdate,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/ScriptCollectionDesigntimeArtifacts(Id='${id}',Version='${version}')`,
        method: "PUT",
        body: ScriptCollectionArtifact,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete a script collection.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete script collections.
     *
     * @tags Script Collections
     * @name ScriptCollectionDesigntimeArtifactsIdVersionDelete
     * @summary Delete a script collection.
     * @request DELETE:/ScriptCollectionDesigntimeArtifacts(Id='{Id}',Version='{Version}')
     * @secure
     */
    scriptCollectionDesigntimeArtifactsIdVersionDelete: (id: string, version: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/ScriptCollectionDesigntimeArtifacts(Id='${id}',Version='${version}')`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to download an script collection as zip file. Integration flows of configure-only packages cannot be downloaded.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html)</br>
     *
     * @tags Script Collections
     * @name ValueList
     * @summary Download a script collection as zip file.
     * @request GET:/ScriptCollectionDesigntimeArtifacts(Id='{Id}',Version='{Version}')/$value
     * @secure
     */
    valueList: (id: string, version: string, params: RequestParams = {}) =>
      this.request<File, OdataError>({
        path: `/ScriptCollectionDesigntimeArtifacts(Id='${id}',Version='${version}')/$value`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to add a resource to a script collection.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html) .<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update script collections.
     *
     * @tags Resources of Script Collection
     * @name ResourcesCreate
     * @summary Add a Resource to a script collection.
     * @request POST:/ScriptCollectionDesigntimeArtifacts(Id='{Id}',Version='{Version}')/Resources
     * @secure
     */
    resourcesCreate: (
      id: string,
      version: string,
      Resource: ComSapHciApiScriptCollectionDesigntimeArtifactResourceCreate,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiResource;
        },
        OdataError
      >({
        path: `/ScriptCollectionDesigntimeArtifacts(Id='${id}',Version='${version}')/Resources`,
        method: "POST",
        body: Resource,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update a resource of a script collection.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update an integration flow.
     *
     * @tags Resources of Script Collection
     * @name LinksResourcesNameResourceTypeUpdate
     * @summary Update a resource of a script collection.
     * @request PUT:/ScriptCollectionDesigntimeArtifacts(Id='{Id}',Version='{Version}')/$links/Resources(Name='{Name}',ResourceType='{Type}')
     * @secure
     */
    linksResourcesNameResourceTypeUpdate: (
      id: string,
      version: string,
      name: string,
      type: ("edmx" | "groovy" | "jar" | "js" | "mmap" | "opmap" | "wsdl" | "xsd" | "xslt")[],
      Resource: ComSapHciApiResourceUpdate,
      query?: {
        /**
         * Reference to another resource type (only for resource type 'xsd' the reference to 'wsdl' is allowed).
         * @uniqueItems true
         */
        ReferencedResourceType?: "wsdl"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/ScriptCollectionDesigntimeArtifacts(Id='${id}',Version='${version}')/$links/Resources(Name='${name}',ResourceType='${type}')`,
        method: "PUT",
        query: query,
        body: Resource,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete a resource of a script collection.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update integration flows.
     *
     * @tags Resources of Script Collection
     * @name LinksResourcesNameResourceTypeDelete
     * @summary Delete a resource of a script collection.
     * @request DELETE:/ScriptCollectionDesigntimeArtifacts(Id='{Id}',Version='{Version}')/$links/Resources(Name='{Name}',ResourceType='{Type}')
     * @secure
     */
    linksResourcesNameResourceTypeDelete: (
      id: string,
      version: string,
      name: string,
      type: ("edmx" | "groovy" | "jar" | "js" | "mmap" | "opmap" | "wsdl" | "xsd" | "xslt")[],
      query?: {
        /**
         * Reference to another resource type (only for resource type 'xsd' the reference to 'wsdl' is allowed).
         * @uniqueItems true
         */
        ReferencedResourceType?: "wsdl"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/ScriptCollectionDesigntimeArtifacts(Id='${id}',Version='${version}')/$links/Resources(Name='${name}',ResourceType='${type}')`,
        method: "DELETE",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  scriptCollectionDesigntimeArtifactSaveAsVersion = {
    /**
     * @description You can use the following request to update a script collection artifact with new specified version.<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update integration flows.
     *
     * @tags Script Collections
     * @name ScriptCollectionDesigntimeArtifactSaveAsVersionCreate
     * @summary Update a script collection artifact with version.
     * @request POST:/ScriptCollectionDesigntimeArtifactSaveAsVersion
     * @secure
     */
    scriptCollectionDesigntimeArtifactSaveAsVersionCreate: (
      query: {
        /**
         * Id of script collection artifact <br>
         * Example: ```ScriptCollectionArtifactID```
         */
        Id: string;
        /**
         * New version of script collection artifact <br>
         *  (e.g. ```1.0.1```).
         */
        SaveAsVersion: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/ScriptCollectionDesigntimeArtifactSaveAsVersion`,
        method: "POST",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  deployScriptCollectionDesigntimeArtifact = {
    /**
     * @description You can use the following request to deploy a script collection.<br>For further details, refer to the SAP Help Portal documentation [OData API: Integration Content](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/d1679a80543f46509a7329243b595bdb.html).<br> In API sandbox, only read APIs can be tested. You need to configure an API endpoint for your account, where you have the required write permissions to deploy script collections.
     *
     * @tags Script Collections
     * @name DeployScriptCollectionDesigntimeArtifactCreate
     * @summary Deploy a script collection.
     * @request POST:/DeployScriptCollectionDesigntimeArtifact
     * @secure
     */
    deployScriptCollectionDesigntimeArtifactCreate: (
      query: {
        /**
         * Id of script collection - enclosed in single quotes <br>
         * Example: **ScriptCollection1**
         */
        Id: string;
        /**
         * Version of script collection artifact - enclosed in single quotes  <br>
         * You can enter either **active** or the version name (e.g. **1.0.5**) for retrieving the current version.
         * @default "'active'"
         */
        Version: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/DeployScriptCollectionDesigntimeArtifact`,
        method: "POST",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  executeIntegrationDesigntimeArtifactsGuidelines = {
    /**
     * @description You can use the following request to validate integration flow against activated guidelines.
     *
     * @tags Integration Flow - Design Guidelines
     * @name ExecuteIntegrationDesigntimeArtifactsGuidelinesCreate
     * @summary Execute guidelines for intgeration flow.
     * @request POST:/ExecuteIntegrationDesigntimeArtifactsGuidelines
     * @secure
     */
    executeIntegrationDesigntimeArtifactsGuidelinesCreate: (
      query: {
        /**
         * Id of integration flow<br>
         * Example: **IntegrationFlowWithConfiguration**.
         */
        Id: string;
        /**
         * Version of integration flow<br>
         * You can enter either **active** or the version name (e.g. **1.0.5**) for retrieving the current version.
         * @default "active"
         */
        Version: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/ExecuteIntegrationDesigntimeArtifactsGuidelines`,
        method: "POST",
        query: query,
        secure: true,
        ...params,
      }),
  };
}
