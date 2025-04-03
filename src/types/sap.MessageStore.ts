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
   * @example "2020-04-13T15:51:04Z"
   */
  Timestamp?: string | null;
  HasAttachments?: boolean;
  /** Attachments of MessageStoreEntries */
  Attachments?: {
    results?: ComSapHciApiMessageStoreEntryAttachment[];
  };
  /** Properties of MessageStoreEntries */
  Properties?: {
    results?: ComSapHciApiMessageStoreEntryProperty[];
  };
}

/** MessageStoreEntryProperty */
export interface ComSapHciApiMessageStoreEntryProperty {
  MessageId?: string | null;
  Name?: string | null;
  Value?: string | null;
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

/** JmsBroker */
export interface ComSapHciApiJmsBroker {
  Key?: string;
  /**
   * @format int64
   * @example "42"
   */
  Capacity?: number | string | null;
  /**
   * @format int64
   * @example "42"
   */
  MaxCapacity?: number | string | null;
  /** @format int32 */
  IsTransactedSessionsHigh?: number | null;
  /** @format int32 */
  IsConsumersHigh?: number | null;
  /** @format int32 */
  IsProducersHigh?: number | null;
  /**
   * @format int64
   * @example "42"
   */
  MaxQueueNumber?: number | string | null;
  /**
   * @format int64
   * @example "42"
   */
  QueueNumber?: number | string | null;
  /**
   * @format int64
   * @example "42"
   */
  CapacityOk?: number | string | null;
  /**
   * @format int64
   * @example "42"
   */
  CapacityWarning?: number | string | null;
  /**
   * @format int64
   * @example "42"
   */
  CapacityError?: number | string | null;
}

/** JmsBrokerQueueStates */
export interface ComSapHciApiJmsBrokerQueueStates {
  Key?: string;
  /**
   * @format int64
   * @example "42"
   */
  Capacity?: number | string | null;
  /**
   * @format int64
   * @example "42"
   */
  MaxCapacity?: number | string | null;
  /** @format int32 */
  IsTransactedSessionsHigh?: number | null;
  /** @format int32 */
  IsConsumersHigh?: number | null;
  /** @format int32 */
  IsProducersHigh?: number | null;
  /**
   * @format int64
   * @example "42"
   */
  MaxQueueNumber?: number | string | null;
  /**
   * @format int64
   * @example "42"
   */
  QueueNumber?: number | string | null;
  /**
   * @format int64
   * @example "42"
   */
  CapacityOk?: number | string | null;
  /**
   * @format int64
   * @example "42"
   */
  CapacityWarning?: number | string | null;
  /**
   * @format int64
   * @example "42"
   */
  CapacityError?: number | string | null;
  QueueStates?: {
    Name?: string;
    /**
     * @format int64
     * @example "0"
     */
    State?: number | string | null;
  };
}

/** NumberRanges */
export interface ComSapHciApiNumberRanges {
  Name?: string;
  Description?: string;
  MaxValue?: string;
  MinValue?: string;
  Rotate?: string;
  CurrentValue?: string;
  FieldLength?: string;
  DeployedBy?: string;
  /**
   * @format date-time
   * @example "2021-04-13T15:51:04"
   */
  DeployedOn?: string;
}

/** NumberRanges-create */
export interface ComSapHciApiNumberRangesPut {
  Name?: string;
  Description?: string;
  MaxValue?: string;
  MinValue?: string;
  Rotate?: string;
  CurrentValue?: string;
  FieldLength?: string;
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

/** DataStores */
export interface ComSapHciApiDataStores {
  DataStoreName?: string;
  IntegrationFlow?: string;
  Type?: string;
  Visibility?: string;
  /**
   * @format int64
   * @example "42"
   */
  NumberOfMessages?: number;
  /**
   * @format int64
   * @example "42"
   */
  NumberOfOverdueMessages?: number;
}

/** DataStoreEntries */
export interface ComSapHciApiDataStoreEntries {
  Id?: string;
  DataStoreName?: string;
  IntegrationFlow?: string;
  Type?: string;
  Status?: string;
  Messageid?: string;
  /**
   * @format date-time
   * @example "2021-04-13T15:51:04"
   */
  DueAt?: string;
  /**
   * @format date-time
   * @example "20121-04-13T15:51:04"
   */
  CreatedAt?: string;
  /**
   * @format date-time
   * @example "2021-04-13T15:51:04"
   */
  RetainUntil?: string;
}

/** Variables */
export interface ComSapHciApiVariables {
  VariableName?: string;
  IntegrationFlow?: string;
  Visibility?: string;
  /**
   * @format date-time
   * @example "20121-04-13T15:51:04"
   */
  UpdatedAt?: string;
  /**
   * @format date-time
   * @example "2021-04-13T15:51:04"
   */
  RetainUntil?: string;
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
 * @title Message Stores
 * @version 1.0.0
 * @baseUrl https://{Account Short Name}-tmn.{SSL Host}.{landscapehost}/api/v1
 * @externalDocs https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/1aab5e9482f545539a7caae3e9887e4e.html
 *
 * Message store enables you get data for processed messages. You can access the stored message and analyze it at a later point in time. An integration flow stores messages in a message store through the Persist step for 90 days.
 * Additionally, you can get information on the JMS resources available on the tenant as well as on those actually used by your integration flows.
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

