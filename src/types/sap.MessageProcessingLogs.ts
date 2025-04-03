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

/** MessageStoreEntry */
export interface ComSapHciApiMessageStoreEntry {
  Id?: string | null;
  MessageGuid?: string | null;
  MessageStoreId?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  TimeStamp?: string | null;
  HasAttachments?: boolean | null;
  Attachments?: ComSapHciApiMessageStoreEntryAttachment[];
  Properties?: ComSapHciApiMessageStoreEntryProperty[];
}

/** MessageProcessingLog */
export interface ComSapHciApiMessageProcessingLog {
  MessageGuid?: string | null;
  CorrelationId?: string | null;
  ApplicationMessageId?: string | null;
  ApplicationMessageType?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  LogStart?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  LogEnd?: string | null;
  Sender?: string | null;
  Receiver?: string | null;
  IntegrationFlowName?: string | null;
  Status?: string | null;
  AlternateWebLink?: string | null;
  IntegrationArtifact?: ComSapHciApiIntegrationArtifact;
  LogLevel?: string | null;
  CustomStatus?: string | null;
  ArchivingStatus?: string | null;
  ArchivingSenderChannelMessages?: string | null;
  ArchivingReceiverChannelMessages?: string | null;
  ArchivingLogAttachments?: string | null;
  ArchivingPersistedMessages?: string | null;
  TransactionId?: string | null;
  PreviousComponentName?: string | null;
  LocalComponentName?: string | null;
  OriginComponentName?: string | null;
  CustomHeaderProperties?: ComSapHciApiMessageProcessingLogCustomHeaderProperty[];
  MessageStoreEntries?: ComSapHciApiMessageStoreEntry[];
  ErrorInformation?: ComSapHciApiMessageProcessingLogErrorInformation;
  AdapterAttributes?: ComSapHciApiMessageProcessingLogAdapterAttribute[];
  Attachments?: ComSapHciApiMessageProcessingLogAttachment[];
}

/** MessageStoreEntryProperty */
export interface ComSapHciApiMessageStoreEntryProperty {
  MessageId?: string | null;
  Name?: string | null;
  Value?: string | null;
}

/** MessageProcessingLogErrorInformation */
export interface ComSapHciApiMessageProcessingLogErrorInformation {
  MessageGuid?: string | null;
  Type?: string | null;
  LastErrorModelStepId?: string | null;
}

/** MessageProcessingLogAttachment */
export interface ComSapHciApiMessageProcessingLogAttachment {
  Id?: string | null;
  MessageGuid?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  TimeStamp?: string | null;
  Name?: string | null;
  ContentType?: string | null;
  /** @format int64 */
  PayloadSize?: number | null;
}

/** MessageProcessingLogCustomHeaderProperty */
export interface ComSapHciApiMessageProcessingLogCustomHeaderProperty {
  Id?: string | null;
  Name?: string | null;
  Value?: string | null;
  Log?: ComSapHciApiMessageProcessingLog;
}

/** MessageProcessingLogAdapterAttribute */
export interface ComSapHciApiMessageProcessingLogAdapterAttribute {
  Id?: string | null;
  AdapterId?: string | null;
  AdapterMessageId?: string | null;
  Name?: string | null;
  Value?: string | null;
  MessageProcessingLog?: ComSapHciApiMessageProcessingLog;
}

/** MessageStoreEntryAttachmentProperty */
export interface ComSapHciApiMessageStoreEntryAttachmentProperty {
  AttachmentId?: string | null;
  Name?: string | null;
  Value?: string | null;
}

/** MessageStoreEntryAttachment */
export interface ComSapHciApiMessageStoreEntryAttachment {
  Id?: string | null;
  Name?: string | null;
  ContentType?: string | null;
  Properties?: ComSapHciApiMessageStoreEntryAttachmentProperty[];
}

/** IntegrationArtifact */
export interface ComSapHciApiIntegrationArtifact {
  Id?: string | null;
  Name?: string | null;
  Type?: string | null;
  PackageId?: string | null;
  PackageName?: string | null;
}

/** IdMapToId */
export interface ComSapHciApiIdMapToId {
  ToId?: string;
  /** @example "string" */
  FromId_?: string | null;
  /** @example "string" */
  Mapper?: string | null;
  /** @example "/Date(1492098664000)/" */
  ExpirationTime?: string | null;
  /** @example "string" */
  Qualifier?: string | null;
  /** @example "string" */
  Context?: string | null;
}

