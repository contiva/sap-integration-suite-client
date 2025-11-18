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

export type ComSapHciApiUserCredentialParameter = ComSapHciApiParameter & {
  /** @maxLength 200 */
  User?: string;
  /**
   * @maxLength 200
   * @example ""
   */
  Password?: string | null;
};

export type ComSapHciApiUserCredentialParameterCreate =
  ComSapHciApiParameterCreate & {
    /** @maxLength 200 */
    User?: string;
    /**
     * @maxLength 200
     * @example "password"
     */
    Password?: string | null;
  };

export type ComSapHciApiStringParameter = ComSapHciApiParameter & {
  /** @maxLength 4000 */
  Value?: string;
  /** @maxLength 150 */
  LastModifiedBy?: string | null;
};

export type ComSapHciApiStringParameterCreate = ComSapHciApiParameterCreate & {
  /** @maxLength 4000 */
  Value?: string;
};

/** StringParameter (for update) */
export interface ComSapHciApiStringParameterUpdate {
  /** @maxLength 4000 */
  Value?: string;
}

export type ComSapHciApiStringConfigurationParameter =
  ComSapHciApiConfigurationParameter & {
    /** @maxLength 1500 */
    Value?: string;
  };

export type ComSapHciApiStringConfigurationParameterCreate =
  ComSapHciApiConfigurationParameterCreate & {
    /** @maxLength 1500 */
    Value?: string;
  };

export type ComSapHciApiStringConfigurationParameterUpdate =
  ComSapHciApiConfigurationParameterUpdate & {
    /** @maxLength 1500 */
    Value?: string;
  };

/** AlternativePartner */
export interface ComSapHciApiAlternativePartner {
  /** @maxLength 480 */
  Hexagency?: string;
  /** @maxLength 480 */
  Hexscheme?: string;
  /** @maxLength 240 */
  Hexid?: string;
  /** @maxLength 120 */
  Agency?: string;
  /** @maxLength 120 */
  Scheme?: string;
  /** @maxLength 60 */
  Id?: string;
  /** @maxLength 60 */
  Pid?: string;
  /** @maxLength 150 */
  LastModifiedBy?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  LastModifiedTime?: string | null;
  /** @maxLength 150 */
  CreatedBy?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  CreatedTime?: string | null;
}

/** AlternativePartner (for create) */
export interface ComSapHciApiAlternativePartnerCreate {
  /** @maxLength 120 */
  Agency?: string;
  /** @maxLength 120 */
  Scheme?: string;
  /** @maxLength 60 */
  Id?: string;
  /** @maxLength 60 */
  Pid?: string;
}

/** AlternativePartner (for update) */
export interface ComSapHciApiAlternativePartnerUpdate {
  /** @maxLength 60 */
  Pid?: string;
}

export type ComSapHciApiBinaryParameter = ComSapHciApiParameter & {
  /** @maxLength 300 */
  ContentType?: string;
  /**
   * @format base64url
   * @maxLength 262144
   */
  Value?: string;
};

export type ComSapHciApiBinaryParameterCreate = ComSapHciApiParameterCreate & {
  /** @maxLength 300 */
  ContentType?: string;
  /**
   * @format base64url
   * @maxLength 262144
   */
  Value?: string;
};

/** BinaryParameter (for update) */
export interface ComSapHciApiBinaryParameterUpdate {
  /** @maxLength 300 */
  ContentType?: string;
  /**
   * @format base64url
   * @maxLength 262144
   */
  Value?: string;
}

/** Partner */
export interface ComSapHciApiPartner {
  /** @maxLength 60 */
  Pid?: string;
}

/** AuthorizedUser */
export interface ComSapHciApiAuthorizedUser {
  /** @maxLength 150 */
  User?: string;
  /** @maxLength 60 */
  Pid?: string;
  /** @maxLength 150 */
  LastModifiedBy?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  LastModifiedTime?: string | null;
  /** @maxLength 150 */
  CreatedBy?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  CreatedTime?: string | null;
}

