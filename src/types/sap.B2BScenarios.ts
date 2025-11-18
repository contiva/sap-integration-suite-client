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

/** OrphanedInterchange */
export interface ComSapHciApiOrphanedInterchange {
  Id?: string | null;
  AdapterType?: string | null;
  Date?: string | null;
  ProcessingStatus?: string | null;
}

/** BusinessDocument */
export interface ComSapHciApiBusinessDocument {
  Id?: string | null;
  SenderMessageType?: string | null;
  SenderGroupControlNumber?: string | null;
  SenderDocumentStandard?: string | null;
  SenderInterchangeControlNumber?: string | null;
  SenderMessageNumber?: string | null;
  SenderTradingPartnerName?: string | null;
  SenderSystemId?: string | null;
  SenderAdapterType?: string | null;
  SenderCommunicationPartnerName?: string | null;
  ReceiverMessageType?: string | null;
  ReceiverGroupControlNumber?: string | null;
  ReceiverDocumentStandard?: string | null;
  ReceiverInterchangeControlNumber?: string | null;
  ReceiverMessageNumber?: string | null;
  ReceiverSystemId?: string | null;
  ReceiverAdapterType?: string | null;
  ReceiverTradingPartnerName?: string | null;
  ReceiverCommunicationPartnerName?: string | null;
  AgreedSenderIdentiferAtSenderSide?: string | null;
  AgreedSenderIdentiferQualifierAtSenderSide?: string | null;
  AgreedReceiverIdentiferAtSenderSide?: string | null;
  AgreedReceiverIdentiferQualifierAtSenderSide?: string | null;
  AgreedSenderIdentiferAtReceiverSide?: string | null;
  AgreedSenderIdentiferQualifierAtReceiverSide?: string | null;
  AgreedReceiverIdentiferAtReceiverSide?: string | null;
  AgreedReceiverIdentiferQualifierAtReceiverSide?: string | null;
  Bulk?: string | null;
  TransactionDocumentType?: string | null;
  ProcessingStatus?: string | null;
  ReceiverFunctionalAckStatus?: string | null;
  ReceiverTechnicalAckStatus?: string | null;
  OverallStatus?: string | null;
  StartedAt?: string | null;
  EndedAt?: string | null;
  DocumentCreationTime?: string | null;
  TechnicalAckDueTime?: string | null;
  FunctionalAckDueTime?: string | null;
  ResendAllowed?: string | null;
  RetryAllowed?: string | null;
  AgreementTypeName?: string | null;
  TransactionTypeName?: string | null;
  ArchivingStatus?: string | null;
  InterchangeName?: string | null;
  InterchangeDirection?: string | null;
  TransactionActivityType?: string | null;
}

/** ErrorDetail */
export interface ComSapHciApiErrorDetail {
  Id?: string | null;
  ErrorInformation?: string | null;
  ErrorCategory?: string | null;
  IsTransientError?: string | null;
}

/** TechnicalAcknowledgement */
export interface ComSapHciApiTechnicalAcknowledgement {
  Id?: string | null;
  Type?: string | null;
  Direction?: string | null;
  PayloadId?: string | null;
  Status?: string | null;
  PayloadContainerContentType?: string | null;
  PayloadContentType?: string | null;
}

/** TechnicalAcknowledgement */
export interface ComSapHciApiFunctionalAcknowledgement {
  Id?: string | null;
  PayloadId?: string | null;
  PayloadContainerContentType?: string | null;
  PayloadContentType?: string | null;
  DocumentId?: string | null;
  MessageType?: string | null;
  DocumentStandard?: string | null;
  Direction?: string | null;
  Status?: string | null;
  TransmissionStatus?: string | null;
  TransmissionErrorInformation?: string | null;
  TransmissionHttpCode?: number | null;
}

/** BusinessDocumentProcessingEvent */
export interface ComSapHciApiBusinessDocumentProcessingEvent {
  Id?: string | null;
  EventType?: string | null;
  Date?: string | null;
  MonitoringType?: string | null;
  MonitoringId?: string | null;
}

