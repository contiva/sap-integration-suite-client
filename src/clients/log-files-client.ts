/**
 * SAP Log Files Client
 * 
 * This file contains a client class for interacting with the 
 * Log Files API of SAP Cloud Integration, used for accessing
 * system logs (HTTP, trace).
 * 
 * @module sap-integration-suite-client/log-files
 */

import { 
  Api as LogFilesApi,
  ComSapHciApiLogFile,
  ComSapHciApiLogFileArchive,
  // AuditLog is not directly exposed via specific endpoints in this API version
} from '../types/sap.LogFiles';

/**
 * SAP Log Files Client
 * 
 * Provides simplified access to the Log Files API (HTTP/Trace logs).
 */
export class LogFilesClient {
  private api: LogFilesApi<unknown>;

  /**
   * Creates a new LogFilesClient
   * 
   * @param {LogFilesApi<unknown>} api - The underlying API instance
   */
  constructor(api: LogFilesApi<unknown>) {
    this.api = api;
  }

  /**
   * Retrieves a list of available log file archives.
   * 
   * @returns {Promise<ComSapHciApiLogFileArchive[]>} Promise resolving to a list of archive descriptions.
   * 
   * @example
   * const archives = await client.getLogFileArchives();
   */
  async getLogFileArchives(): Promise<ComSapHciApiLogFileArchive[]> {
    const response = await this.api.logFileArchives.logFileArchivesList();
    return response.data?.d?.results || [];
  }

  /**
   * Retrieves metadata for a collection of log files based on scope and type.
   * Use `downloadLogFileArchiveCollection` to get the actual content as a ZIP file.
   * 
   * @param {('all' | 'latest')} scope - The scope of logs ('all' or 'latest').
   * @param {('http' | 'trace')} logFileType - The type of logs ('http' or 'trace').
   * @param {string} [modifiedAfter] - Optional ISO timestamp (yyyy-MM-dd'T'HH:mm:ss'Z') to filter logs modified after this time.
   * @returns {Promise<ComSapHciApiLogFileArchive[]>} Promise resolving to a list of archive metadata.
   * 
   * @example
   * const latestHttpArchives = await client.getLogFileArchiveCollection('latest', 'http');
   * const traceArchivesAfterDate = await client.getLogFileArchiveCollection('all', 'trace', '2023-10-26T10:00:00Z');
   */
  async getLogFileArchiveCollection(
    scope: 'all' | 'latest',
    logFileType: 'http' | 'trace',
    modifiedAfter?: string
  ): Promise<ComSapHciApiLogFileArchive[]> {
    const response = await this.api.logFileArchivesScopeScopeLogFileTypeLogFileTypeNodeScopeWorker
      .logFileArchivesScopeLogFileTypeNodeScopeWorkerList([scope], [logFileType], { ModifiedAfter: modifiedAfter });
    return response.data?.d?.results || [];
  }

  /**
   * Downloads a collection of log files as a ZIP archive.
   * 
   * The return type `File` is primarily relevant for browser environments. In Node.js,
   * the response needs to be handled differently (e.g., as a Stream or Buffer).
   * 
   * @param {('all' | 'latest')} scope - The scope of logs ('all' or 'latest').
   * @param {('http' | 'trace')} logFileType - The type of logs ('http' or 'trace').
   * @param {string} [modifiedAfter] - Optional ISO timestamp (yyyy-MM-dd'T'HH:mm:ss'Z') to filter logs modified after this time.
   * @returns {Promise<File>} Promise resolving to the downloaded ZIP file (in browser context).
   * 
   * @example
   * // In Browser:
   * try {
   *   const zipFile = await client.downloadLogFileArchiveCollection('latest', 'http');
   *   // ... (code to handle the downloaded file)
   * } catch (error) {
   *   console.error('Download failed:', error);
   * }
   */
  async downloadLogFileArchiveCollection(
    scope: 'all' | 'latest',
    logFileType: 'http' | 'trace',
    modifiedAfter?: string
  ): Promise<File> {
    const response = await this.api.logFileArchivesScopeScopeLogFileTypeLogFileTypeNodeScopeWorker
      .valueList([scope], [logFileType], { ModifiedAfter: modifiedAfter });
    return response.data as File; 
  }