/** AuthorizedUser (for create) */
export interface ComSapHciApiAuthorizedUserCreate {
  /** @maxLength 150 */
  User?: string;
  /** @maxLength 60 */
  Pid?: string;
}

/** AuthorizedUser (for update) */
export interface ComSapHciApiAuthorizedUserUpdate {
  /** @maxLength 60 */
  Pid?: string;
}

/** ConfigurationParameter */
export interface ComSapHciApiConfigurationParameter {
  /** @maxLength 90 */
  Name?: string;
  /** @maxLength 150 */
  Namespace?: string;
  /** @maxLength 150 */
  LastModifiedBy?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  LastModifiedTime?: string | null;
  /** @maxLength 150 */
  CreatedBy?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  CreatedTime?: string | null;
}

/** ConfigurationParameter (for create) */
export interface ComSapHciApiConfigurationParameterCreate {
  /** @maxLength 90 */
  Name?: string;
  /** @maxLength 150 */
  Namespace?: string;
}

/** ConfigurationParameter (for update) */
export interface ComSapHciApiConfigurationParameterUpdate {
  /** @maxLength 90 */
  Name?: string;
  /** @maxLength 150 */
  Namespace?: string;
}

/** Parameter */
export interface ComSapHciApiParameter {
  /** @maxLength 60 */
  Pid?: string;
  /** @maxLength 1500 */
  Id?: string;
  /** @maxLength 150 */
  LastModifiedBy?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  LastModifiedTime?: string | null;
  /** @maxLength 150 */
  CreatedBy?: string | null;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  CreatedTime?: string | null;
}

/** Parameter (for create) */
export interface ComSapHciApiParameterCreate {
  /** @maxLength 60 */
  Pid?: string;
  /** @maxLength 1500 */
  Id?: string;
}

/** Parameter (for update) */
export interface ComSapHciApiParameterUpdate {
  /** @maxLength 60 */
  Pid?: string;
  /** @maxLength 1500 */
  Id?: string;
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

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string =
    "https://{Account Short Name}-tmn.{SSL Host}.{landscapehost}/api/v1";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

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
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
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
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
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

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
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

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
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
 * @title Partner Directory
 * @version 1.0.0
 * @baseUrl https://{Account Short Name}-tmn.{SSL Host}.{landscapehost}/api/v1
 * @externalDocs https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/0fe80dc9d3be4dfbbb89ee4c791d326e.html
 *
 * Partner Directory enables you to get, write or delete data. This component contains information on partners that are connected to a tenant in the context of a larger network. Information stored in the Partner Directory can be used to parameterize integration flows.
 * This API is implemented based on OData version 2 specification.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description You can use the following request to request the CSRF token for this session, which is required for write access via POST, PUT and DELETE operations. Copy the received X-CSRF-Token from the response header.<br> **In API sandbox this request is not relevant!**
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