/** BusinessDocumentProtocolHeaders */
export interface ComSapHciApiBusinessDocumentProtocolHeader {
  Id?: string | null;
  Name?: string | null;
  Value?: string | null;
}

/** BusinessDocumentPayload */
export interface ComSapHciApiBusinessDocumentPayload {
  Id?: string | null;
  ProcessingState?: string | null;
  Direction?: string | null;
  PayloadId?: string | null;
  PayloadContainerContentType?: string | null;
  PayloadContentType?: string | null;
  ArchivingRelevant?: string | null;
}

/** BusinessDocumentNote */
export interface ComSapHciApiBusinessDocumentNote {
  Id?: string | null;
  UserId?: string | null;
  CreateTimeStamp?: string | null;
  Text?: string | null;
  Type?: string | null;
}

/** CustomObjects */
export interface ComSapHciApiCustomObjects {
  Id?: string | null;
  SearchFieldValue1?: string | null;
  SearchFieldValue2?: string | null;
  SearchFieldValue3?: string | null;
  SearchFieldValue4?: string | null;
  SearchFieldValue5?: string | null;
  SearchFieldValue6?: string | null;
  SearchFieldValue7?: string | null;
  SearchFieldValue8?: string | null;
  SearchFieldValue9?: string | null;
  SearchFieldValue10?: string | null;
}

/** BusinessDocumentExtFields */
export interface ComSapHciApiBusinessDocumentExtFields {
  Id?: string | null;
}