  /**
   * Retrieves a list of individual log files based on specified criteria.
   * 
   * @param {object} [options] Optional parameters for filtering, pagination, sorting, and selection.
   * @param {number} [options.top] Maximum number of files to retrieve.
   * @param {number} [options.skip] Number of files to skip.
   * @param {string} [options.filter] OData filter string (e.g., "LogFileType eq 'http' and NodeScope eq 'worker'").
   * @param {('Name' | 'Name desc' | 'Application' | 'Application desc' | 'LastModified' | 'LastModified desc' | 'ContentType' | 'ContentType desc' | 'LogFileType' | 'LogFileType desc' | 'NodeScope' | 'NodeScope desc')[]} [options.orderby] Sorting order.
   * @param {('Name' | 'Application' | 'LastModified' | 'ContentType' | 'LogFileType' | 'NodeScope')[]} [options.select] Properties to select.
   * @returns {Promise<ComSapHciApiLogFile[]>} Promise resolving to a list of log files.
   * 
   * @example
   * const httpLogs = await client.getLogFiles({ filter: "LogFileType eq 'http'" });
   */
  async getLogFiles(options: {
    top?: number;
    skip?: number;
    filter?: string;
    orderby?: ('Name' | 'Name desc' | 'Application' | 'Application desc' | 'LastModified' | 'LastModified desc' | 'ContentType' | 'ContentType desc' | 'LogFileType' | 'LogFileType desc' | 'NodeScope' | 'NodeScope desc')[];
    select?: ('Name' | 'Application' | 'LastModified' | 'ContentType' | 'LogFileType' | 'NodeScope')[];
  } = {}): Promise<ComSapHciApiLogFile[]> {
    const response = await this.api.logFiles.logFilesList({
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter,
      $orderby: options.orderby,
      $select: options.select,
    });
    return response.data?.d?.results || [];
  }

  /**
   * Retrieves metadata for a specific log file by its name and application.
   * Use `downloadLogFile` to get the actual content.
   * 
   * @param {string} name The name of the log file.
   * @param {string} application The application associated with the log file.
   * @returns {Promise<ComSapHciApiLogFile | undefined>} Promise resolving to the log file metadata or undefined if not found.
   * 
   * @example
   * const logFileInfo = await client.getLogFileByNameAndApp('server.log', 'com.sap.it.rt.application.http.provider');
   */
  async getLogFileByNameAndApp(name: string, application: string): Promise<ComSapHciApiLogFile | undefined> {
    const response = await this.api.logFilesNameNameApplicationApplication.logFilesNameApplicationList(name, application);
    // API seems to return an array even for a single file lookup
    return response.data?.d?.results?.[0]; 
  }

  /**
   * Downloads a specific log file by its name and application.
   * 
   * The return type `File` is primarily relevant for browser environments. In Node.js,
   * the response needs to be handled differently (e.g., as a Stream or Buffer).
   * 
   * @param {string} name The name of the log file.
   * @param {string} application The application associated with the log file.
   * @returns {Promise<File>} Promise resolving to the downloaded file (in browser context).
   * 
   * @example
   * // In Browser:
   * try {
   *   const logFile = await client.downloadLogFile('server.log', 'com.sap.it.rt.application.http.provider');
   *   // ... (code to handle the downloaded file)
   * } catch (error) {
   *   console.error('Download failed:', error);
   * }
   */
  async downloadLogFile(name: string, application: string): Promise<File> {
    const response = await this.api.logFilesNameNameApplicationApplication.valueList(name, application);
    return response.data as File;
  }

}