  alternativePartners = {
    /**
     * @description You can use the following request to get all alternative partners.
     *
     * @tags Alternative Partners
     * @name AlternativePartnersList
     * @summary Get all alternative partners.
     * @request GET:/AlternativePartners
     * @secure
     */
    alternativePartnersList: (
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
        /** Filter items by property values. */
        $filter?: string;
        /**
         * Order items by property values
         * @uniqueItems true
         */
        $orderby?: (
          | "Hexagency"
          | "Hexagency desc"
          | "Hexscheme"
          | "Hexscheme desc"
          | "Hexid"
          | "Hexid desc"
          | "Agency"
          | "Agency desc"
          | "Scheme"
          | "Scheme desc"
          | "Id"
          | "Id desc"
          | "Pid"
          | "Pid desc"
          | "LastModifiedBy"
          | "LastModifiedBy desc"
          | "LastModifiedTime"
          | "LastModifiedTime desc"
          | "CreatedBy"
          | "CreatedBy desc"
          | "CreatedTime"
          | "CreatedTime desc"
        )[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Hexagency"
          | "Hexscheme"
          | "Hexid"
          | "Agency"
          | "Scheme"
          | "Id"
          | "Pid"
          | "LastModifiedBy"
          | "LastModifiedTime"
          | "CreatedBy"
          | "CreatedTime"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiAlternativePartner[];
          };
        },
        OdataError
      >({
        path: `/AlternativePartners`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add new alternative partner.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags Alternative Partners
     * @name AlternativePartnersCreate
     * @summary Add new alternative partner.
     * @request POST:/AlternativePartners
     * @secure
     */
    alternativePartnersCreate: (
      AlternativePartner: ComSapHciApiAlternativePartnerCreate,
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiAlternativePartner, void | OdataError>({
        path: `/AlternativePartners`,
        method: "POST",
        body: AlternativePartner,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  alternativePartnersHexagencyHexagencyHexschemeHexschemeHexidHexid = {
    /**
     * @description You can use the following request to get an alternative partner by key fields.
     *
     * @tags Alternative Partners
     * @name AlternativePartnersHexagencyHexschemeHexidList
     * @summary Get alternative partner by key fields.
     * @request GET:/AlternativePartners(Hexagency='{Hexagency}',Hexscheme='{Hexscheme}',Hexid='{Hexid}')
     * @secure
     */
    alternativePartnersHexagencyHexschemeHexidList: (
      hexagency: string,
      hexscheme: string,
      hexid: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Agency"
          | "Scheme"
          | "Id"
          | "Pid"
          | "LastModifiedBy"
          | "LastModifiedTime"
          | "CreatedBy"
          | "CreatedTime"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiAlternativePartner;
        },
        OdataError
      >({
        path: `/AlternativePartners(Hexagency='${hexagency}',Hexscheme='${hexscheme}',Hexid='${hexid}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update alternative partner.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags Alternative Partners
     * @name AlternativePartnersHexagencyHexschemeHexidUpdate
     * @summary Update alternative partner.
     * @request PUT:/AlternativePartners(Hexagency='{Hexagency}',Hexscheme='{Hexscheme}',Hexid='{Hexid}')
     * @secure
     */
    alternativePartnersHexagencyHexschemeHexidUpdate: (
      hexagency: string,
      hexscheme: string,
      hexid: string,
      AlternativePartner: ComSapHciApiAlternativePartnerUpdate,
      params: RequestParams = {},
    ) =>
      this.request<any, void | OdataError>({
        path: `/AlternativePartners(Hexagency='${hexagency}',Hexscheme='${hexscheme}',Hexid='${hexid}')`,
        method: "PUT",
        body: AlternativePartner,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete alternative partner.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags Alternative Partners
     * @name AlternativePartnersHexagencyHexschemeHexidDelete
     * @summary Delete alternative partner.
     * @request DELETE:/AlternativePartners(Hexagency='{Hexagency}',Hexscheme='{Hexscheme}',Hexid='{Hexid}')
     * @secure
     */
    alternativePartnersHexagencyHexschemeHexidDelete: (
      hexagency: string,
      hexscheme: string,
      hexid: string,
      params: RequestParams = {},
    ) =>
      this.request<any, void | OdataError>({
        path: `/AlternativePartners(Hexagency='${hexagency}',Hexscheme='${hexscheme}',Hexid='${hexid}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  authorizedUsers = {
    /**
     * @description You can use the following request to get all authorized users.
     *
     * @tags Authorized Users
     * @name AuthorizedUsersList
     * @summary Get all authorized users.
     * @request GET:/AuthorizedUsers
     * @secure
     */
    authorizedUsersList: (
      query?: {
        /** User which initiates the call */
        user?: string;
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
        /** Filter items by property values. */
        $filter?: string;
        /**
         * Order items by property values.
         * @uniqueItems true
         */
        $orderby?: (
          | "User"
          | "User desc"
          | "Pid"
          | "Pid desc"
          | "LastModifiedBy"
          | "LastModifiedBy desc"
          | "LastModifiedTime"
          | "LastModifiedTime desc"
          | "CreatedBy"
          | "CreatedBy desc"
          | "CreatedTime"
          | "CreatedTime desc"
        )[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "User"
          | "Pid"
          | "LastModifiedBy"
          | "LastModifiedTime"
          | "CreatedBy"
          | "CreatedTime"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiAuthorizedUser[];
          };
        },
        OdataError
      >({
        path: `/AuthorizedUsers`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add new authorized user.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags Authorized Users
     * @name AuthorizedUsersCreate
     * @summary Add new authorized user.
     * @request POST:/AuthorizedUsers
     * @secure
     */
    authorizedUsersCreate: (
      AuthorizedUser: ComSapHciApiAuthorizedUserCreate,
      query?: {
        /** User which initiates the call */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiAuthorizedUser, void | OdataError>({
        path: `/AuthorizedUsers`,
        method: "POST",
        query: query,
        body: AuthorizedUser,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  authorizedUsersUser = {
    /**
     * @description You can use the following request to get an authorized user by key.
     *
     * @tags Authorized Users
     * @name AuthorizedUsersList
     * @summary Get authorized user by key.
     * @request GET:/AuthorizedUsers('{User}')
     * @secure
     */
    authorizedUsersList: (
      user: string,
      query?: {
        /** User which initiates the call */
        user?: string;
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Pid"
          | "LastModifiedBy"
          | "LastModifiedTime"
          | "CreatedBy"
          | "CreatedTime"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiAuthorizedUser;
        },
        OdataError
      >({
        path: `/AuthorizedUsers('${user}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update authorized user.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags Authorized Users
     * @name AuthorizedUsersUpdate
     * @summary Update authorized user.
     * @request PUT:/AuthorizedUsers('{User}')
     * @secure
     */
    authorizedUsersUpdate: (
      user: string,
      AuthorizedUser: ComSapHciApiAuthorizedUserUpdate,
      query?: {
        /** User which initiates the call */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, void | OdataError>({
        path: `/AuthorizedUsers('${user}')`,
        method: "PUT",
        query: query,
        body: AuthorizedUser,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete authorized users.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags Authorized Users
     * @name AuthorizedUsersDelete
     * @summary Delete authorized users.
     * @request DELETE:/AuthorizedUsers('{User}')
     * @secure
     */
    authorizedUsersDelete: (
      user: string,
      query?: {
        /** User which initiates the call */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, OdataError>({
        path: `/AuthorizedUsers('${user}')`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),
  };
  binaryParameters = {
    /**
     * @description You can use the following request to get all binary parameters.
     *
     * @tags Binary Parameters
     * @name BinaryParametersList
     * @summary Get all binary parameters.
     * @request GET:/BinaryParameters
     * @secure
     */
    binaryParametersList: (
      query?: {
        /** User which initiates the call */
        user?: string;
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
        /** Filter items by property values. */
        $filter?: string;
        /**
         * Order items by property values
         * @uniqueItems true
         */
        $orderby?: (
          | "ContentType"
          | "ContentType desc"
          | "Value"
          | "Value desc"
        )[];
        /**
         * Select properties to be returned
         * @uniqueItems true
         */
        $select?: ("ContentType" | "Value")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiBinaryParameter[];
          };
        },
        OdataError
      >({
        path: `/BinaryParameters`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add a new binary parameter.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags Binary Parameters
     * @name BinaryParametersCreate
     * @summary Add a new binary parameter.
     * @request POST:/BinaryParameters
     * @secure
     */
    binaryParametersCreate: (
      BinaryParameter: ComSapHciApiBinaryParameterCreate,
      query?: {
        /** User which initiates the call */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiBinaryParameter, void | OdataError>({
        path: `/BinaryParameters`,
        method: "POST",
        query: query,
        body: BinaryParameter,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  binaryParametersPidPidIdId = {
    /**
     * @description You can use the following request to get a binary parameter by key.
     *
     * @tags Binary Parameters
     * @name BinaryParametersPidIdList
     * @summary Get binary parameter by key
     * @request GET:/BinaryParameters(Pid='{Pid}',Id='{Id}')
     * @secure
     */
    binaryParametersPidIdList: (
      pid: string,
      id: string,
      query?: {
        /** User which initiates the call */
        user?: string;
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("ContentType" | "Value")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiBinaryParameter;
        },
        OdataError
      >({
        path: `/BinaryParameters(Pid='${pid}',Id='${id}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update binary parameter by key.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags Binary Parameters
     * @name BinaryParametersPidIdUpdate
     * @summary Update binary parameter by key.
     * @request PUT:/BinaryParameters(Pid='{Pid}',Id='{Id}')
     * @secure
     */
    binaryParametersPidIdUpdate: (
      pid: string,
      id: string,
      BinaryParameter: ComSapHciApiBinaryParameterUpdate,
      query?: {
        /** User which initiates the call */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, void | OdataError>({
        path: `/BinaryParameters(Pid='${pid}',Id='${id}')`,
        method: "PUT",
        query: query,
        body: BinaryParameter,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete binary parameter.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags Binary Parameters
     * @name BinaryParametersPidIdDelete
     * @summary Delete binary parameter.
     * @request DELETE:/BinaryParameters(Pid='{Pid}',Id='{Id}')
     * @secure
     */
    binaryParametersPidIdDelete: (
      pid: string,
      id: string,
      query?: {
        /** User which initiates the call */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, OdataError>({
        path: `/BinaryParameters(Pid='${pid}',Id='${id}')`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),
  };
  partners = {
    /**
     * @description You can use the following request to get all partners.
     *
     * @tags Partners
     * @name PartnersList
     * @summary Get all partners.
     * @request GET:/Partners
     * @secure
     */
    partnersList: (
      query?: {
        /** User which initiates the call */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiPartner[];
          };
        },
        OdataError
      >({
        path: `/Partners`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  partnersPid = {
    /**
     * @description You can use the following request to delete partner.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags Partners
     * @name PartnersDelete
     * @summary Delete partner.
     * @request DELETE:/Partners('{Pid}')
     * @secure
     */
    partnersDelete: (
      pid: string,
      query?: {
        /**
         * Exclude certain entity types from deletion
         * @uniqueItems false
         */
        exclude?: (
          | "AuthorizedUsers"
          | "AlternativePartners"
          | "BinaryParameters"
          | "StringParameters"
          | "UserCredentialParameters"
        )[];
        /** User which initiates the call */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, OdataError>({
        path: `/Partners('${pid}')`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),
  };
  stringParameters = {
    /**
     * @description You can use the following request to get all string parameters.
     *
     * @tags String Parameters
     * @name StringParametersList
     * @summary Get all string parameters.
     * @request GET:/StringParameters
     * @secure
     */
    stringParametersList: (
      query?: {
        /** User which initiates the call */
        user?: string;
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
        /** Filter items by property values. */
        $filter?: string;
        /**
         * Order items by property values.
         * @uniqueItems true
         */
        $orderby?: ("Value" | "Value desc")[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: "Value"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiStringParameter[];
          };
        },
        OdataError
      >({
        path: `/StringParameters`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add new string parameter.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags String Parameters
     * @name StringParametersCreate
     * @summary Add new string parameter.
     * @request POST:/StringParameters
     * @secure
     */
    stringParametersCreate: (
      StringParameter: ComSapHciApiStringParameterCreate,
      query?: {
        /** User which initiates the call */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiStringParameter, void | OdataError>({
        path: `/StringParameters`,
        method: "POST",
        query: query,
        body: StringParameter,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  stringParametersPidPidIdId = {
    /**
     * @description You can use the following request to get a string parameter by key.
     *
     * @tags String Parameters
     * @name StringParametersPidIdList
     * @summary Get string parameter by key.
     * @request GET:/StringParameters(Pid='{Pid}',Id='{Id}')
     * @secure
     */
    stringParametersPidIdList: (
      pid: string,
      id: string,
      query?: {
        /** User which initiates the call */
        user?: string;
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: "Value"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiStringParameter;
        },
        OdataError
      >({
        path: `/StringParameters(Pid='${pid}',Id='${id}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update string parameter.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags String Parameters
     * @name StringParametersPidIdUpdate
     * @summary Update string parameter.
     * @request PUT:/StringParameters(Pid='{Pid}',Id='{Id}')
     * @secure
     */
    stringParametersPidIdUpdate: (
      pid: string,
      id: string,
      StringParameter: ComSapHciApiStringParameterUpdate,
      query?: {
        /** User which initiates the call */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, OdataError>({
        path: `/StringParameters(Pid='${pid}',Id='${id}')`,
        method: "PUT",
        query: query,
        body: StringParameter,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete string parameter.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags String Parameters
     * @name StringParametersPidIdDelete
     * @summary Delete string parameter.
     * @request DELETE:/StringParameters(Pid='{Pid}',Id='{Id}')
     * @secure
     */
    stringParametersPidIdDelete: (
      pid: string,
      id: string,
      query?: {
        /** User which initiates the call */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, OdataError>({
        path: `/StringParameters(Pid='${pid}',Id='${id}')`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),
  };
  userCredentialParameters = {
    /**
     * @description You can use the following request to get all user credential parameters.
     *
     * @tags User Credential Parameters
     * @name UserCredentialParametersList
     * @summary Get all user credential parameters.
     * @request GET:/UserCredentialParameters
     * @secure
     */
    userCredentialParametersList: (
      query: {
        /** User which initiates the call */
        user?: string;
        /**
         * Filter is required for partner identifier (Pid) with equals operator (eq).<br>
         * Example: ```Pid eq 'Receiver_1'```
         * @default "Pid eq ''"
         */
        $filter: string;
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "Pid"
          | "User"
          | "CreatedBy"
          | "CreatedTime"
          | "LastModifiedBy"
          | "LastModifiedTime"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiUserCredentialParameter[];
          };
        },
        void | OdataError
      >({
        path: `/UserCredentialParameters`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add/update user credential parameter.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags User Credential Parameters
     * @name UserCredentialParametersCreate
     * @summary Add/update user credential parameter.
     * @request POST:/UserCredentialParameters
     * @secure
     */
    userCredentialParametersCreate: (
      UserCredentialParameter: ComSapHciApiUserCredentialParameterCreate,
      params: RequestParams = {},
    ) =>
      this.request<ComSapHciApiUserCredentialParameter, void | OdataError>({
        path: `/UserCredentialParameters`,
        method: "POST",
        body: UserCredentialParameter,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  userCredentialParametersPidPidIdId = {
    /**
     * @description You can use the following request to get user credential parameter by key.
     *
     * @tags User Credential Parameters
     * @name UserCredentialParametersPidIdList
     * @summary Get user credential parameter by key.
     * @request GET:/UserCredentialParameters(Pid='{Pid}',Id='{Id}')
     * @secure
     */
    userCredentialParametersPidIdList: (
      pid: string,
      id: string,
      query?: {
        /**
         * Select required hash format, if password should be returned.
         * @uniqueItems true
         */
        returnHashedPassword?: "SHA256"[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "User"
          | "Password"
          | "CreatedBy"
          | "CreatedTime"
          | "LastModifiedBy"
          | "LastModifiedTime"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiUserCredentialParameter;
        },
        OdataError
      >({
        path: `/UserCredentialParameters(Pid='${pid}',Id='${id}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to delete user credential parameter.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update the partner directory.
     *
     * @tags User Credential Parameters
     * @name UserCredentialParametersPidIdDelete
     * @summary Delete user credential parameter.
     * @request DELETE:/UserCredentialParameters(Pid='{Pid}',Id='{Id}')
     * @secure
     */
    userCredentialParametersPidIdDelete: (
      pid: string,
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<any, OdataError>({
        path: `/UserCredentialParameters(Pid='${pid}',Id='${id}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