/** B2BArchivingKeyPerformanceIndicators */
export interface ComSapHciApiB2BArchivingKeyPerformanceIndicators {
  RunStart?: string | null;
  RunDurationInMinutes?: string | null;
  DataCollectionDurationInMinutes?: string | null;
  DataCompressionDurationInMinutes?: string | null;
  DataUploadDurationInMinutes?: string | null;
  DocumentsToBeArchived?: string | null;
  DocumentsArchived?: string | null;
  DocumentsArchivingFailed?: string | null;
  DocumentsArchivedUntilDate?: string | null;
  DateOfOldestDocumentToBeArchivedAfterRun?: string | null;
  DataUploadedInMb?: string | null;
  RunStatus?: string | null;
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
    "https://{Account Short Name}-tmn.{SSL Host}.{Landscapehost}/api/v1";
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
 * @title B2B Scenarios
 * @version 1.0.0
 * @baseUrl https://{Account Short Name}-tmn.{SSL Host}.{Landscapehost}/api/v1
 * @externalDocs https://help.sap.com/docs/cloud-integration/sap-cloud-integration/api-details
 *
 * The B2B Scenarios OData API is used to access data related to inter-enterprise business integration scenarios.
 *  With this API, you can securely query business documents, thereby supporting efficient data exchange and business process collaboration between enterprises.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  orphanedInterchanges = {
    /**
     * @description Retrieve a list of all orphaned interchanges available in the system. This endpoint supports filtering, ordering, and selecting specific properties.
     *
     * @tags Orphaned Interchanges
     * @name OrphanedInterchangesList
     * @summary Get all orphaned interchanges.
     * @request GET:/OrphanedInterchanges
     * @secure
     */
    orphanedInterchangesList: (
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
         *  For any Id filter use only the 'eq' operator.<br>
         * Example: ```LastErrorDetails/ErrorCategory eq 'MESSAGE_DECRYPTION'``` returns the number of interchange documents with error category 'MESSAGE_DECRYPTION'
         */
        $filter?: string;
        /**
         * Order items by property values.
         * @uniqueItems true
         */
        $orderby?: ("Date" | "Date desc")[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "AdapterType" | "Date")[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: (
          | "BusinessDocumentProtocolHeaders"
          | "BusinessDocumentProcessingEvent"
          | "BusinessDocumentPayloads"
          | "ErrorDetails"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiOrphanedInterchange[];
          };
        },
        OdataError
      >({
        path: `/OrphanedInterchanges`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get number of all unassigned interchange documents.
     *
     * @tags Orphaned Interchanges
     * @name CountList
     * @summary Get number of all unassigned interchange documents.
     * @request GET:/OrphanedInterchanges/$count
     * @secure
     */
    countList: (params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/OrphanedInterchanges/$count`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  orphanedInterchangesId = {
    /**
     * @description You can use the following request to get unassigned interchange document by Guid.
     *
     * @tags Orphaned Interchanges
     * @name OrphanedInterchangesList
     * @summary Get unassigned interchange document by Guid.
     * @request GET:/OrphanedInterchanges('{Id}')
     * @secure
     */
    orphanedInterchangesList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "AdapterType" | "Date")[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: (
          | "BusinessDocumentProtocolHeaders"
          | "BusinessDocumentProcessingEvent"
          | "BusinessDocumentPayloads"
          | "ErrorDetails"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiOrphanedInterchange[];
          };
        },
        OdataError
      >({
        path: `/OrphanedInterchanges('${id}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get unassigned interchange document's error detail by Guid.
     *
     * @tags Orphaned Interchanges
     * @name ErrorDetailsList
     * @summary Get unassigned interchange document's error detail by Guid.
     * @request GET:/OrphanedInterchanges('{Id}')/ErrorDetails
     * @secure
     */
    errorDetailsList: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiErrorDetail[];
          };
        },
        OdataError
      >({
        path: `/OrphanedInterchanges('${id}')/ErrorDetails`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get unassigned interchange document's processing event by Guid.
     *
     * @tags Orphaned Interchanges
     * @name BusinessDocumentProcessingEventList
     * @summary Get unassigned interchange document's processing event by Guid.
     * @request GET:/OrphanedInterchanges('{Id}')/BusinessDocumentProcessingEvent
     * @secure
     */
    businessDocumentProcessingEventList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "EventType"
          | "Date"
          | "MonitoringType"
          | "MonitoringId"
        )[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: (
          | "BusinessDocument"
          | "FunctionalAcknowledgement"
          | "BusinessDocumentPayload"
          | "ErrorDetails"
          | "BusinessDocumentNotes"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiBusinessDocumentProcessingEvent[];
          };
        },
        OdataError
      >({
        path: `/OrphanedInterchanges('${id}')/BusinessDocumentProcessingEvent`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get unassigned interchange document's payload by Guid.
     *
     * @tags Orphaned Interchanges
     * @name BusinessDocumentPayloadsList
     * @summary Get unassigned interchange document's payload by Guid.
     * @request GET:/OrphanedInterchanges('{Id}')/BusinessDocumentPayloads
     * @secure
     */
    businessDocumentPayloadsList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "PayloadId"
          | "PayloadContainerContentType"
          | "PayloadContentType"
          | "ArchivingRelevant"
        )[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: ("BusinessDocument" | "BusinessDocumentProcessingEvent")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiBusinessDocumentPayload[];
          };
        },
        OdataError
      >({
        path: `/OrphanedInterchanges('${id}')/BusinessDocumentPayloads`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get unassigned interchange document's protocol headers by Guid.
     *
     * @tags Orphaned Interchanges
     * @name BusinessDocumentProtocolHeadersList
     * @summary Get unassigned interchange document's protocol headers by Guid.
     * @request GET:/OrphanedInterchanges('{Id}')/BusinessDocumentProtocolHeaders
     * @secure
     */
    businessDocumentProtocolHeadersList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "Name" | "Value")[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: ("BusinessDocument" | "OrphanedInterchange")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiBusinessDocumentProtocolHeader[];
          };
        },
        OdataError
      >({
        path: `/OrphanedInterchanges('${id}')/BusinessDocumentProtocolHeaders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  businessDocuments = {
    /**
     * @description Retrieve a list of all inter-enterprise business documents available in the system. This endpoint supports filtering, ordering, and selecting specific properties.
     *
     * @tags Business Documents
     * @name BusinessDocumentsList
     * @summary Get all interchange documents.
     * @request GET:/BusinessDocuments
     * @secure
     */
    businessDocumentsList: (
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
         * Example: ```Status eq 'FAILED'``` returns document with status 'FAILED'.<br>
         * IntegrationFlowName is deprecated. In queries filtering for IntegrationFlowName, this will be substituted automatically by IntegrationFlow/Id
         */
        $filter?: string;
        /**
         * Order items by property values.<br>
         * IntegrationFlowName is deprecated.
         * @uniqueItems true
         */
        $orderby?: ("DocumentCreationTime" | "DocumentCreationTime desc")[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "SenderMessageType")[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: (
          | "BusinessDocumentRelations"
          | "BusinessDocumentProcessingEvents"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiBusinessDocument[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get number of all interchange documents.
     *
     * @tags Business Documents
     * @name CountList
     * @summary Get number of all interchange documents.
     * @request GET:/BusinessDocuments/$count
     * @secure
     */
    countList: (params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/BusinessDocuments/$count`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  businessDocumentsId = {
    /**
     * @description You can use the following request to get interchange document by message Guid.
     *
     * @tags Business Documents
     * @name BusinessDocumentsList
     * @summary Get interchange document by message Guid.
     * @request GET:/BusinessDocuments('{Id}')
     * @secure
     */
    businessDocumentsList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "SenderMessageType"
          | "SenderGroupControlNumber"
          | "SenderDocumentStandard"
          | "SenderInterchangeControlNumber"
          | "SenderMessageNumber"
          | "SenderTradingPartnerName"
          | "SenderSystemId"
          | "SenderAdapterType"
          | "SenderCommunicationPartnerName"
          | "ReceiverMessageType"
          | "ReceiverGroupControlNumber"
          | "ReceiverDocumentStandard"
          | "ReceiverInterchangeControlNumber"
          | "ReceiverMessageNumber"
          | "ReceiverSystemId"
          | "ReceiverAdapterType"
          | "ReceiverTradingPartnerName"
          | "ReceiverCommunicationPartnerName"
          | "AgreedSenderIdentiferAtSenderSide"
          | "AgreedSenderIdentiferQualifierAtSenderSide"
          | "AgreedReceiverIdentiferAtSenderSide"
          | "AgreedReceiverIdentiferQualifierAtSenderSide"
          | "AgreedSenderIdentiferAtReceiverSide"
          | "AgreedSenderIdentiferQualifierAtReceiverSide"
          | "AgreedReceiverIdentiferAtReceiverSide"
          | "AgreedReceiverIdentiferQualifierAtReceiverSide"
          | "Bulk"
          | "TransactionDocumentType"
          | "ProcessingStatus"
          | "ReceiverFunctionalAckStatus"
          | "ReceiverTechnicalAckStatus"
          | "OverallStatus"
          | "StartedAt"
          | "EndedAt"
          | "DocumentCreationTime"
          | "TechnicalAckDueTime"
          | "FunctionalAckDueTime"
          | "ResendAllowed"
          | "RetryAllowed"
          | "AgreementTypeName"
          | "TransactionTypeName"
          | "ArchivingStatus"
          | "InterchangeName"
          | "InterchangeDirection"
          | "TransactionActivityType"
        )[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: (
          | "BusinessDocumentRelations"
          | "BusinessDocumentProcessingEvents"
          | "BusinessDocumentPayloads"
          | "SenderTechnicalAcknowledgement"
          | "ReceiverTechnicalAcknowledgement"
          | "SenderFunctionalAcknowledgement"
          | "ReceiverFunctionalAcknowledgement"
          | "LastErrorDetails"
          | "CustomObjects"
          | "BusinessDocumentExtFields"
          | "BusinessDocumentNotes"
          | "BusinessDocumentProtocolHeaders"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiBusinessDocument;
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get interchange document's sender technical acknowledgement by Guid.
     *
     * @tags Sender Technical Acknowledgement
     * @name SenderTechnicalAcknowledgementList
     * @summary Get interchange document's sender technical acknowledgement by Guid.
     * @request GET:/BusinessDocuments('{Id}')/SenderTechnicalAcknowledgement
     * @secure
     */
    senderTechnicalAcknowledgementList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "Type"
          | "Direction"
          | "PayloadId"
          | "Status"
          | "PayloadContainerContentType"
          | "PayloadContentType"
        )[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: (
          | "BusinessDocumentProcessingEvent"
          | "BusinessDocument"
          | "FunctionalAcknowledgement"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiTechnicalAcknowledgement[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')/SenderTechnicalAcknowledgement`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get interchange document's sender functional acknowledgement by Guid.
     *
     * @tags Sender Functional Acknowledgement
     * @name SenderFunctionalAcknowledgementList
     * @summary Get interchange document's sender functional acknowledgement by Guid.
     * @request GET:/BusinessDocuments('{Id}')/SenderFunctionalAcknowledgement
     * @secure
     */
    senderFunctionalAcknowledgementList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "PayloadId"
          | "PayloadContainerContentType"
          | "PayloadContentType"
          | "DocumentId"
          | "MessageType"
          | "DocumentStandard"
          | "Direction"
          | "Status"
          | "TransmissionStatus"
          | "TransmissionErrorInformation"
          | "TransmissionHttpCode"
        )[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: (
          | "BusinessDocumentProcessingEvent"
          | "BusinessDocument"
          | "FunctionalAcknowledgement"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiFunctionalAcknowledgement[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')/SenderFunctionalAcknowledgement`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get interchange document's receiver technical acknowledgement by Guid.
     *
     * @tags Receiver Technical Acknowledgement
     * @name ReceiverTechnicalAcknowledgementList
     * @summary Get interchange document's receiver technical acknowledgement by Guid.
     * @request GET:/BusinessDocuments('{Id}')/ReceiverTechnicalAcknowledgement
     * @secure
     */
    receiverTechnicalAcknowledgementList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "Type"
          | "Direction"
          | "PayloadId"
          | "Status"
          | "PayloadContainerContentType"
          | "PayloadContentType"
        )[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: (
          | "BusinessDocumentProcessingEvent"
          | "BusinessDocument"
          | "FunctionalAcknowledgement"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiTechnicalAcknowledgement[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')/ReceiverTechnicalAcknowledgement`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get interchange document's receiver functional acknowledgement by Guid.
     *
     * @tags Receiver Functional Acknowledgement
     * @name ReceiverFunctionalAcknowledgementList
     * @summary Get interchange document's receiver functional acknowledgement by Guid.
     * @request GET:/BusinessDocuments('{Id}')/ReceiverFunctionalAcknowledgement
     * @secure
     */
    receiverFunctionalAcknowledgementList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "PayloadId"
          | "PayloadContainerContentType"
          | "PayloadContentType"
          | "DocumentId"
          | "MessageType"
          | "DocumentStandard"
          | "Direction"
          | "Status"
          | "TransmissionStatus"
          | "TransmissionErrorInformation"
          | "TransmissionHttpCode"
        )[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: (
          | "BusinessDocumentProcessingEvent"
          | "BusinessDocument"
          | "FunctionalAcknowledgement"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiFunctionalAcknowledgement[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')/ReceiverFunctionalAcknowledgement`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get interchange document's processing event by Guid.
     *
     * @tags Business Document Processing Event
     * @name BusinessDocumentProcessingEventsList
     * @summary Get interchange document's processing event by Guid.
     * @request GET:/BusinessDocuments('{Id}')/BusinessDocumentProcessingEvents
     * @secure
     */
    businessDocumentProcessingEventsList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "EventType"
          | "Date"
          | "MonitoringType"
          | "MonitoringId"
        )[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: (
          | "BusinessDocument"
          | "FunctionalAcknowledgement"
          | "BusinessDocumentPayload"
          | "ErrorDetails"
          | "BusinessDocumentNotes"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiBusinessDocumentProcessingEvent[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')/BusinessDocumentProcessingEvents`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get interchange document's payloads by Guid.
     *
     * @tags Business Document Payloads
     * @name BusinessDocumentPayloadsList
     * @summary Get interchange document's Payloads by Guid.
     * @request GET:/BusinessDocuments('{Id}')/BusinessDocumentPayloads
     * @secure
     */
    businessDocumentPayloadsList: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiBusinessDocumentPayload[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')/BusinessDocumentPayloads`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get interchange document's notes by Guid.
     *
     * @tags Business Document Notes
     * @name BusinessDocumentNotesList
     * @summary Get interchange document's notes by Guid.
     * @request GET:/BusinessDocuments('{Id}')/BusinessDocumentNotes
     * @secure
     */
    businessDocumentNotesList: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiBusinessDocumentNote[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')/BusinessDocumentNotes`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get interchange document's custom search attributes by Guid.</b> The B2B Scenarios tab under the Monitor section allows you to monitor the interchanges that are created during a B2B transaction.</b> The interchanges are displayed in a list with a list of filters using which helps you find a specific interchange easily. </b> These search filters are provided in a standard format.</b> There could be scenarios where you need to search for an interchange using a filter that is not provided in general.</b> In such cases, the Configuration Manager allows you to create and use custom search attributes.
     *
     * @tags Custom Search Attributes
     * @name CustomObjectsList
     * @summary Get interchange document's custom search attributes by Guid.
     * @request GET:/BusinessDocuments('{Id}')/CustomObjects
     * @secure
     */
    customObjectsList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "SearchFieldValue1"
          | "SearchFieldValue2"
          | "SearchFieldValue3"
          | "SearchFieldValue4"
          | "SearchFieldValue5"
          | "SearchFieldValue6"
          | "SearchFieldValue7"
          | "SearchFieldValue8"
          | "SearchFieldValue9"
          | "SearchFieldValue10"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiCustomObjects[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')/CustomObjects`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get interchange document's extension fields by Guid.
     *
     * @tags Business Document Extended Fields
     * @name BusinessDocumentExtFieldsList
     * @summary Get interchange document's extension fields by Guid.
     * @request GET:/BusinessDocuments('{Id}')/BusinessDocumentExtFields
     * @secure
     */
    businessDocumentExtFieldsList: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiBusinessDocumentExtFields[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')/BusinessDocumentExtFields`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get interchange document's error detail by Guid.
     *
     * @tags Error Details
     * @name LastErrorDetailsList
     * @summary Get interchange document's error detail by Guid.
     * @request GET:/BusinessDocuments('{Id}')/LastErrorDetails
     * @secure
     */
    lastErrorDetailsList: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiErrorDetail[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')/LastErrorDetails`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get interchange document's protocol headers by Guid.
     *
     * @tags Business Document Protocol Headers
     * @name BusinessDocumentProtocolHeadersList
     * @summary Get interchange document's protocol headers by Guid.
     * @request GET:/BusinessDocuments('{Id}')/BusinessDocumentProtocolHeaders
     * @secure
     */
    businessDocumentProtocolHeadersList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "Name" | "Value")[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: ("BusinessDocument" | "OrphanedInterchange")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiBusinessDocumentProtocolHeader[];
          };
        },
        OdataError
      >({
        path: `/BusinessDocuments('${id}')/BusinessDocumentProtocolHeaders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  businessDocumentPayloadsId = {
    /**
     * @description You can use the following request to get payload value by Guid.
     *
     * @tags Business Document Payloads
     * @name ValueList
     * @summary Get interchange document's payload by Guid.
     * @request GET:/BusinessDocumentPayloads('{Id}')/$value
     * @secure
     */
    valueList: (id: string, params: RequestParams = {}) =>
      this.request<string, OdataError>({
        path: `/BusinessDocumentPayloads('${id}')/$value`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  technicalAcknowledgementsId = {
    /**
     * @description You can use the following request to get technical acknowledgement by Guid.
     *
     * @tags Technical Acknowledgement
     * @name TechnicalAcknowledgementsList
     * @summary Get technical acknowledgement by Guid.
     * @request GET:/TechnicalAcknowledgements('{Id}')
     * @secure
     */
    technicalAcknowledgementsList: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiTechnicalAcknowledgement[];
          };
        },
        OdataError
      >({
        path: `/TechnicalAcknowledgements('${id}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get technical acknowledgement by Guid.
     *
     * @tags Technical Acknowledgement
     * @name ValueList
     * @summary Get technical acknowledgement by Guid.
     * @request GET:/TechnicalAcknowledgements('{Id}')/$value
     * @secure
     */
    valueList: (id: string, params: RequestParams = {}) =>
      this.request<string, OdataError>({
        path: `/TechnicalAcknowledgements('${id}')/$value`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  functionalAcknowledgementsId = {
    /**
     * @description You can use the following request to get technical acknowledgement by Guid.
     *
     * @tags Functional Acknowledgement
     * @name FunctionalAcknowledgementsList
     * @summary Get technical acknowledgement by Guid.
     * @request GET:/FunctionalAcknowledgements('{Id}')
     * @secure
     */
    functionalAcknowledgementsList: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiFunctionalAcknowledgement[];
          };
        },
        OdataError
      >({
        path: `/FunctionalAcknowledgements('${id}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get functional acknowledgement value by Guid.
     *
     * @tags Functional Acknowledgement
     * @name ValueList
     * @summary Get functional acknowledgement value by Guid.
     * @request GET:/FunctionalAcknowledgements('{Id}')/$value
     * @secure
     */
    valueList: (id: string, params: RequestParams = {}) =>
      this.request<string, OdataError>({
        path: `/FunctionalAcknowledgements('${id}')/$value`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  activateB2BArchivingConfiguration = {
    /**
     * @description This API is only present in the <b>Cloud Foundry environment.</b> You can use the following request to acitvate the archiving functionality in your tenant.
     *
     * @tags Data Archiving
     * @name ActivateB2BArchivingConfigurationCreate
     * @summary Enable archiving
     * @request POST:/activateB2BArchivingConfiguration
     * @secure
     */
    activateB2BArchivingConfigurationCreate: (params: RequestParams = {}) =>
      this.request<object, OdataError>({
        path: `/activateB2BArchivingConfiguration`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  b2BArchivingConfigurationsTenantName = {
    /**
     * @description This API is only present in the <b>Cloud Foundry environment.</b> You can use the following request to acitvate the archiving functionality in your tenant.
     *
     * @tags Data Archiving
     * @name B2BArchivingConfigurationsList
     * @summary Get archiving configuration for a tenant
     * @request GET:/B2BArchivingConfigurations('{TenantName}')
     * @secure
     */
    b2BArchivingConfigurationsList: (
      tenantName: string,
      params: RequestParams = {},
    ) =>
      this.request<object, OdataError>({
        path: `/B2BArchivingConfigurations('${tenantName}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  b2BArchivingKeyPerformanceIndicators = {
    /**
     * @description This API is only present in the <b>Cloud Foundry environment.</b> You can use the following request to get the Key Performance Indicators (KPIs) of the archiving runs.
     *
     * @tags Data Archiving
     * @name B2BArchivingKeyPerformanceIndicatorsList
     * @summary Get Key Performance Indicators of the archiving run
     * @request GET:/B2BArchivingKeyPerformanceIndicators
     * @secure
     */
    b2BArchivingKeyPerformanceIndicatorsList: (
      query?: {
        /**
         * Filter items by property values.<br>
         * For any Id filter use only the 'eq' operator.
         */
        $filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiB2BArchivingKeyPerformanceIndicators[];
          };
        },
        OdataError
      >({
        path: `/B2BArchivingKeyPerformanceIndicators`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