  messageProcessingLogsMessageGuid = {
    /**
     * @description You can use the following request to get message store entries for the specified message Guid.<br> In API sandbox the integration flow '__Integration Flow with MessageStore - COMPLETED PROCESSING__' creates the corresponding message processing logs with message store entries.
     *
     * @tags Entries
     * @name MessageStoreEntriesList
     * @summary Get message store entries by message Guid.
     * @request GET:/MessageProcessingLogs('{MessageGuid}')/MessageStoreEntries
     * @secure
     */
    messageStoreEntriesList: (messageGuid: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiMessageStoreEntry[];
          };
        },
        OdataError
      >({
        path: `/MessageProcessingLogs('${messageGuid}')/MessageStoreEntries`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  messageStoreEntriesMessageStoreEntryId = {
    /**
     * @description You can use the following request to get entry from message store for a specific entry Id.<br> In API sandbox the integration flow '__Integration Flow with MessageStore COMPLETED PROCESSING__' creates the corresponding message processing logs with message store entries.
     *
     * @tags Entries
     * @name MessageStoreEntriesList
     * @summary Get message store entry by Id.
     * @request GET:/MessageStoreEntries('{MessageStoreEntryId}')
     * @secure
     */
    messageStoreEntriesList: (messageStoreEntryId: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: ComSapHciApiMessageStoreEntry;
        },
        OdataError
      >({
        path: `/MessageStoreEntries('${messageStoreEntryId}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get message payload from message store for a specific entry Id.<br> In API sandbox the integration flow '__Integration Flow with MessageStore - COMPLETED PROCESSING__' creates the corresponding message processing logs with message store entries.
     *
     * @tags Entries
     * @name ValueList
     * @summary Get message payload from message store by entry Id.
     * @request GET:/MessageStoreEntries('{MessageStoreEntryId}')/$value
     * @secure
     */
    valueList: (messageStoreEntryId: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/MessageStoreEntries('${messageStoreEntryId}')/$value`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description You can use the following request to get all attachments from the message store entry with specified entry Id.<br> In API sandbox the integration flow '__Integration Flow with MessageStore COMPLETED PROCESSING__' creates the corresponding message processing logs with message store entries and attachments.
     *
     * @tags Entry Attachments
     * @name AttachmentsList
     * @summary Get attachments from message store by entry Id.
     * @request GET:/MessageStoreEntries('{MessageStoreEntryId}')/Attachments
     * @secure
     */
    attachmentsList: (messageStoreEntryId: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiMessageStoreEntryAttachment[];
          };
        },
        OdataError
      >({
        path: `/MessageStoreEntries('${messageStoreEntryId}')/Attachments`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get all properties of message store entry for the specified entry Id.<br> In API sandbox the integration flow '__Integration Flow with MessageStore - COMPLETED PROCESSING__' creates the corresponding message processing logs with message store entries and properties.
     *
     * @tags Entry Properties
     * @name PropertiesList
     * @summary Get all properties of message store by entry Id
     * @request GET:/MessageStoreEntries('{MessageStoreEntryId}')/Properties
     * @secure
     */
    propertiesList: (messageStoreEntryId: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiMessageStoreEntryProperty[];
          };
        },
        OdataError
      >({
        path: `/MessageStoreEntries('${messageStoreEntryId}')/Properties`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  messageStoreEntryAttachmentsMessageStoreEntryAttachmentId = {
    /**
     * @description You can use the following request to get the attachment of a message store entry with specified attachment Id.<br> In API sandbox the integration flow '__Integration Flow with MessageStore - COMPLETED PROCESSING__' creates the corresponding message processing logs with message store entries and attachments.
     *
     * @tags Entry Attachments
     * @name MessageStoreEntryAttachmentsList
     * @summary Get attachment from message store by attachment Id.
     * @request GET:/MessageStoreEntryAttachments('{MessageStoreEntryAttachmentId}')
     * @secure
     */
    messageStoreEntryAttachmentsList: (messageStoreEntryAttachmentId: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: ComSapHciApiMessageStoreEntryAttachment;
        },
        OdataError
      >({
        path: `/MessageStoreEntryAttachments('${messageStoreEntryAttachmentId}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get the attachment content of a message store entry with specified Id.<br> In API sandbox the integration flow '__Integration Flow with MessageStore - COMPLETED PROCESSING__' creates the corresponding message processing logs with message store entries and attachments.
     *
     * @tags Entry Attachments
     * @name ValueList
     * @summary Get attachment content from message store by attachment Id.
     * @request GET:/MessageStoreEntryAttachments('{MessageStoreEntryAttachmentId}')/$value
     * @secure
     */
    valueList: (messageStoreEntryAttachmentId: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/MessageStoreEntryAttachments('${messageStoreEntryAttachmentId}')/$value`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description You can use the following request to get attachment properties of a message store entry for specified attachment Id.<br> In API sandbox the integration flow '__Integration Flow with MessageStore - COMPLETED PROCESSING__' creates the corresponding message processing logs with message store entries and attachments.
     *
     * @tags Entry Attachment Properties
     * @name PropertiesList
     * @summary Get attachment properties from message store by attachment Id.
     * @request GET:/MessageStoreEntryAttachments('{MessageStoreEntryAttachmentId}')/Properties
     * @secure
     */
    propertiesList: (messageStoreEntryAttachmentId: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiMessageStoreEntryAttachmentProperty[];
          };
        },
        OdataError
      >({
        path: `/MessageStoreEntryAttachments('${messageStoreEntryAttachmentId}')/Properties`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  messageStoreEntryAttachmentPropertiesAttachmentIdMessageStoreEntryAttachmentIdNameName = {
    /**
     * @description You can use the following request to get attachment properties of a message store entry for specified attachment Id and property name.<br> In API sandbox the integration flow '__Integration Flow with MessageStore - COMPLETED PROCESSING__' creates the corresponding message processing logs with message store entries and attachments.
     *
     * @tags Entry Attachment Properties
     * @name MessageStoreEntryAttachmentPropertiesAttachmentIdNameList
     * @summary Get attachment properties from message store by attachment Id and property name.
     * @request GET:/MessageStoreEntryAttachmentProperties(AttachmentId='{MessageStoreEntryAttachmentId}',Name='{Name}')
     * @secure
     */
    messageStoreEntryAttachmentPropertiesAttachmentIdNameList: (
      messageStoreEntryAttachmentId: string,
      name: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiMessageStoreEntryAttachmentProperty;
        },
        OdataError
      >({
        path: `/MessageStoreEntryAttachmentProperties(AttachmentId='${messageStoreEntryAttachmentId}',Name='${name}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  messageStoreEntryPropertiesMessageIdMessageStoreEntryIdNamePropertyName = {
    /**
     * @description You can use the following request to get property of message store entry for the specified entry Id and property name.<br> In API sandbox the integration flow '__Integration Flow with MessageStore - COMPLETED PROCESSING__' creates the corresponding message processing logs with message store entries and properties.
     *
     * @tags Entry Properties
     * @name MessageStoreEntryPropertiesMessageIdNameList
     * @summary Get property from message store by entry Id and property name.
     * @request GET:/MessageStoreEntryProperties(MessageId='{MessageStoreEntryID}',Name='{PropertyName}')
     * @secure
     */
    messageStoreEntryPropertiesMessageIdNameList: (
      messageStoreEntryId: string,
      propertyName: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiMessageStoreEntryProperty;
        },
        OdataError
      >({
        path: `/MessageStoreEntryProperties(MessageId='${messageStoreEntryId}',Name='${propertyName}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  jmsBrokersBroker1 = {
    /**
     * @description You can use the following request to get information on the JMS resources available on the tenant as well as on those actually used by your integration flows.<br> Additional information about response values for some attributes: * __IsTransactedSessionsHigh__: __0__ - enough transactions available __1__ - number of transactions exceeding the allowed limit * __IsConsumerHigh__: __0__ - enough consumer available __1__ - number of consumers exceeding the allowed limits * __IsProducersHigh__: __0__ - enough producers available __1__ - number of producers exceeding the allowed limit
     *
     * @tags JMS Resources
     * @name JmsBrokersBroker1List
     * @summary Get available resources of JMS queues.
     * @request GET:/JmsBrokers('Broker1')
     * @secure
     */
    jmsBrokersBroker1List: (
      query?: {
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: ("QueueStates" | "InactiveQueues")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiJmsBrokerQueueStates, OdataError>({
        path: `/JmsBrokers('Broker1')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  numberRanges = {
    /**
     * @description You can use the following request to get the Number Range Objects available on the tenant.<br> There are two Number Ranges defined in API sandbox: '__NumberRange1__' and '__NumberRange2__'
     *
     * @tags Number Ranges
     * @name NumberRangesList
     * @summary Get available Number Ranges.
     * @request GET:/NumberRanges
     * @secure
     */
    numberRangesList: (params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiNumberRanges[];
          };
        },
        OdataError
      >({
        path: `/NumberRanges`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add a Number Range Object.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update integration flows.
     *
     * @tags Number Ranges
     * @name NumberRangesCreate
     * @summary Add a Number Range Object.
     * @request POST:/NumberRanges
     * @secure
     */
    numberRangesCreate: (NumberRanges: ComSapHciApiNumberRangesPut, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/NumberRanges`,
        method: "POST",
        body: NumberRanges,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  numberRangesObjectName = {
    /**
     * @description You can use the following request to get the Number Range Object by a name.<br> There are two Number Ranges defined in API sandbox: '__NumberRange1__' and '__NumberRange2__'
     *
     * @tags Number Ranges
     * @name NumberRangesList
     * @summary Get specific Number Range by it's name'.
     * @request GET:/NumberRanges('{objectName}')
     * @secure
     */
    numberRangesList: (objectName: string, params: RequestParams = {}) =>
      this.request<ComSapHciApiNumberRanges, OdataError>({
        path: `/NumberRanges('${objectName}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update a Number Range Object.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update integration flows.
     *
     * @tags Number Ranges
     * @name NumberRangesUpdate
     * @summary Update a Number Range Object.
     * @request PUT:/NumberRanges('{objectName}')
     * @secure
     */
    numberRangesUpdate: (objectName: string, NumberRanges: ComSapHciApiNumberRangesPut, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/NumberRanges('${objectName}')`,
        method: "PUT",
        body: NumberRanges,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete a Number Range Object.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update integration flows.
     *
     * @tags Number Ranges
     * @name NumberRangesDelete
     * @summary Delete a Number Range Object.
     * @request DELETE:/NumberRanges('{objectName}')
     * @secure
     */
    numberRangesDelete: (objectName: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/NumberRanges('${objectName}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  dataStores = {
    /**
     * @description You can use the following request to get the Data Stores available on the tenant.<br>
     *
     * @tags Data Stores
     * @name DataStoresList
     * @summary Get available Data Stores.
     * @request GET:/DataStores
     * @secure
     */
    dataStoresList: (
      query?: {
        /**
         * If this parameter is ```true``` only Data Stores with overdue messages are shown. If it is ```false``` or not available all Data Stores are shown.
         * @uniqueItems true
         */
        overdueonly?: ("true" | "false")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiDataStores[];
          };
        },
        OdataError
      >({
        path: `/DataStores`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  dataStoresDataStoreNameDataStoreNameIntegrationFlowIntegrationFlowIdTypeType = {
    /**
     * @description You can use the following request to get the Data Store by a name.<br>
     *
     * @tags Data Stores
     * @name DataStoresDataStoreNameIntegrationFlowTypeList
     * @summary Get specific Data Store by it's name'.
     * @request GET:/DataStores(DataStoreName='{DataStoreName}',IntegrationFlow='{IntegrationFlowId}',Type='{Type}')
     * @secure
     */
    dataStoresDataStoreNameIntegrationFlowTypeList: (
      dataStoreName: string,
      integrationFlowId: string,
      type: string[],
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiDataStores, OdataError>({
        path: `/DataStores(DataStoreName='${dataStoreName}',IntegrationFlow='${integrationFlowId}',Type='${type}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to delete a Data Store.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete Data Stores.
     *
     * @tags Data Stores
     * @name DataStoresDataStoreNameIntegrationFlowTypeDelete
     * @summary Delete a Data Store.
     * @request DELETE:/DataStores(DataStoreName='{DataStoreName}',IntegrationFlow='{IntegrationFlowId}',Type='{Type}')
     * @secure
     */
    dataStoresDataStoreNameIntegrationFlowTypeDelete: (
      dataStoreName: string,
      integrationFlowId: string,
      type: string[],
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/DataStores(DataStoreName='${dataStoreName}',IntegrationFlow='${integrationFlowId}',Type='${type}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description You can use the following request to get al Data Store entries for a specific Data Store available on the tenant.<br>
     *
     * @tags Data Stores
     * @name EntriesList
     * @summary Get all Data Store entries for a specific Data Store.
     * @request GET:/DataStores(DataStoreName='{DataStoreName}',IntegrationFlow='{IntegrationFlowId}',Type='{Type}')/Entries
     * @secure
     */
    entriesList: (
      dataStoreName: string,
      integrationFlowId: string,
      type: string[],
      query?: {
        /**
         * If this parameter is ```true``` only Data Store entries with overdue messages are shown. If it is ```false``` or not available all Data Store entries are shown.
         * @uniqueItems true
         */
        overdueonly?: ("true" | "false")[];
        /**
         * Shows all Data Store Entries with the mpl id
         * @uniqueItems true
         */
        messageid?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiDataStoreEntries[];
          };
        },
        OdataError
      >({
        path: `/DataStores(DataStoreName='${dataStoreName}',IntegrationFlow='${integrationFlowId}',Type='${type}')/Entries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  dataStoreEntries = {
    /**
     * @description You can use the following request to get all Data Store entries available on the tenant.<br>
     *
     * @tags Data Stores
     * @name DataStoreEntriesList
     * @summary Get all Data Store entries.
     * @request GET:/DataStoreEntries
     * @secure
     */
    dataStoreEntriesList: (
      query?: {
        /**
         * If this parameter is ```true``` only Data Store entries with overdue messages are shown. If it is ```false``` or not available all Data Store entries are shown.
         * @uniqueItems true
         */
        overdueonly?: ("true" | "false")[];
        /**
         * Shows all Data Store Entries with the mpl id
         * @uniqueItems true
         */
        messageid?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiDataStoreEntries[];
          };
        },
        OdataError
      >({
        path: `/DataStoreEntries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  dataStoreEntriesIdIdDataStoreNameDataStoreNameIntegrationFlowIntegrationFlowIdTypeType = {
    /**
     * @description You can use the following request to get a Data Store entry.<br>
     *
     * @tags Data Stores
     * @name DataStoreEntriesIdDataStoreNameIntegrationFlowTypeList
     * @summary Get specific Data Store entry by it's Id'.
     * @request GET:/DataStoreEntries(Id='{Id}',DataStoreName='{DataStoreName}',IntegrationFlow='{IntegrationFlowId}',Type='{Type}')
     * @secure
     */
    dataStoreEntriesIdDataStoreNameIntegrationFlowTypeList: (
      id: string,
      dataStoreName: string,
      integrationFlowId: string,
      type: string[],
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiDataStores, OdataError>({
        path: `/DataStoreEntries(Id='${id}',DataStoreName='${dataStoreName}',IntegrationFlow='${integrationFlowId}',Type='${type}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to delete a Data Store entry.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete Data Stores.
     *
     * @tags Data Stores
     * @name DataStoreEntriesIdDataStoreNameIntegrationFlowTypeDelete
     * @summary Delete a Data Store entry.
     * @request DELETE:/DataStoreEntries(Id='{Id}',DataStoreName='{DataStoreName}',IntegrationFlow='{IntegrationFlowId}',Type='{Type}')
     * @secure
     */
    dataStoreEntriesIdDataStoreNameIntegrationFlowTypeDelete: (
      id: string,
      dataStoreName: string,
      integrationFlowId: string,
      type: string[],
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/DataStoreEntries(Id='${id}',DataStoreName='${dataStoreName}',IntegrationFlow='${integrationFlowId}',Type='${type}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description You can use the following request to download a Data Store entry content.<br>
     *
     * @tags Data Stores
     * @name ValueList
     * @summary Download content of a specific Data Store entry by it's Id'.
     * @request GET:/DataStoreEntries(Id='{Id}',DataStoreName='{DataStoreName}',IntegrationFlow='{IntegrationFlowId}',Type='{Type}')/$value
     * @secure
     */
    valueList: (
      id: string,
      dataStoreName: string,
      integrationFlowId: string,
      type: string[],
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/DataStoreEntries(Id='${id}',DataStoreName='${dataStoreName}',IntegrationFlow='${integrationFlowId}',Type='${type}')/$value`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  variables = {
    /**
     * @description You can use the following request to get all Variables entries available on the tenant.<br>
     *
     * @tags Variables
     * @name VariablesList
     * @summary Get all Variables entries.
     * @request GET:/Variables
     * @secure
     */
    variablesList: (params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiVariables[];
          };
        },
        OdataError
      >({
        path: `/Variables`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  variablesVariableNameVariableNameIntegrationFlowIntegrationFlowId = {
    /**
     * @description You can use the following request to get the Variable by a name.<br>
     *
     * @tags Variables
     * @name VariablesVariableNameIntegrationFlowList
     * @summary Get specific Variable by it's name'.
     * @request GET:/Variables(VariableName='{VariableName}',IntegrationFlow='{IntegrationFlowId}')
     * @secure
     */
    variablesVariableNameIntegrationFlowList: (
      variableName: string,
      integrationFlowId: string,
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiVariables, OdataError>({
        path: `/Variables(VariableName='${variableName}',IntegrationFlow='${integrationFlowId}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to delete a Variable.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete Variables.
     *
     * @tags Variables
     * @name VariablesVariableNameIntegrationFlowDelete
     * @summary Delete a Variable.
     * @request DELETE:/Variables(VariableName='{VariableName}',IntegrationFlow='{IntegrationFlowId}')
     * @secure
     */
    variablesVariableNameIntegrationFlowDelete: (
      variableName: string,
      integrationFlowId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/Variables(VariableName='${variableName}',IntegrationFlow='${integrationFlowId}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description You can use the following request to get the content of a Variable by a name.<br>
     *
     * @tags Variables
     * @name ValueList
     * @summary Downlaod Variable's content by it's name'.
     * @request GET:/Variables(VariableName='{VariableName}',IntegrationFlow='{IntegrationFlowId}')/$value
     * @secure
     */
    valueList: (variableName: string, integrationFlowId: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/Variables(VariableName='${variableName}',IntegrationFlow='${integrationFlowId}')/$value`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
}
