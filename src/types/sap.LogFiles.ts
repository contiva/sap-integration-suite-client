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

/** AuditLog */
export interface ComSapHciApiAuditLog {
  ChangeId?: string | null;
  Action?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04Z"
   */
  Timestamp?: string | null;
  UserName?: string | null;
  ObjName?: string | null;
  ObjType?: string | null;
  Source?: string | null;
  NodeType?: string | null;
  UserType?: string | null;
  CustomerVisible?: string | null;
}

/** LogFileArchive */
export interface ComSapHciApiLogFileArchive {
  Scope?: string | null;
  LogFileType?: string | null;
  NodeScope?: string | null;
  ContentType?: string | null;
}

/** LogFile */
export interface ComSapHciApiLogFile {
  Name?: string | null;
  Application?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04Z"
   */
  LastModified?: string | null;
  ContentType?: string | null;
  LogFileType?: string | null;
  NodeScope?: string | null;
  /** @format int64 */
  Size?: number | null;
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
 * @title Log Files
 * @version 1.0.0
 * @baseUrl https://{Account Short Name}-tmn.{SSL Host}.{landscapehost}/api/v1
 * @externalDocs https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/93bc3722533741c7a48eec6a8352f060.html
 *
 * HTTP log files enables you to access technical system logs written during message processing on the runtime node. HTTP log files contain information on authentication and authorization errors for inbound HTTP communication. The trace log files contain processing information including message payload data.
 * This API is implemented based on OData version 2 specification.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  logFileArchives = {
    /**
     * @description You can use the following request to get all log file collections.
     *
     * @tags Log File Archives
     * @name LogFileArchivesList
     * @summary Get all log file collections.
     * @request GET:/LogFileArchives
     * @secure
     */
    logFileArchivesList: (params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiLogFileArchive[];
          };
        },
        OdataError
      >({
        path: `/LogFileArchives`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logFileArchivesScopeScopeLogFileTypeLogFileTypeNodeScopeWorker = {
    /**
     * @description You can use the following request to get log file collections for a scope and type in a compressed file (zip format), which could be downloaded via OData $value option.
     *
     * @tags Log File Archives
     * @name LogFileArchivesScopeLogFileTypeNodeScopeWorkerList
     * @summary Get log file collections by scope and type in a compressed file.
     * @request GET:/LogFileArchives(Scope='{Scope}',LogFileType='{LogFileType}',NodeScope='worker')
     * @secure
     */
    logFileArchivesScopeLogFileTypeNodeScopeWorkerList: (
      scope: ("all" | "latest")[],
      logFileType: ("http" | "trace")[],
      query?: {
        /**
         * Time after which the log files were modified<br>
         * Expected date format: yyyy-MM-dd'T'HH:mm:ss'Z'<br>
         * Example: ```2017-04-13T15:51:04Z```
         */
        ModifiedAfter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiLogFileArchive[];
          };
        },
        OdataError
      >({
        path: `/LogFileArchives(Scope='${scope}',LogFileType='${logFileType}',NodeScope='worker')`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to download log file collections for a scope and type in a compressed file (zip format).
     *
     * @tags Log File Archives
     * @name ValueList
     * @summary Download log file collections.
     * @request GET:/LogFileArchives(Scope='{Scope}',LogFileType='{LogFileType}',NodeScope='worker')/$value
     * @secure
     */
    valueList: (
      scope: ("all" | "latest")[],
      logFileType: ("http" | "trace")[],
      query?: {
        /**
         * Time after which the log files were modified<br>
         * Expected date format: yyyy-MM-dd'T'HH:mm:ss'Z'<br>
         * Example: ```2017-04-13T15:51:04Z```
         */
        ModifiedAfter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, OdataError>({
        path: `/LogFileArchives(Scope='${scope}',LogFileType='${logFileType}',NodeScope='worker')/$value`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  logFiles = {
    /**
     * @description You can use the following request to get all log files.
     *
     * @tags Log Files
     * @name LogFilesList
     * @summary Get all log files.
     * @request GET:/LogFiles
     * @secure
     */
    logFilesList: (
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
         * Filter items by property values.<br>
         * Examples:
         * * ```NodeScope eq 'worker'```
         * * ```LogFileType eq 'http'```
         * * ```LogFileType eq 'trace'```
         * * ```NodeScope eq 'worker' and LogFileType eq 'http'```
         */
        $filter?: string;
        /**
         * Order items by property values.
         * @uniqueItems true
         */
        $orderby?: (
          | "Name"
          | "Name desc"
          | "Application"
          | "Application desc"
          | "LastModified"
          | "LastModified desc"
          | "ContentType"
          | "ContentType desc"
          | "LogFileType"
          | "LogFileType desc"
          | "NodeScope"
          | "NodeScope desc"
        )[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Name" | "Application" | "LastModified" | "ContentType" | "LogFileType" | "NodeScope")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiLogFile[];
          };
        },
        OdataError
      >({
        path: `/LogFiles`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logFilesNameNameApplicationApplication = {
    /**
     * @description You can use the following request to get log file by name and application, which could be downloaded via OData $value option.
     *
     * @tags Log Files
     * @name LogFilesNameApplicationList
     * @summary Get log files by name and application.
     * @request GET:/LogFiles(Name='{Name}',Application='{Application}')
     * @secure
     */
    logFilesNameApplicationList: (name: string, application: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiLogFile[];
          };
        },
        OdataError
      >({
        path: `/LogFiles(Name='${name}',Application='${application}')`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to download log file by name and application.
     *
     * @tags Log Files
     * @name ValueList
     * @summary Download log file.
     * @request GET:/LogFiles(Name='{Name}',Application='{Application}')/$value
     * @secure
     */
    valueList: (name: string, application: string, params: RequestParams = {}) =>
      this.request<File, OdataError>({
        path: `/LogFiles(Name='${name}',Application='${application}')/$value`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