/** IdMapFromId2 */
export interface ComSapHciApiIdMapFromId2 {
  FromId?: string;
  /** @example "string" */
  ToId2?: string | null;
  /** @example "string" */
  Mapper?: string | null;
  /** @example "/Date(1492098664000)/" */
  ExpirationTime?: string | null;
  /** @example "string" */
  Qualifier?: string | null;
  /** @example "string" */
  Context?: string | null;
}

/** IdempotentRepositoryEntry */
export interface ComSapHciApiIdempotentRepositoryEntry {
  /** @example "7573657240686F7374" */
  HexSource?: string | null;
  /** @example "496e707574466f6c6465722f66696c652e786d6c" */
  HexEntry?: string | null;
  /** @example "user@host" */
  Source?: string | null;
  /** @example "InputFolder/file.xml" */
  Entry?: string | null;
  /** @example "SFTP or XI" */
  Component?: string | null;
  /**
   * @format int64
   * @example "1550564603"
   */
  CreationTime?: number | string | null;
  /**
   * @format int64
   * @example "1550564603"
   */
  ExpirationTime?: number | string | null;
}

/** GenericIdempotentRepositoryEntry */
export interface ComSapHciApiGenericIdempotentRepositoryEntry {
  /** @example "7573657240686F7374" */
  HexVendor?: string | null;
  /** @example "7573657240686F7374" */
  HexSource?: string | null;
  /** @example "496e707574466f6c6465722f66696c652e786d6c" */
  HexEntry?: string | null;
  /** @example "7573657240686F7374" */
  HexComponent?: string | null;
  /** @example "user@host" */
  Source?: string | null;
  /** @example "InputFolder/file.xml" */
  Entry?: string | null;
  /** @example "SFTP or XI" */
  Component?: string | null;
  /** @example "SAP" */
  Vendor?: string | null;
  /**
   * @format int64
   * @example "1550564603"
   */
  CreationTime?: number | string | null;
  /**
   * @format int64
   * @example "1550564603"
   */
  ExpirationTime?: number | string | null;
}

/** ArchivingKeyPerfomranceIndicators */
export interface ComSapHciApiArchivingKeyPerformanceIndicators {
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  RunStart?: string | null;
  /**
   * @format int32
   * @example "34"
   */
  RunDurationInMinutes?: number | string | null;
  /**
   * @format int32
   * @example "1"
   */
  DataCollectionDurationInMinutes?: number | string | null;
  /**
   * @format int32
   * @example "1"
   */
  DataCompressionDurationInMinutes?: number | string | null;
  /**
   * @format int32
   * @example "1"
   */
  DataUploadDurationInMinutes?: number | string | null;
  /**
   * @format int32
   * @example "2000"
   */
  MplsToBeArchived?: number | string | null;
  /**
   * @format int32
   * @example "2000"
   */
  MplsArchived?: number | string | null;
  /**
   * @format int32
   * @example "0"
   */
  MplsArchivingFailed?: number | string | null;
  /**
   * @format int32
   * @example "2000"
   */
  MplsArchivedUntilDate?: number | string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  DateOfOldestMplToBeArchivedAfterRun?: string | null;
  /**
   * @format int64
   * @example "15"
   */
  DataUploadedInMb?: number | string | null;
  /** @example "COMPLETED" */
  RunStatus?: string | null;
  /** @example "" */
  RunFailedPhase?: string | null;
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
  public baseUrl: string = "https://{Account Short Name}-tmn.{SSL Host}.{landscapehost}/api/v1";
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
 * @title Message Processing Logs
 * @version 1.0.0
 * @baseUrl https://{Account Short Name}-tmn.{SSL Host}.{landscapehost}/api/v1
 * @externalDocs https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/827a2d7e9c6f4866a1d6c0e647bcacd2.html
 *
 * Message processing logs enable you to store data about the messages processed on a tenant and - for each processed message - information about the individual processing steps.
 * This API is implemented based on OData version 2 specification.
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

  messageProcessingLogs = {
    /**
     * @description Get all message processing logs.<br> In API sandbox the available integration flows provide the following log information: * '__Integration Flow with Message Store entries - COMPLETED PROCESSING__': Attachments and message store entries * '__Integration Flow with Adapter Data - FAILED PROCESSING__': Message processing log error information, attachments, custom header properties and adapter data
     *
     * @tags Logs
     * @name MessageProcessingLogsList
     * @summary Get all message processing logs.
     * @request GET:/MessageProcessingLogs
     * @secure
     */
    messageProcessingLogsList: (
      query?: {
        /**
         * Count the number of retrieved entries by selecting ```allpages```.
         * @uniqueItems true
         */
        $inlinecount?: "allpages"[];
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
         * Filter items by property values.<br>
         * For any Id filter use only the 'eq' operator.<br>
         * Example: ```Status eq 'FAILED'``` returns message processing logs with status 'FAILED'.<br>
         * IntegrationFlowName is deprecated. In queries filtering for IntegrationFlowName, this will be substituted automatically by IntegrationFlow/Id
         */
        $filter?: string;
        /**
         * Order items by property values.<br>
         * IntegrationFlowName is deprecated.
         * @uniqueItems true
         */
        $orderby?: (
          | "LogEnd"
          | "LogEnd desc"
          | "LogStart"
          | "LogStart desc"
          | "Status,LogEnd desc"
          | "ApplicationMessageId"
        )[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "MessageGuid"
          | "CorrelationId"
          | "ApplicationMessageId"
          | "ApplicationMessageType"
          | "IntegrationFlowName"
          | "IntegrationArtifact"
          | "Status"
          | "CustomStatus"
          | "LogLevel"
          | "LogStart"
          | "LogEnd"
          | "Sender"
          | "Receiver"
          | "AlternateWebLink"
          | "ArchivingStatus"
          | "ArchivingSenderChannelMessages"
          | "ArchivingReceiverChannelMessages"
          | "ArchivingLogAttachments"
          | "ArchivingPersistedMessages"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiMessageProcessingLog[];
          };
        },
        OdataError
      >({
        path: `/MessageProcessingLogs`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get number of all message processing logs.
     *
     * @tags Logs
     * @name CountList
     * @summary Get number of all message processing logs.
     * @request GET:/MessageProcessingLogs/$count
     * @secure
     */
    countList: (
      query?: {
        /**
         * Filter items by property values.<br>
         *  For any Id filter use only the 'eq' operator.<br>
         * Example: ```Status eq 'FAILED'``` returns the number of message processing logs with status 'FAILED'<br>
         * IntegrationFlowName is deprecated. In queries filtering for IntegrationFlowName, this will be substituted automatically by IntegrationFlow/Id.
         */
        $filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/MessageProcessingLogs/$count`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
  messageProcessingLogsMessageGuid = {
    /**
     * @description You can use the following request to get message processing log by message Guid.<br> In API sandbox the integration flows provide the following log information: * '__Integration Flow with message store entries COMPLETED PROCESSING__': Attachments and message store entries * '__Integration Flow with Adapter Data - FAILED PROCESSING__': Message processing log error information, attachments, custom header properties and adapter data
     *
     * @tags Logs
     * @name MessageProcessingLogsList
     * @summary Get message processing log by message Guid.
     * @request GET:/MessageProcessingLogs('{MessageGuid}')
     * @secure
     */
    messageProcessingLogsList: (
      messageGuid: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "CorrelationId"
          | "ApplicationMessageId"
          | "ApplicationMessageType"
          | "IntegrationFlowName"
          | "IntegrationArtifact"
          | "Status"
          | "CustomStatus"
          | "LogLevel"
          | "LogStart"
          | "LogEnd"
          | "Sender"
          | "Receiver"
          | "AlternateWebLink"
          | "ArchivingStatus"
          | "ArchivingSenderChannelMessages"
          | "ArchivingReceiverChannelMessages"
          | "ArchivingLogAttachments"
          | "ArchivingPersistedMessages"
        )[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: ("AdapterAttributes" | "CustomHeaderProperties")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiMessageProcessingLog;
        },
        OdataError
      >({
        path: `/MessageProcessingLogs('${messageGuid}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get the adapter attributes of the message processing log with the specified message Guid.<br> In API sandbox only the deployed integration flow '__Integration Flow with Adapter Data - FAILED PROCESSING__' provides the required adapter data
     *
     * @tags Adapter Attributes
     * @name AdapterAttributesList
     * @summary Get adapter attributes of message processing log by message Guid.
     * @request GET:/MessageProcessingLogs('{MessageGuid}')/AdapterAttributes
     * @secure
     */
    adapterAttributesList: (
      messageGuid: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "AdapterId" | "AdapterMessageId" | "Name" | "Value")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiMessageProcessingLogAdapterAttribute[];
          };
        },
        OdataError
      >({
        path: `/MessageProcessingLogs('${messageGuid}')/AdapterAttributes`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get the attachments of the message processing log with the specified message Guid.<br> In API sandbox the following integration flows provide the required message processing log attachments: * '__Integration Flow with message store entries COMPLETED PROCESSING__' * '__Integration Flow with Adapter Data FAILED PROCESSING__'
     *
     * @tags Attachments
     * @name AttachmentsList
     * @summary Get attachments of message processing log by message Guid.
     * @request GET:/MessageProcessingLogs('{MessageGuid}')/Attachments
     * @secure
     */
    attachmentsList: (messageGuid: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiMessageProcessingLogAttachment[];
          };
        },
        OdataError
      >({
        path: `/MessageProcessingLogs('${messageGuid}')/Attachments`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get custom header properties of message processing log with the specified message Guid.<br> In API sandbox only the deployed integration flow '__Integration Flow with Adapter Data - FAILED PROCESSING__' provides the required custom header properties
     *
     * @tags Custom Header Properties
     * @name CustomHeaderPropertiesList
     * @summary Get custom header properties of message processing log by message Guid.
     * @request GET:/MessageProcessingLogs('{MessageGuid}')/CustomHeaderProperties
     * @secure
     */
    customHeaderPropertiesList: (
      messageGuid: string,
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
        /** Filter items by property values */
        $filter?: string;
        /**
         * Order items by property values
         * @uniqueItems true
         */
        $orderby?: ("Name" | "Name desc" | "Name,Value" | "Value desc")[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "Name" | "Value")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiMessageProcessingLogCustomHeaderProperty[];
          };
        },
        OdataError
      >({
        path: `/MessageProcessingLogs('${messageGuid}')/CustomHeaderProperties`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get error information for the message with the specified message Guid.<br> In API sandbox only the deployed integration flow '__Integration Flow with Adapter Data - FAILED PROCESSING__' provides the required error information
     *
     * @tags Error Information
     * @name ErrorInformationList
     * @summary Get error information of message processing log by message Guid.
     * @request GET:/MessageProcessingLogs('{MessageGuid}')/ErrorInformation
     * @secure
     */
    errorInformationList: (messageGuid: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: ComSapHciApiMessageProcessingLogErrorInformation;
        },
        OdataError
      >({
        path: `/MessageProcessingLogs('${messageGuid}')/ErrorInformation`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get error information text for the message with the specified message Guid.<br> In API sandbox only the deployed integration flow '__Integration Flow with Adapter Data - FAILED PROCESSING__' provides the required error information
     *
     * @tags Error Information
     * @name ErrorInformationValueList
     * @summary Get error information text of message processing log by message Guid.
     * @request GET:/MessageProcessingLogs('{MessageGuid}')/ErrorInformation/$value
     * @secure
     */
    errorInformationValueList: (messageGuid: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/MessageProcessingLogs('${messageGuid}')/ErrorInformation/$value`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  idMapFromIdsSourceId = {
    /**
     * @description You can use the following request to get all target Ids for the given source Id, which are stored in the Id mapper.
     *
     * @tags ID Mapper
     * @name ToIdsList
     * @summary Get all target Ids for the given source Id.
     * @request GET:/IdMapFromIds('{Source ID}')/ToIds
     * @secure
     */
    toIdsList: (sourceId: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiIdMapToId[];
          };
        },
        void | OdataError
      >({
        path: `/IdMapFromIds('{Source ID}')/ToIds`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  idMapToIdsTargetId = {
    /**
     * @description You can use the following request to get all source Ids for the given target Id, which are stored in the Id mapper.
     *
     * @tags ID Mapper
     * @name FromId2SList
     * @summary Get source Ids for a given target Id
     * @request GET:/IdMapToIds('{Target ID}')/FromId2s
     * @secure
     */
    fromId2SList: (targetId: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiIdMapFromId2[];
          };
        },
        void | OdataError
      >({
        path: `/IdMapToIds('{Target ID}')/FromId2s`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  idempotentRepositoryEntries = {
    /**
     * @description This path is deprecated. Please use the __/GenericIdempotentRepositoryEntries__ path.<br> You can use the following request to get entries from Idempotent Repository with the same id.
     *
     * @tags Idempotent Repository
     * @name IdempotentRepositoryEntriesList
     * @summary Get Idempotent Repository entries by id.
     * @request GET:/IdempotentRepositoryEntries
     * @deprecated
     * @secure
     */
    idempotentRepositoryEntriesList: (
      query: {
        /** Entry ID of Idempotent Repository - for SFTP adapter &lt;source directory&gt;/&lt;file name&gt; and for XI adapter the XI message ID needs to be entered. */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiIdempotentRepositoryEntry[];
          };
        },
        OdataError
      >({
        path: `/IdempotentRepositoryEntries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  idempotentRepositoryEntriesHexSourceHexSourceHexEntryHexEntry = {
    /**
     * @description This path is deprecated. Please use the __/GenericIdempotentRepositoryEntries__ path.<br> You can use the following request to get entry from Idempotent Repository by hex encoded source and entry values.
     *
     * @tags Idempotent Repository
     * @name IdempotentRepositoryEntriesHexSourceHexEntryList
     * @summary Get Idempotent Repository entry.
     * @request GET:/IdempotentRepositoryEntries(HexSource='{HexSource}',HexEntry='{HexEntry}')
     * @deprecated
     * @secure
     */
    idempotentRepositoryEntriesHexSourceHexEntryList: (
      hexSource: string,
      hexEntry: string,
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiIdempotentRepositoryEntry, void | OdataError>({
        path: `/IdempotentRepositoryEntries(HexSource='${hexSource}',HexEntry='${hexEntry}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description This path is deprecated. Please use the __/GenericIdempotentRepositoryEntries__ path.<br> You can use the following request to delete entry from Idempotent Repository.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete entries from the Idempotent Repository.
     *
     * @tags Idempotent Repository
     * @name IdempotentRepositoryEntriesHexSourceHexEntryDelete
     * @summary Delete Idempotent Repository entry.
     * @request DELETE:/IdempotentRepositoryEntries(HexSource='{HexSource}',HexEntry='{HexEntry}')
     * @deprecated
     * @secure
     */
    idempotentRepositoryEntriesHexSourceHexEntryDelete: (
      hexSource: string,
      hexEntry: string,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/IdempotentRepositoryEntries(HexSource='${hexSource}',HexEntry='${hexEntry}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  genericIdempotentRepositoryEntries = {
    /**
     * @description You can use the following request to get entries from Idempotent Repository with the same id.
     *
     * @tags Idempotent Repository
     * @name GenericIdempotentRepositoryEntriesList
     * @summary Get Idempotent Repository entries by id.
     * @request GET:/GenericIdempotentRepositoryEntries
     * @secure
     */
    genericIdempotentRepositoryEntriesList: (
      query: {
        /** Entry ID of Idempotent Repository - for SFTP adapter &lt;source directory&gt;/&lt;file name&gt; and for XI adapter the XI message ID needs to be entered. */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiGenericIdempotentRepositoryEntry[];
          };
        },
        OdataError
      >({
        path: `/GenericIdempotentRepositoryEntries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  genericIdempotentRepositoryEntriesHexVendorHexVendorHexSourceHexSourceHexEntryHexEntryHexComponentHexComponent = {
    /**
     * @description You can use the following request to get entry from Idempotent Repository by hex encoded vendor, source, entry and component values.
     *
     * @tags Idempotent Repository
     * @name GenericIdempotentRepositoryEntriesHexVendorHexSourceHexEntryHexComponentList
     * @summary Get Idempotent Repository entry.
     * @request GET:/GenericIdempotentRepositoryEntries(HexVendor='{HexVendor}',HexSource='{HexSource}',HexEntry='{HexEntry}',HexComponent='{HexComponent}')
     * @secure
     */
    genericIdempotentRepositoryEntriesHexVendorHexSourceHexEntryHexComponentList: (
      hexVendor: string,
      hexSource: string,
      hexEntry: string,
      hexComponent: string,
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiGenericIdempotentRepositoryEntry, void | OdataError>({
        path: `/GenericIdempotentRepositoryEntries(HexVendor='${hexVendor}',HexSource='${hexSource}',HexEntry='${hexEntry}',HexComponent='${hexComponent}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to delete entry from Idempotent Repository.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete entries from the Idempotent Repository.
     *
     * @tags Idempotent Repository
     * @name GenericIdempotentRepositoryEntriesHexVendorHexSourceHexEntryHexComponentDelete
     * @summary Delete Idempotent Repository entry.
     * @request DELETE:/GenericIdempotentRepositoryEntries(HexVendor='{HexVendor}',HexSource='{HexSource}',HexEntry='{HexEntry}',HexComponent='{HexComponent}')
     * @secure
     */
    genericIdempotentRepositoryEntriesHexVendorHexSourceHexEntryHexComponentDelete: (
      hexVendor: string,
      hexSource: string,
      hexEntry: string,
      hexComponent: string,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/GenericIdempotentRepositoryEntries(HexVendor='${hexVendor}',HexSource='${hexSource}',HexEntry='${hexEntry}',HexComponent='${hexComponent}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  activateExternalLogging = {
    /**
     * @description This API is only present in the <b>Cloud Foundry environment.</b> You can use the following request to acitvate external logging on your tenant.<br>If no response body is returned, there's an authentication issue. Make sure the request is authorized and that your user has the ActivateExternalLogging role.<br>For more information, see SAP Help Portal documentation at [External Logging](https://help.sap.com/docs/integration-suite/sap-integration-suite/external-logging-cloud-foundry-environment).
     *
     * @tags External Logging
     * @name ActivateExternalLoggingCreate
     * @summary Activate external logging
     * @request POST:/activateExternalLogging
     * @secure
     */
    activateExternalLoggingCreate: (
      query: {
        /**
         * Set the default external log level for new or existing integration flows that have no individual external log level configured.
         * @default "NONE"
         */
        defaultLogLevel: ("NONE" | "INFO" | "ERROR")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<object, OdataError>({
        path: `/activateExternalLogging`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  deactivateExternalLogging = {
    /**
     * @description This API is only present in the <b>Cloud Foundry environment.</b> You can use the following request to deacitvate external logging on your tenant.<br>If no response body is returned, there's an authentication issue. Make sure the request is authorized and that your user has the ActivateExternalLogging role.<br>For more information, see SAP Help Portal documentation at [External Logging](https://help.sap.com/docs/integration-suite/sap-integration-suite/external-logging-cloud-foundry-environment).
     *
     * @tags External Logging
     * @name DeactivateExternalLoggingCreate
     * @summary Deactivate external logging
     * @request POST:/deactivateExternalLogging
     * @secure
     */
    deactivateExternalLoggingCreate: (params: RequestParams = {}) =>
      this.request<object, OdataError>({
        path: `/deactivateExternalLogging`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  externalLoggingActivationStatusTenantName = {
    /**
     * @description This API is only present in the <b>Cloud Foundry environment.</b>
     *
     * @tags External Logging
     * @name ExternalLoggingActivationStatusList
     * @summary Get external logging status for a tenant
     * @request GET:/ExternalLoggingActivationStatus('{TenantName}')
     * @secure
     */
    externalLoggingActivationStatusList: (tenantName: string, params: RequestParams = {}) =>
      this.request<object, OdataError>({
        path: `/ExternalLoggingActivationStatus('${tenantName}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  activateArchivingConfiguration = {
    /**
     * @description This API is only present in the <b>Cloud Foundry environment.</b> You can use the following request to acitvate the archiving functionality in your tenant.
     *
     * @tags Data Archiving
     * @name ActivateArchivingConfigurationCreate
     * @summary Enable archiving
     * @request POST:/activateArchivingConfiguration
     * @secure
     */
    activateArchivingConfigurationCreate: (params: RequestParams = {}) =>
      this.request<object, OdataError>({
        path: `/activateArchivingConfiguration`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  archivingConfigurationsTenantName = {
    /**
     * @description This API is only present in the <b>Cloud Foundry environment.</b> You can use the following request to acitvate the archiving functionality in your tenant.
     *
     * @tags Data Archiving
     * @name ArchivingConfigurationsList
     * @summary Get archiving configuration for a tenant
     * @request GET:/ArchivingConfigurations('{TenantName}')
     * @secure
     */
    archivingConfigurationsList: (tenantName: string, params: RequestParams = {}) =>
      this.request<object, OdataError>({
        path: `/ArchivingConfigurations('${tenantName}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  archivingKeyPerformanceIndicators = {
    /**
     * @description This API is only present in the <b>Cloud Foundry environment.</b> You can use the following request to get the Key Performance Indicators (KPIs) of the archiving runs.
     *
     * @tags Data Archiving
     * @name ArchivingKeyPerformanceIndicatorsList
     * @summary Get Key Performance Indicators of the archiving run
     * @request GET:/ArchivingKeyPerformanceIndicators
     * @secure
     */
    archivingKeyPerformanceIndicatorsList: (
      query?: {
        /**
         * Filter items by property values.<br>
         * For any Id filter use only the 'eq' operator.<br>
         * Example: ```MplsToBeArchived eq 5000```
         */
        $filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiArchivingKeyPerformanceIndicators[];
          };
        },
        OdataError
      >({
        path: `/ArchivingKeyPerformanceIndicators`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
