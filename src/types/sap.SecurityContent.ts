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

/** HistoryKeystoreEntry */
export type ComSapHciApiHistoryKeystoreEntry = ComSapHciApiKeystoreEntry & {
  /**
   * @maxLength 150
   * @example "string"
   */
  ActivatedBy?: string;
  /** @example "/Date(1492098664000)/" */
  ActiveFrom?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  DeactivatedBy?: string;
  /** @example "/Date(1492098664000)/" */
  ActiveUntil?: string;
  /** @format int32 */
  ActivationSequenceNumber?: number;
  /**
   * @maxLength 250
   * @example "string"
   */
  OriginalAlias?: string;
};

/** HistoryKeystoreEntry (for create) */
export type ComSapHciApiHistoryKeystoreEntryCreate = ComSapHciApiKeystoreEntryCreate & {
  /**
   * @maxLength 150
   * @example "string"
   */
  ActivatedBy?: string;
  /** @example "/Date(1492098664000)/" */
  ActiveFrom?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  DeactivatedBy?: string;
  /** @example "/Date(1492098664000)/" */
  ActiveUntil?: string;
  /** @format int32 */
  ActivationSequenceNumber?: number;
  /**
   * @maxLength 250
   * @example "string"
   */
  OriginalAlias?: string;
};

/** HistoryKeystoreEntry (for update) */
export type ComSapHciApiHistoryKeystoreEntryUpdate = ComSapHciApiKeystoreEntryUpdate & {
  /**
   * @maxLength 150
   * @example "string"
   */
  ActivatedBy?: string;
  /** @example "/Date(1492098664000)/" */
  ActiveFrom?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  DeactivatedBy?: string;
  /** @example "/Date(1492098664000)/" */
  ActiveUntil?: string;
  /** @format int32 */
  ActivationSequenceNumber?: number;
  /**
   * @maxLength 250
   * @example "string"
   */
  OriginalAlias?: string;
};

/** KeystoreResource */
export interface ComSapHciApiKeystoreResource {
  /** @maxLength 100 */
  Name?: string;
  /**
   * @format binary
   * @maxLength 1048576
   */
  Resource?: File;
  /**
   * @maxLength 300
   * @example "string"
   */
  Password?: string;
  /**
   * @maxLength 1048576
   * @example "string"
   */
  Aliases?: string;
}

/** KeystoreResource (for create) */
export interface ComSapHciApiKeystoreResourceCreate {
  /**
   * @maxLength 100
   * @example "system"
   */
  Name: string;
  /**
   * @format binary
   * @maxLength 1048576
   * @example "base64 encoded JKS or JCEKS keystore"
   */
  Resource?: File;
  /**
   * @maxLength 300
   * @example "string"
   */
  Password?: string;
}

/** KeystoreResource (for update) */
export interface ComSapHciApiKeystoreResourceUpdate {
  /**
   * @format binary
   * @maxLength 1048576
   */
  Resource?: File;
  /**
   * @maxLength 300
   * @example "string"
   */
  Password?: string;
  /**
   * @maxLength 1048576
   * @example "string"
   */
  Aliases?: string;
}

/** KeystoreResource (for export) */
export interface ComSapHciApiKeystoreResourceExport {
  /**
   * @maxLength 100
   * @example "system"
   */
  Name?: string;
  /**
   * @format binary
   * @maxLength 1048576
   */
  Resource?: File;
}

/** Keystore (for restore) */
export interface ComSapHciApiKeystoreResourceRestore {
  /**
   * @format binary
   * @maxLength 1048576
   */
  Resource: File;
}

/** CertificateChainResource */
export type ComSapHciApiCertificateChainResource = ComSapHciApiKeystoreEntryAlias & {
  KeystoreEntry?: ComSapHciApiKeystoreEntry;
};

/** CertificateChainResource (for create) */
export type ComSapHciApiCertificateChainResourceCreate = ComSapHciApiKeystoreEntryAliasCreate & {
  KeystoreEntry?: ComSapHciApiKeystoreEntryCreate;
};

/** CertificateChainResource (for update) */
export type ComSapHciApiCertificateChainResourceUpdate = ComSapHciApiKeystoreEntryAliasUpdate & object;

/** KeystoreEntryCertificatePartBase */
export type ComSapHciApiKeystoreEntryCertificatePartBase = ComSapHciApiKeystoreEntryAlias & {
  /**
   * @maxLength 30
   * @example "string"
   */
  KeyType?: string;
  /** @format int32 */
  KeySize?: number;
  /** @example "/Date(1492098664000)/" */
  ValidNotBefore?: string;
  /** @example "/Date(1492098664000)/" */
  ValidNotAfter?: string;
  /**
   * @maxLength 256
   * @example "string"
   */
  SerialNumber?: string;
  /**
   * @maxLength 60
   * @example "string"
   */
  SignatureAlgorithm?: string;
  /**
   * @maxLength 80
   * @example "string"
   */
  EllipticCurve?: string;
};

/** KeystoreEntryCertificatePartBase (for create) */
export type ComSapHciApiKeystoreEntryCertificatePartBaseCreate = ComSapHciApiKeystoreEntryAliasCreate & {
  /**
   * @maxLength 30
   * @example "string"
   */
  KeyType?: string;
  /**
   * @maxLength 60
   * @example "string"
   */
  SignatureAlgorithm?: string;
  /** @format int32 */
  KeySize?: number;
  /** @example "/Date(1492098664000)/" */
  ValidNotBefore?: string;
  /** @example "/Date(1492098664000)/" */
  ValidNotAfter?: string;
  /**
   * @maxLength 256
   * @example "string"
   */
  SerialNumber?: string;
};

/** KeystoreEntryCertificatePartBase (for update) */
export type ComSapHciApiKeystoreEntryCertificatePartBaseUpdate = ComSapHciApiKeystoreEntryAliasUpdate & {
  /**
   * @maxLength 30
   * @example "string"
   */
  KeyType?: string;
  /** @format int32 */
  KeySize?: number;
  /** @example "/Date(1492098664000)/" */
  ValidNotBefore?: string;
  /** @example "/Date(1492098664000)/" */
  ValidNotAfter?: string;
  /**
   * @maxLength 256
   * @example "string"
   */
  SerialNumber?: string;
  /**
   * @maxLength 60
   * @example "string"
   */
  SignatureAlgorithm?: string;
};

/** KeystoreEntryAlias */
export interface ComSapHciApiKeystoreEntryAlias {
  /** @maxLength 2000 */
  Hexalias?: string;
  /** @maxLength 250 */
  Alias?: string;
}

/** KeystoreEntryAlias (for create) */
export interface ComSapHciApiKeystoreEntryAliasCreate {
  /** @maxLength 2000 */
  Hexalias: string;
  /** @maxLength 250 */
  Alias?: string;
}

/** KeystoreEntryAlias (for update) */
export interface ComSapHciApiKeystoreEntryAliasUpdate {
  /** @maxLength 250 */
  Alias?: string;
}

/** KeystoreEntryAliases (for mass delete) */
export interface ComSapHciApiKeystoreEntryAliasMassdelete {
  /** @example "alias1;alias2" */
  Aliases?: string;
}

/** SSHKeyResource */
export type ComSapHciApiSSHKeyResource = ComSapHciApiKeystoreEntryAlias & {
  KeystoreEntry?: ComSapHciApiKeystoreEntry;
};

/** SSHKeyResource (for create) */
export type ComSapHciApiSSHKeyResourceCreate = ComSapHciApiKeystoreEntryAliasCreate & {
  KeystoreEntry?: ComSapHciApiKeystoreEntryCreate;
};

/** SSHKeyResource (for update) */
export type ComSapHciApiSSHKeyResourceUpdate = ComSapHciApiKeystoreEntryAliasUpdate & object;

/** KeystoreEntry */
export type ComSapHciApiKeystoreEntry = ComSapHciApiKeystoreEntryCertificatePart & {
  /**
   * @maxLength 30
   * @example "string"
   */
  Type?: string;
  /**
   * @maxLength 30
   * @example "string"
   */
  Owner?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  LastModifiedBy?: string;
  /** @example "/Date(1492098664000)/" */
  LastModifiedTime?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  CreatedBy?: string;
  /** @example "/Date(1492098664000)/" */
  CreatedTime?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Status?: string;
  /** Collection of ChainCertificate */
  ChainCertificates?: {
    results?: ComSapHciApiChainCertificate[];
  };
  Certificate?: ComSapHciApiCertificateResource;
  Sshkey?: ComSapHciApiSSHKeyResource;
  Keystore?: ComSapHciApiKeystore;
  ChainResource?: ComSapHciApiCertificateChainResource;
  SigningRequest?: ComSapHciApiCertificateSigningRequest;
};

/** KeystoreEntry (for create) */
export type ComSapHciApiKeystoreEntryCreate = ComSapHciApiKeystoreEntryCertificatePartCreate & {
  /**
   * @maxLength 30
   * @example "string"
   */
  Type?: string;
  /**
   * @maxLength 30
   * @example "string"
   */
  Owner?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  LastModifiedBy?: string;
  /** @example "/Date(1492098664000)/" */
  LastModifiedTime?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  CreatedBy?: string;
  /** @example "/Date(1492098664000)/" */
  CreatedTime?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Status?: string;
  /** Collection of ChainCertificate */
  ChainCertificates?: {
    results?: ComSapHciApiChainCertificateCreate[];
  };
  Certificate?: ComSapHciApiCertificateResourceCreate;
  Sshkey?: ComSapHciApiSSHKeyResourceCreate;
  Keystore?: ComSapHciApiKeystoreCreate;
  ChainResource?: ComSapHciApiCertificateChainResourceCreate;
  SigningRequest?: ComSapHciApiCertificateSigningRequestCreate;
};

/** KeystoreEntry (for update) */
export type ComSapHciApiKeystoreEntryUpdate = ComSapHciApiKeystoreEntryCertificatePartUpdate & {
  /**
   * @maxLength 30
   * @example "string"
   */
  Type?: string;
  /**
   * @maxLength 30
   * @example "string"
   */
  Owner?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  LastModifiedBy?: string;
  /** @example "/Date(1492098664000)/" */
  LastModifiedTime?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  CreatedBy?: string;
  /** @example "/Date(1492098664000)/" */
  CreatedTime?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Status?: string;
};

/** KeystoreEntry (for rename) */
export interface ComSapHciApiKeystoreEntryRename {
  /** @maxLength 500 */
  Status: string;
}

/** KeystoreEntry (imported) */
export interface ComSapHciApiKeystoreEntryImported {
  /** @maxLength 2000 */
  Hexalias?: string;
  /** @maxLength 250 */
  Alias?: string;
  /**
   * @maxLength 30
   * @example "string"
   */
  KeyType?: string;
  /** @format int32 */
  KeySize?: number;
  /** @example "/Date(1492098664000)/" */
  ValidNotBefore?: string;
  /** @example "/Date(1492098664000)/" */
  ValidNotAfter?: string;
  /**
   * @maxLength 256
   * @example "string"
   */
  SerialNumber?: string;
  /**
   * @maxLength 60
   * @example "string"
   */
  SignatureAlgorithm?: string;
  /**
   * @maxLength 1000
   * @example "string"
   */
  Validity?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  SubjectDN?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  IssuerDN?: string;
  /** @format int32 */
  Version?: number;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha1?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha256?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha512?: string;
  /**
   * @maxLength 30
   * @example "string"
   */
  Type?: string;
  /**
   * @maxLength 30
   * @example "string"
   */
  Owner?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  LastModifiedBy?: string;
  /** @example "/Date(1492098664000)/" */
  LastModifiedTime?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  CreatedBy?: string;
  /** @example "/Date(1492098664000)/" */
  CreatedTime?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Status?: string;
  /** Collection of ChainCertificate */
  ChainCertificates?: {
    results?: ComSapHciApiChainCertificate[];
  };
  Certificate?: ComSapHciApiCertificateResource;
  Sshkey?: ComSapHciApiSSHKeyResource;
  Keystore?: ComSapHciApiKeystore;
  ChainResource?: ComSapHciApiCertificateChainResource;
  SigningRequest?: ComSapHciApiCertificateSigningRequest;
}

/** Keystore */
export interface ComSapHciApiKeystore {
  /** @maxLength 100 */
  Name?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  LastModifiedBy?: string;
  /** @example "/Date(1492098664000)/" */
  LastModifiedTime?: string;
  /** @format int32 */
  Size?: number;
  /** Collection of KeystoreEntry */
  Entries?: {
    results?: ComSapHciApiKeystoreEntry[];
  };
}

/** Keystore (for create) */
export interface ComSapHciApiKeystoreCreate {
  /** @maxLength 100 */
  Name: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  LastModifiedBy?: string;
  /** @example "/Date(1492098664000)/" */
  LastModifiedTime?: string;
  /** @format int32 */
  Size?: number;
  /** Collection of KeystoreEntry */
  Entries?: {
    results?: ComSapHciApiKeystoreEntryCreate[];
  };
}

/** Keystore (for update) */
export interface ComSapHciApiKeystoreUpdate {
  /**
   * @maxLength 150
   * @example "string"
   */
  LastModifiedBy?: string;
  /** @example "/Date(1492098664000)/" */
  LastModifiedTime?: string;
  /** @format int32 */
  Size?: number;
}

/** CertificateResource */
export type ComSapHciApiCertificateResource = ComSapHciApiKeystoreEntryAlias & {
  KeystoreEntry?: ComSapHciApiKeystoreEntry;
};

/** CertificateResource (for create) */
export type ComSapHciApiCertificateResourceCreate = ComSapHciApiKeystoreEntryAliasCreate & {
  KeystoreEntry?: ComSapHciApiKeystoreEntryCreate;
};

/** CertificateResource (for update) */
export type ComSapHciApiCertificateResourceUpdate = ComSapHciApiKeystoreEntryAliasUpdate & object;

/** CertificateSigningRequest */
export interface ComSapHciApiCertificateSigningRequest {
  /** @maxLength 2000 */
  Hexalias?: string;
  KeystoreEntry?: ComSapHciApiKeystoreEntry;
}

/** CertificateSigningRequest (for create) */
export interface ComSapHciApiCertificateSigningRequestCreate {
  /** @maxLength 2000 */
  Hexalias: string;
  KeystoreEntry?: ComSapHciApiKeystoreEntryCreate;
}

/** CertificateSigningRequest (for update) */
export type ComSapHciApiCertificateSigningRequestUpdate = object;

/** KeystoreEntryCertificatePart */
export type ComSapHciApiKeystoreEntryCertificatePart = ComSapHciApiKeystoreEntryCertificatePartBase & {
  /**
   * @maxLength 1000
   * @example "string"
   */
  Validity?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  SubjectDN?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  IssuerDN?: string;
  /** @format int32 */
  Version?: number;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha1?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha256?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha512?: string;
};

/** KeystoreEntryCertificatePart (for update) */
export type ComSapHciApiKeystoreEntryCertificatePartUpdate = ComSapHciApiKeystoreEntryCertificatePartBaseUpdate & {
  /**
   * @maxLength 1000
   * @example "string"
   */
  Validity?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  SubjectDN?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  IssuerDN?: string;
  /** @format int32 */
  Version?: number;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha1?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha256?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha512?: string;
};

/** KeystoreEntryCertificatePart (for create) */
export type ComSapHciApiKeystoreEntryCertificatePartCreate = ComSapHciApiKeystoreEntryCertificatePartBaseCreate & {
  /**
   * @maxLength 1000
   * @example "string"
   */
  Validity?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  SubjectDN?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  IssuerDN?: string;
  /** @format int32 */
  Version?: number;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha1?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha256?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha512?: string;
};

/** KeyPairGenerationRequest */
export type ComSapHciApiKeyPairGenerationRequest = ComSapHciApiKeystoreEntryCertificatePartBase & {
  /**
   * @maxLength 500
   * @example "string"
   */
  KeyAlgorithmParameter?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  CommonName?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  OrganizationUnit?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Organization?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Locality?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  State?: string;
  /**
   * @maxLength 2
   * @example "string"
   */
  Country?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Email?: string;
};

/** KeyPairGenerationRequest (for create) */
export interface ComSapHciApiKeyPairGenerationRequestCreate {
  /** @maxLength 2000 */
  Hexalias?: string;
  /** @maxLength 250 */
  Alias?: string;
  /**
   * @maxLength 30
   * @example "RSA"
   */
  KeyType?: string;
  /**
   * @maxLength 60
   * @example "SHA256/RSA"
   */
  SignatureAlgorithm?: string;
  /**
   * @format int32
   * @example 2048
   */
  KeySize?: number;
  /**
   * @maxLength 500
   * @example "string"
   */
  CommonName?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  OrganizationUnit?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Organization?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Locality?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  State?: string;
  /**
   * @maxLength 2
   * @example "string"
   */
  Country?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Email?: string;
  /** @example "/Date(1562673915367)/" */
  ValidNotBefore?: string;
  /** @example "/Date(1662673915367)/" */
  ValidNotAfter?: string;
}

/** KeyPairGenerationRequest (for update) */
export type ComSapHciApiKeyPairGenerationRequestUpdate = ComSapHciApiKeystoreEntryCertificatePartBaseUpdate & {
  /**
   * @maxLength 500
   * @example "string"
   */
  KeyAlgorithmParameter?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  CommonName?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  OrganizationUnit?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Organization?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Locality?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  State?: string;
  /**
   * @maxLength 2
   * @example "string"
   */
  Country?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Email?: string;
};

/** KeyPairResource (for create) */
export type ComSapHciApiKeyPairResourceCreate = ComSapHciApiKeystoreEntryAliasCreate & {
  /**
   * @format binary
   * @maxLength 24576
   */
  Resource?: File;
  /**
   * @maxLength 500
   * @example "string"
   */
  Password?: string;
};

/** KeyPairResource (for update) */
export interface ComSapHciApiKeyPairResourceUpdate {
  /**
   * @maxLength 2000
   * @example "any dummy hex encoded value"
   */
  Hexalias?: string;
  /** @maxLength 250 */
  Alias?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Password?: string;
  /**
   * @format binary
   * @maxLength 24576
   * @example "base64 encoded PKCS#12 binary"
   */
  Resource?: File;
}

/** ChainCertificate */
export interface ComSapHciApiChainCertificate {
  /** @maxLength 2000 */
  Hexalias?: string;
  /** @maxLength 250 */
  Alias?: string;
  /** @format int32 */
  Index?: number;
  /**
   * @maxLength 1000
   * @example "string"
   */
  Validity?: string;
  /**
   * @maxLength 30
   * @example "string"
   */
  KeyType?: string;
  /** @format int32 */
  KeySize?: number;
  /** @example "/Date(1492098664000)/" */
  ValidNotBefore?: string;
  /** @example "/Date(1492098664000)/" */
  ValidNotAfter?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  SubjectDN?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  IssuerDN?: string;
  /**
   * @maxLength 66
   * @example "string"
   */
  SerialNumber?: string;
  /**
   * @maxLength 60
   * @example "string"
   */
  SignatureAlgorithm?: string;
  /** @format int32 */
  Version?: number;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha1?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha256?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha512?: string;
  KeystoreEntry?: ComSapHciApiKeystoreEntry;
}

/** ChainCertificate */
export interface ComSapHciApiChainCertificateCreate {
  /** @maxLength 2000 */
  Hexalias: string;
  /** @maxLength 250 */
  Alias?: string;
  /** @format int32 */
  Index: number;
  /**
   * @maxLength 1000
   * @example "string"
   */
  Validity?: string;
  /**
   * @maxLength 30
   * @example "string"
   */
  KeyType?: string;
  /** @format int32 */
  KeySize?: number;
  /** @example "/Date(1492098664000)/" */
  ValidNotBefore?: string;
  /** @example "/Date(1492098664000)/" */
  ValidNotAfter?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  SubjectDN?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  IssuerDN?: string;
  /**
   * @maxLength 66
   * @example "string"
   */
  SerialNumber?: string;
  /**
   * @maxLength 60
   * @example "string"
   */
  SignatureAlgorithm?: string;
  /** @format int32 */
  Version?: number;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha1?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha256?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha512?: string;
  KeystoreEntry?: ComSapHciApiKeystoreEntryCreate;
}

/** ChainCertificate (for update) */
export interface ComSapHciApiChainCertificateUpdate {
  /** @maxLength 250 */
  Alias?: string;
  /**
   * @maxLength 1000
   * @example "string"
   */
  Validity?: string;
  /**
   * @maxLength 30
   * @example "string"
   */
  KeyType?: string;
  /** @format int32 */
  KeySize?: number;
  /** @example "/Date(1492098664000)/" */
  ValidNotBefore?: string;
  /** @example "/Date(1492098664000)/" */
  ValidNotAfter?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  SubjectDN?: string;
  /**
   * @maxLength 5000
   * @example "string"
   */
  IssuerDN?: string;
  /**
   * @maxLength 66
   * @example "string"
   */
  SerialNumber?: string;
  /**
   * @maxLength 60
   * @example "string"
   */
  SignatureAlgorithm?: string;
  /** @format int32 */
  Version?: number;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha1?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha256?: string;
  /**
   * @maxLength 200
   * @example "string"
   */
  FingerprintSha512?: string;
}

/** SSHKeyGenerationRequest (for create) */
export interface ComSapHciApiSSHKeyGenerationRequestCreate {
  /** @maxLength 250 */
  Alias?: string;
  /**
   * @maxLength 10000
   * @example "string"
   */
  SSHFile?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Password?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  CommonName?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  OrganizationUnit?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Organization?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Locality?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  State?: string;
  /**
   * @maxLength 2
   * @example "string"
   */
  Country?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Email?: string;
  /** @example "/Date(1492098664000)/" */
  ValidNotBefore?: string;
  /** @example "/Date(1492098664000)/" */
  ValidNotAfter?: string;
}

/** SSHKeyGenerationRequest (response) */
export interface ComSapHciApiSSHKeyGenerationRequestCreateResponse {
  /** @maxLength 250 */
  Alias?: string;
}

/** UserCredential */
export interface ComSapHciApiUserCredential {
  /** @example "credentials name" */
  Name?: string;
  /** @example "default, successfactors or openconnectors" */
  Kind?: string;
  /** @example "description" */
  Description?: string;
  /** @example "user" */
  User?: string;
  /** @example "password" */
  Password?: string;
  /** @example "successfactors: company ID" */
  CompanyId?: string;
  SecurityArtifactDescriptor?: ComSapHciApiSecurityArtifactDescriptor;
}

/** RSAKeyGenerationRequest (for create) */
export interface ComSapHciApiRSAKeyGenerationRequestCreate {
  /**
   * @maxLength 250
   * @example "AB"
   */
  Hexalias?: string;
  /**
   * @maxLength 250
   * @example "testRSA"
   */
  Alias?: string;
  /**
   * @maxLength 10000
   * @example "string"
   */
  RSAFile?: string;
  /**
   * @maxLength 60
   * @example "SHA256/RSA"
   */
  SignatureAlgorithm?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  CommonName?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  OrganizationUnit?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Organization?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Locality?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  State?: string;
  /**
   * @maxLength 2
   * @example "string"
   */
  Country?: string;
  /**
   * @maxLength 500
   * @example "string"
   */
  Email?: string;
  /** @example "/Date(1562673915367)/" */
  ValidNotBefore?: string;
  /** @example "/Date(1662673915367)/" */
  ValidNotAfter?: string;
}

/** UserCredential (for create) */
export interface ComSapHciApiUserCredentialCreate {
  /** @example "credentials name" */
  Name: string;
  /** @example "default, successfactors or openconnectors" */
  Kind: string;
  /** @example "descrption" */
  Description?: string;
  /** @example "user" */
  User?: string;
  /** @example "password" */
  Password?: string;
  /** @example "successfactors: company ID" */
  CompanyId?: string;
}

/** UserCredential (for update) */
export interface ComSapHciApiUserCredentialUpdate {
  /** @example "credentials name" */
  Name?: string;
  /** @example "default, successfactors or openconnectors" */
  Kind?: string;
  /** @example "description" */
  Description?: string;
  /** @example "user" */
  User?: string;
  /** @example "password" */
  Password?: string;
  /** @example "successfactors: company ID" */
  CompanyId?: string;
}

/** SecureParameter */
export interface ComSapHciApiSecureParameter {
  /** @example "secure parameters artifact name" */
  Name?: string;
  /** @example "description" */
  Description?: string;
  /** @example "value" */
  SecureParam?: string;
  DeployedBy?: string;
  /**
   * @format date-time
   * @example "/Date(1687242561034)/"
   */
  DeployedOn?: string;
  Status?: string;
}

/** SecureParameter (for create) */
export interface ComSapHciApiSecureParameterCreate {
  /** @example "secure parameters artifact name" */
  Name: string;
  /** @example "description" */
  Description?: string;
  /** @example "value" */
  SecureParam: string;
}

/** SecureParameter (for update) */
export interface ComSapHciApiSecureParameterUpdate {
  /** @example "secure parameters artifact name" */
  Name?: string;
  /** @example "description" */
  Description?: string;
  /** @example "value" */
  SecureParam?: string;
}

/** CertificateUserMapping */
export interface ComSapHciApiCertificateUserMapping {
  /** @maxLength 32 */
  Id?: string;
  /** @maxLength 150 */
  User?: string;
  /**
   * @format binary
   * @maxLength 8192
   */
  Certificate?: File;
  /**
   * @maxLength 150
   * @example "string"
   */
  LastModifiedBy?: string;
  /** @example "/Date(1492098664000)/" */
  LastModifiedTime?: string;
  /**
   * @maxLength 150
   * @example "string"
   */
  CreatedBy?: string;
  /** @example "/Date(1492098664000)/" */
  CreatedTime?: string;
  /** @format int64 */
  ValidUntil?: number;
}

/** CertificateUserMapping (for create) */
export interface ComSapHciApiCertificateUserMappingCreate {
  /**
   * @maxLength 150
   * @example "user"
   */
  User?: string;
  /**
   * @format binary
   * @maxLength 8192
   * @example "certificate in base64 encoded PEM-DER format"
   */
  Certificate?: File;
}

/** CertificateUserMapping (for update) */
export interface ComSapHciApiCertificateUserMappingUpdate {
  /** @maxLength 150 */
  User?: string;
  /**
   * @format binary
   * @maxLength 8192
   */
  Certificate?: File;
}

/** OAuth2ClientCredential */
export interface ComSapHciApiOAuth2ClientCredential {
  Name?: string;
  Description?: string;
  TokenServiceUrl?: string;
  ClientId?: string;
  ClientSecret?: string;
  ClientAuthentication?: string;
  Scope?: string;
  ScopeContentType?: string;
  Resource?: string;
  Audience?: string;
  SecurityArtifactDescriptor?: ComSapHciApiSecurityArtifactDescriptor;
}

/** OAuth2ClientCredential (for create) */
export interface ComSapHciApiOAuth2ClientCredentialCreate {
  Name: string;
  Description?: string;
  TokenServiceUrl?: string;
  ClientId?: string;
  ClientSecret?: string;
  /** @example "body (default) or header" */
  ClientAuthentication?: string;
  Scope?: string;
  /** @example "urlencoded (default) or json" */
  ScopeContentType?: string;
  Resource?: string;
  Audience?: string;
  CustomParameters?: ComSapHciApiOAuth2ClientCredentialCustomParameters[];
}

/** OAuth2ClientCredential (for update) */
export interface ComSapHciApiOAuth2ClientCredentialUpdate {
  Name?: string;
  Description?: string;
  TokenServiceUrl?: string;
  ClientId?: string;
  ClientSecret?: string;
  ClientAuthentication?: string;
  Scope?: string;
  ScopeContentType?: string;
  Resource?: string;
  Audience?: string;
}

/** OAuth2ClientCredentialCustomParameters */
export interface ComSapHciApiOAuth2ClientCredentialCustomParameters {
  Key?: string;
  Value?: string;
  /** @example "body or url" */
  SendAsPartOf?: string;
}

/** SecurityArtifactDescriptor */
export interface ComSapHciApiSecurityArtifactDescriptor {
  Type?: string;
  DeployedBy?: string;
  /**
   * @format date-time
   * @example "2017-04-13T15:51:04"
   */
  DeployedOn?: string;
  Status?: string;
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

/** AccessPolicy */
export interface ComSapHciApiAccessPolicy {
  Id?: string;
  RoleName?: string;
  Description?: string;
}

/** AccessPolicy-create */
export interface ComSapHciApiAccessPolicyCreate {
  /** @example "AccessPolicy1" */
  RoleName?: string;
  /** @example "Description" */
  Description?: string;
  ArtifactReferences?: ComSapHciApiArtifactReferenceCreate[];
}

/** ArtifactReference-create */
export interface ComSapHciApiArtifactReferenceCreate {
  /** @example "ArtifactReference1" */
  Name?: string;
  /** @example "Description" */
  Description?: string;
  /** @example "INTEGRATION_FLOW" */
  Type?: string;
  /** @example "Name" */
  ConditionAttribute?: string;
  /** @example "Iflow1" */
  ConditionValue?: string;
  /** @example "exactString" */
  ConditionType?: string;
}

/** ArtifactReference-createsep */
export interface ComSapHciApiArtifactReferenceCreatesep {
  /** @example "ArtifactReference2" */
  Name?: string;
  /** @example "Description" */
  Description?: string;
  /** @example "INTEGRATION_FLOW" */
  Type?: string;
  /** @example "Name" */
  ConditionAttribute?: string;
  /** @example "Iflow2" */
  ConditionValue?: string;
  /** @example "exactString" */
  ConditionType?: string;
  /** @example [{"Id":"101"}] */
  AcessPolicy?: object;
}

/** ArtifactReference */
export interface ComSapHciApiArtifactReference {
  /** @example "ArtifactReference1" */
  Id?: string;
  /** @example "ArtifactReference1" */
  Name?: string;
  /** @example "Description" */
  Description?: string;
  /** @uniqueItems true */
  Type?: (
    | "INTEGRATION_FLOW"
    | "ODATA_SERVICE"
    | "SCRIPT_COLLECTION"
    | "VALUE_MAPPING"
    | "MESSAGE_MAPPING"
    | "MESSAGE_QUEUE"
    | "GLOBAL_DATASTORE"
    | "GLOBAL_VARIABLE"
    | "SOAP_API_PROVIDER"
    | "REST_API_PROVIDER"
    | "DATA_TYPE"
    | "MESSAGE_TYPE"
  )[];
  /** @uniqueItems true */
  ConditionAttribute?: ("Name" | "ID")[];
  /** @example "Iflow1" */
  ConditionValue?: string;
  /** @uniqueItems true */
  ConditionType?: ("exactString" | "regularExpression")[];
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
 * @title Security Content
 * @version 1.0.0
 * @baseUrl https://{Account Short Name}-tmn.{SSL Host}.{Landscapehost}/api/v1
 * @externalDocs https://help.sap.com/docs/integration-suite/sap-integration-suite/e01d3f0076384cf7b2d18adbccb067a1.html
 *
 * Security content enables you to get, write or delete various security content. Depending on the kind of connection, the applied authorization and authentication options, and the direction of the request (either inbound or outbound), different kind of security content needs to be created and deployed on the tenant. You can manage the floowing security content types:
 * * User credentials
 * * OAuth2 client credentials
 * * Keystore entries
 * * Certificate-to-user mappings
 *
 * This API is implemented based on OData version 2 specification.
 *  If you like to request the OData API on your tenant, you need to know how to find out the address of the HTTP call. For more information, see [HTTP Calls and URL Components](https://help.sap.com/docs/SAP_INTEGRATION_SUITE/51ab953548be4459bfe8539ecaeee98d/ca75e12fc5904d96a038aef6c00db5fc.html).
 *  If you face problems using the API, you can create a ticket. Check out for the right support component on this page: [Support Components](https://help.sap.com/docs/SAP_INTEGRATION_SUITE/51ab953548be4459bfe8539ecaeee98d/bd2d883ae8ee4e2696038be7741d93d7.html).
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
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

  userCredentials = {
    /**
     * @description You can use the following request to get all deployed user credentials.
     *
     * @tags User Credentials
     * @name UserCredentialsList
     * @summary Get all deployed user credentials.
     * @request GET:/UserCredentials
     * @secure
     */
    userCredentialsList: (params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiUserCredential[];
          };
        },
        OdataError
      >({
        path: `/UserCredentials`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add user credentials.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to add user credentials.
     *
     * @tags User Credentials
     * @name UserCredentialsCreate
     * @summary Add user credentials.
     * @request POST:/UserCredentials
     * @secure
     */
    userCredentialsCreate: (UserCredential: ComSapHciApiUserCredentialCreate, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/UserCredentials`,
        method: "POST",
        body: UserCredential,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  userCredentialsName = {
    /**
     * @description You can use the following request to get user credentials for a given credentials name.
     *
     * @tags User Credentials
     * @name UserCredentialsList
     * @summary Get user credentials by name.
     * @request GET:/UserCredentials('{Name}')
     * @secure
     */
    userCredentialsList: (name: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: ComSapHciApiUserCredential;
        },
        OdataError
      >({
        path: `/UserCredentials('${name}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update user credentials.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update user credentials.
     *
     * @tags User Credentials
     * @name UserCredentialsUpdate
     * @summary Update user credentials.
     * @request PUT:/UserCredentials('{Name}')
     * @secure
     */
    userCredentialsUpdate: (
      name: string,
      UserCredential: ComSapHciApiUserCredentialUpdate,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/UserCredentials('${name}')`,
        method: "PUT",
        body: UserCredential,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete user credentials.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete user credentials.
     *
     * @tags User Credentials
     * @name UserCredentialsDelete
     * @summary Delete user credentials.
     * @request DELETE:/UserCredentials('{Name}')
     * @secure
     */
    userCredentialsDelete: (name: string, params: RequestParams = {}) =>
      this.request<void, OdataError | void>({
        path: `/UserCredentials('${name}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  secureParameters = {
    /**
     * @description You can use the following request to get all deployed secure parameters. The response body does not contain the values for the secure parameters. You can only store the values with the OData API, but you can't retrieve the values. This resource is only available in the Neo environment.
     *
     * @tags Secure Parameters
     * @name SecureParametersList
     * @summary Get all deployed secure parameters.
     * @request GET:/SecureParameters
     * @secure
     */
    secureParametersList: (params: RequestParams = {}) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiSecureParameter[];
          };
        },
        OdataError
      >({
        path: `/SecureParameters`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add secure parameters.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to add secure parameters. This resource is only available in the Neo environment.
     *
     * @tags Secure Parameters
     * @name SecureParametersCreate
     * @summary Add secure parameters.
     * @request POST:/SecureParameters
     * @secure
     */
    secureParametersCreate: (SecureParameter: ComSapHciApiSecureParameterCreate, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/SecureParameters`,
        method: "POST",
        body: SecureParameter,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  secureParametersName = {
    /**
     * @description You can use the following request to get secure parameters for a artifact name. This resource is only available in the Neo environment.
     *
     * @tags Secure Parameters
     * @name SecureParametersList
     * @summary Get secure parameters by name.
     * @request GET:/SecureParameters('{Name}')
     * @secure
     */
    secureParametersList: (name: string, params: RequestParams = {}) =>
      this.request<
        {
          d?: ComSapHciApiSecureParameter;
        },
        OdataError
      >({
        path: `/SecureParameters('${name}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update secure parameters.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update secure parameters. There are the following length restrictions: Name: 150 characters, SecureParam: 255 characters, Description: 1024 chacracters. This resource is only available in the Neo environment.
     *
     * @tags Secure Parameters
     * @name SecureParametersUpdate
     * @summary Update secure parameters.
     * @request PUT:/SecureParameters('{Name}')
     * @secure
     */
    secureParametersUpdate: (
      name: string,
      SecureParameters: ComSapHciApiSecureParameterUpdate,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/SecureParameters('${name}')`,
        method: "PUT",
        body: SecureParameters,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete secure parameters.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete secure parameters. This resource is only available in the Neo environment.
     *
     * @tags Secure Parameters
     * @name SecureParametersDelete
     * @summary Delete secure parameters.
     * @request DELETE:/SecureParameters('{Name}')
     * @secure
     */
    secureParametersDelete: (name: string, params: RequestParams = {}) =>
      this.request<void, OdataError | void>({
        path: `/SecureParameters('${name}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  oAuth2ClientCredentials = {
    /**
     * @description You can use the following request to get all OAuth2 client credentials.
     *
     * @tags OAuth2 Client Credentials
     * @name OAuth2ClientCredentialsList
     * @summary Get all OAuth2 client credentials.
     * @request GET:/OAuth2ClientCredentials
     * @secure
     */
    oAuth2ClientCredentialsList: (
      query?: {
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: "CustomParameters"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiOAuth2ClientCredential[];
          };
        },
        OdataError
      >({
        path: `/OAuth2ClientCredentials`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add OAuth2 client credentials.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to add credentials.
     *
     * @tags OAuth2 Client Credentials
     * @name OAuth2ClientCredentialsCreate
     * @summary Add OAuth2 client credentials
     * @request POST:/OAuth2ClientCredentials
     * @secure
     */
    oAuth2ClientCredentialsCreate: (
      OAuth2ClientCredentials: ComSapHciApiOAuth2ClientCredentialCreate,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/OAuth2ClientCredentials`,
        method: "POST",
        body: OAuth2ClientCredentials,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  oAuth2ClientCredentialsName = {
    /**
     * @description You can use the following request to get OAuth2 client credentials for a given credentials name.
     *
     * @tags OAuth2 Client Credentials
     * @name OAuth2ClientCredentialsList
     * @summary Get OAuth2 client credentials by name.
     * @request GET:/OAuth2ClientCredentials('{Name}')
     * @secure
     */
    oAuth2ClientCredentialsList: (
      name: string,
      query?: {
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: "CustomParameters"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiOAuth2ClientCredential;
        },
        OdataError
      >({
        path: `/OAuth2ClientCredentials('${name}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to update OAuth2 client credentials.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update credentials.
     *
     * @tags OAuth2 Client Credentials
     * @name OAuth2ClientCredentialsUpdate
     * @summary Update OAuth2 client credentials
     * @request PUT:/OAuth2ClientCredentials('{Name}')
     * @secure
     */
    oAuth2ClientCredentialsUpdate: (
      name: string,
      OAuth2ClientCredentials: ComSapHciApiOAuth2ClientCredentialUpdate,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/OAuth2ClientCredentials('${name}')`,
        method: "PUT",
        body: OAuth2ClientCredentials,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description You can use the following request to delete OAuth2 client credentials.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete credentials.
     *
     * @tags OAuth2 Client Credentials
     * @name OAuth2ClientCredentialsDelete
     * @summary Delete OAuth2 client credentials
     * @request DELETE:/OAuth2ClientCredentials('{Name}')
     * @secure
     */
    oAuth2ClientCredentialsDelete: (name: string, params: RequestParams = {}) =>
      this.request<void, OdataError | void>({
        path: `/OAuth2ClientCredentials('${name}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  certificateResourcesHexalias = {
    /**
     * @description You can use the following request to import or update a certificate.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to add/update certificates.
     *
     * @tags Certificate
     * @name ValueUpdate
     * @summary Import/update a certificate.
     * @request PUT:/CertificateResources('{Hexalias}')/$value
     * @secure
     */
    valueUpdate: (
      hexalias: string,
      query: {
        /**
         * Verify certificate signature.
         * @default "false"
         */
        fingerprintVerified: (true | false)[];
        /**
         * Provide current keystore entries in the response.
         * @default "false"
         */
        returnKeystoreEntries: (true | false)[];
        /**
         * Update existing certificate.
         * @default "false"
         */
        update: (true | false)[];
      },
      CertificateResource: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Collection of KeystoreEntry */
          d?: {
            results?: ComSapHciApiKeystoreEntry[];
          };
        },
        OdataError
      >({
        path: `/CertificateResources('${hexalias}')/$value`,
        method: "PUT",
        query: query,
        body: CertificateResource,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  keystoreEntriesHexalias = {
    /**
     * @description You can use the following request to export a certificate for a certain alias (hex encoded value). If the specified alias represents a key pair, the certificate with the public key is exported.
     *
     * @tags Certificate
     * @name CertificateValueList
     * @summary Export certificate.
     * @request GET:/KeystoreEntries('{Hexalias}')/Certificate/$value
     * @secure
     */
    certificateValueList: (
      hexalias: string,
      query: {
        /**
         * Select the , from which the certificate chain shall be exported: Tenant keystore ```system```, the backup keystore ```backup_admin_system```, the renewal keystore ```KeyRenewal``` or the history keystore ```KeyHistory```.
         * @default "system"
         */
        keystoreName: ("system" | "backup_admin_system" | "KeyRenewal" | "KeyHistory")[];
        /**
         * Provide root ca certificate for key pairs if existing.
         * @default "false"
         */
        rootCA: (true | false)[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/KeystoreEntries('${hexalias}')/Certificate/$value`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description You can use the following request to generate a certificate signing request.
     *
     * @tags Key Pair
     * @name SigningRequestValueList
     * @summary Generate a certificate signing request.
     * @request GET:/KeystoreEntries('{Hexalias}')/SigningRequest/$value
     * @secure
     */
    signingRequestValueList: (hexalias: string, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/KeystoreEntries('${hexalias}')/SigningRequest/$value`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description You can use the following request to get a certificate chain of a key pair.
     *
     * @tags Key Pair
     * @name ChainCertificatesList
     * @summary Get certificate chain.
     * @request GET:/KeystoreEntries('{Hexalias}')/ChainCertificates
     * @secure
     */
    chainCertificatesList: (
      hexalias: string,
      query: {
        /**
         * Select the , from which the certificate chain shall be exported: Tenant keystore ```system```, the backup keystore ```backup_admin_system``` or the key renewal keystore ```KeyRenewal```.
         * @default "system"
         */
        keystoreName: ("system" | "backup_admin_system" | "KeyRenewal" | "KeyHistory")[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Alias" | "KeyType" | "LastModifiedBy" | "LastModifiedTime" | "Owner" | "Validity")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Collection of ChainCertificate */
          d?: {
            results?: ComSapHciApiChainCertificate[];
          };
        },
        OdataError
      >({
        path: `/KeystoreEntries('${hexalias}')/ChainCertificates`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to export a certificate chain.
     *
     * @tags Key Pair
     * @name ChainResourceValueList
     * @summary Export certificate chain.
     * @request GET:/KeystoreEntries('{Hexalias}')/ChainResource/$value
     * @secure
     */
    chainResourceValueList: (
      hexalias: string,
      query: {
        /**
         * Select the , from which the certificate chain shall be exported: Tenant keystore ```system```, the backup keystore ```backup_admin_system```, the key renewal keystore ```KeyRenewal``` or the history keystore ```KeyHistory```.
         * @default "system"
         */
        keystoreName: ("system" | "backup_admin_system" | "KeyRenewal" | "KeyHistory")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/KeystoreEntries('${hexalias}')/ChainResource/$value`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description You can use the following request to get a keystore entry for a certain alias.
     *
     * @tags Keystore Entry
     * @name KeystoreEntriesList
     * @summary Get keystore entry by alias
     * @request GET:/KeystoreEntries('{Hexalias}')
     * @secure
     */
    keystoreEntriesList: (
      hexalias: string,
      query: {
        /**
         * Select the keystore, from which the certificate chain shall be exported: Tenant keystore ```system```, the backup keystore ```backup_admin_system``` or the key renewal keystore ```KeyRenewal```.
         * @default "system"
         */
        keystoreName: ("system" | "backup_admin_system" | "KeyRenewal")[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Alias"
          | "KeyType"
          | "LastModifiedBy"
          | "LastModifiedTime"
          | "Owner"
          | "Status"
          | "Type"
          | "Validity"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiKeystoreEntry;
        },
        OdataError | void
      >({
        path: `/KeystoreEntries('${hexalias}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to rename entry alias of the current tenant keystore.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions for the keystore.
     *
     * @tags Keystore Entry
     * @name KeystoreEntriesUpdate
     * @summary Rename an entry alias of tenant keystore.
     * @request PUT:/KeystoreEntries('{Hexalias}')
     * @secure
     */
    keystoreEntriesUpdate: (
      hexalias: string,
      KeystoreEntry: ComSapHciApiKeystoreEntryRename,
      query?: {
        /** URL encoded new alias name */
        renameAlias?: string;
        /**
         * Return HeaAlias (in square brackets) of the renamed entry in the response
         * @default "false"
         */
        returnHexAlias?: (true | false)[];
        /**
         * Provide current keystore entries in the response.
         * @default "false"
         */
        returnKeystoreEntries?: (true | false)[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiKeystoreEntry;
        },
        OdataError
      >({
        path: `/KeystoreEntries('${hexalias}')`,
        method: "PUT",
        query: query,
        body: KeystoreEntry,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to delete an entry of the tenant keystore or to activate an entry from the renewal keystore (keystoreName=KeyRenewal).<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions for the keystore.
     *
     * @tags Keystore Entry
     * @name KeystoreEntriesDelete
     * @summary Delete/activate keystore entry.
     * @request DELETE:/KeystoreEntries('{Hexalias}')
     * @secure
     */
    keystoreEntriesDelete: (
      hexalias: string,
      query?: {
        /** Only relevant for activating an entry from the renewal keystore: ```KeyRenewal``` must be selected. */
        keystoreName?: "KeyRenewal"[];
        /** Only relevant for activating a renewal entry: ```true``` must be selected. */
        activate?: true[];
        /**
         * Provide current keystore entries in the response.
         * @default "false"
         */
        returnKeystoreEntries?: (true | false)[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiKeystoreEntry;
        },
        OdataError
      >({
        path: `/KeystoreEntries('${hexalias}')`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  keyPairGenerationRequests = {
    /**
     * @description You can use the following request to generate a key pair.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to generate key pair.
     *
     * @tags Key Pair
     * @name KeyPairGenerationRequestsCreate
     * @summary Generate a key pair.
     * @request POST:/KeyPairGenerationRequests
     * @secure
     */
    keyPairGenerationRequestsCreate: (
      query: {
        /**
         * Provide current keystore entries in the response.
         * @default "false"
         */
        returnKeystoreEntries: (true | false)[];
      },
      KeyPairGenerationRequest: ComSapHciApiKeyPairGenerationRequestCreate,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiKeyPairGenerationRequest;
        },
        OdataError
      >({
        path: `/KeyPairGenerationRequests`,
        method: "POST",
        query: query,
        body: KeyPairGenerationRequest,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  rsaKeyGenerationRequests = {
    /**
     * @description You can use the following request to generate an RSA key pair.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to generate key pair.<br>As 'Hexalias', provide any hexadecimal value; the system calculates the correct hexadecimal value from the specified 'Alias' property.<br>Note the following regarding the 'RSAFile': If you're using a simple HTTP request with a JSON body, the value of the property 'RSAFile' must contain the base64-encoded private key with padding.<br>Possible values for 'SignatureAlgorithm' are 'SHA-512/RSA', 'SHA-256/RSA', 'SHA-384/RSA', 'SHA-224/RSA', 'SHA-1/RSA'.<br>For private keys, only PKCS#1 format with a PEM header 'BEGIN RSA PRIVATE KEY' is supported. This operation can only by performed on the 'system' keystore.
     *
     * @tags Key Pair
     * @name RsaKeyGenerationRequestsCreate
     * @summary Generate an RSA key pair.
     * @request POST:/RSAKeyGenerationRequests
     * @secure
     */
    rsaKeyGenerationRequestsCreate: (
      query: {
        /**
         * Provide current keystore entries in the response.
         * @default "false"
         */
        returnKeystoreEntries: (true | false)[];
      },
      RSAKeyGenerationRequest: ComSapHciApiRSAKeyGenerationRequestCreate,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiKeyPairGenerationRequest;
        },
        OdataError
      >({
        path: `/RSAKeyGenerationRequests`,
        method: "POST",
        query: query,
        body: RSAKeyGenerationRequest,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  sshKeyGenerationRequests = {
    /**
     * @description You can use the following request to generate an SSH private key pair from an OpenSSH key (with cryptographic algorithms RSA, DSA or EC) or a PuTTY file (with cryptographic algorithms RSA or DSA, but not EC). The alias for the generated key pair depends on the algorithm: id_rsa, id_dsa or id_ec.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to generate key pair.
     *
     * @tags Key Pair
     * @name SshKeyGenerationRequestsCreate
     * @summary Generate SSH private key pair.
     * @request POST:/SSHKeyGenerationRequests
     * @secure
     */
    sshKeyGenerationRequestsCreate: (
      query: {
        /**
         * Provide current keystore entries in the response.
         * @default "false"
         */
        returnKeystoreEntries?: (true | false)[];
        /**
         * Update existing SSH key pair.
         * @default "false"
         */
        update: (true | false)[];
      },
      SSHKeyGenerationRequest: ComSapHciApiSSHKeyGenerationRequestCreate,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiSSHKeyGenerationRequestCreateResponse;
        },
        OdataError
      >({
        path: `/SSHKeyGenerationRequests`,
        method: "POST",
        query: query,
        body: SSHKeyGenerationRequest,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  keyPairResources = {
    /**
     * @description You can use the following request to import or update a key pair.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to add/update key pair.
     *
     * @tags Key Pair
     * @name KeyPairResourcesCreate
     * @summary Import/update a key pair.
     * @request POST:/KeyPairResources
     * @secure
     */
    keyPairResourcesCreate: (
      query: {
        /**
         * Verify signature of the top CA certificate.
         * @default "false"
         */
        fingerprintVerified: (true | false)[];
        /**
         * Provide current keystore entries in the response.
         * @default "false"
         */
        returnKeystoreEntries: (true | false)[];
        /**
         * Update existing key pair.
         * @default "false"
         */
        update: (true | false)[];
      },
      KeyPairResource: ComSapHciApiKeyPairResourceUpdate,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Collection of KeystoreEntry */
          d?: {
            results?: ComSapHciApiKeystoreEntry[];
          };
        },
        OdataError
      >({
        path: `/KeyPairResources`,
        method: "POST",
        query: query,
        body: KeyPairResource,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  certificateChainResourcesHexalias = {
    /**
     * @description You can use the following request to import a certificate chain.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions for the keystore.
     *
     * @tags Key Pair
     * @name ValueUpdate
     * @summary Import a certificate chain.
     * @request PUT:/CertificateChainResources('{Hexalias}')/$value
     * @secure
     */
    valueUpdate: (
      hexalias: string,
      query: {
        /**
         * Verify signature of the top CA certificate .
         * @default "false"
         */
        fingerprintVerified: (true | false)[];
        /**
         * Provide current keystore entries in the response.
         * @default "false"
         */
        returnKeystoreEntries: (true | false)[];
      },
      CertificateChainResource: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Collection of KeystoreEntry */
          d?: {
            results?: ComSapHciApiKeystoreEntry[];
          };
        },
        OdataError
      >({
        path: `/CertificateChainResources('${hexalias}')/$value`,
        method: "PUT",
        query: query,
        body: CertificateChainResource,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  keystoreEntries = {
    /**
     * @description You can use the following request to get all entries of a keystore.
     *
     * @tags Keystore Entry
     * @name KeystoreEntriesList
     * @summary Get all entries of a keystore.
     * @request GET:/KeystoreEntries
     * @secure
     */
    keystoreEntriesList: (
      query: {
        /**
         * Select the keystore, from which the certificate chain shall be exported: Tenant keystore ```system```, the backup keystore ```backup_admin_system``` or the key renewal keystore ```KeyRenewal```.
         * @default "system"
         */
        keystoreName: ("system" | "backup_admin_system" | "KeyRenewal")[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Alias"
          | "Hexalias"
          | "KeyType"
          | "LastModifiedBy"
          | "LastModifiedTime"
          | "Owner"
          | "Status"
          | "Type"
          | "Validity"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Collection of KeystoreEntry */
          d?: {
            results?: ComSapHciApiKeystoreEntry[];
          };
        },
        OdataError
      >({
        path: `/KeystoreEntries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  keystoreEntries69645F727361 = {
    /**
     * @description You can use the following request to export the public key of the provided certificate/key pair in OpenSSH format.
     *
     * @tags Keystore Entry
     * @name SshkeyValueList
     * @summary Export public key in OpenSSH format.
     * @request GET:/KeystoreEntries('69645F727361')/Sshkey/$value
     * @secure
     */
    sshkeyValueList: (params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/KeystoreEntries('69645F727361')/Sshkey/$value`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  keystoresKeystoreName = {
    /**
     * @description You can use the following request to get keystore properties and entries.
     *
     * @tags Keystore
     * @name KeystoresList
     * @summary Get keystore properties and entries.
     * @request GET:/Keystores('{KeystoreName}')
     * @secure
     */
    keystoresList: (
      keystoreName: ("system" | "backup_admin_system")[],
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems false
         */
        $select?: ("Entries" | "LastModifiedBy" | "LastModifiedTime" | "Size")[];
        /**
         * Expand related entities.
         * @uniqueItems true
         */
        $expand?: "Entries"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Collection of KeystoreEntry */
          d?: {
            results?: ComSapHciApiKeystoreEntry[];
          };
        },
        OdataError
      >({
        path: `/Keystores('${keystoreName}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to get the number of keystore entries.
     *
     * @tags Keystore
     * @name SizeValueList
     * @summary Get number of keystore entries.
     * @request GET:/Keystores('{KeystoreName}')/Size/$value
     * @secure
     */
    sizeValueList: (keystoreName: ("system" | "KeyRenewal")[], params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/Keystores('${keystoreName}')/Size/$value`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  keystoreResources = {
    /**
     * @description You can use the following request to import entries to the tenant keystore (target keystore name ```system```) or to back up the keystore entries owned by tenant administrator (target keystore name ```backup_admin_system```). For the import entries are ignored during import, which do not represent a X.509 certificate entry or a key pair entry with a certificate chain of X.509 certificates. The backup overwrites the old backup keystore. <br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to import the keystore entries.
     *
     * @tags Keystore
     * @name KeystoreResourcesCreate
     * @summary Import/back up a keystore.
     * @request POST:/KeystoreResources
     * @secure
     */
    keystoreResourcesCreate: (
      Keystore: ComSapHciApiKeystoreResourceCreate,
      query?: {
        /**
         * Only required for keystore import - must be deselected for backup. There are different options possible:<br>
         * * ```replace``` - old keystore entries are deleted and imported entries are added.<br>
         * * ```merge``` - only entries with new alias are added.<br>
         * * ```overwrite``` - all entries are uploaded and possibly replace existing entries with the same alias.
         * @default "overwrite"
         */
        importOption?: ("replace" | "merge" | "overwrite")[];
        /**
         * Provide current keystore entries with the import status in the response.
         * @default "true"
         */
        returnKeystoreEntries?: (true | false)[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Collection of KeystoreEntry */
          d?: {
            results?: ComSapHciApiKeystoreEntryImported[];
          };
        },
        OdataError
      >({
        path: `/KeystoreResources`,
        method: "POST",
        query: query,
        body: Keystore,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  keystoreResourcesKeystoreName = {
    /**
     * @description You can use the following request to export the public content of the keystore, which was created by SAP or tenant administrator.<br> For a private key entry the complete chain is exported as described in the following example: If the key pair entry has the alias ```test```, and has a chain of three certificates, the certificate of the entry gets the alias ```test``` in the exported keystore, the intermediate CA certificate gets the alias ```test_1```, and the root CA certificate gets the alias ```test_2```. If entries with ```test_1```or ```test_2``` already exist, an additional underscore ```_``` is added to the alias until it is unique.
     *
     * @tags Keystore
     * @name KeystoreResourcesList
     * @summary Export public keystore content.
     * @request GET:/KeystoreResources('{KeystoreName}')
     * @secure
     */
    keystoreResourcesList: (keystoreName: ("system" | "backup_admin_system")[], params: RequestParams = {}) =>
      this.request<
        {
          /** Collection of KeystoreEntry */
          d?: {
            results?: ComSapHciApiKeystoreResource[];
          };
        },
        OdataError
      >({
        path: `/KeystoreResources('${keystoreName}')`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  keystoreResourcesSystem = {
    /**
     * @description You can use the following request to retrieve backed up keystore entries or to delete several entries of the current keystore, which are owned by tenant administrator.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions for the keystore.
     *
     * @tags Keystore
     * @name KeystoreResourcesSystemUpdate
     * @summary Retrieve backed up/delete keystore entries.
     * @request PUT:/KeystoreResources('system')
     * @secure
     */
    keystoreResourcesSystemUpdate: (
      KeystoreResource: ComSapHciApiKeystoreEntryAliasMassdelete,
      query?: {
        /** Only for retrieving backed up keystore entries ```backup_admin_system``` must be selected. For deletion of several keystore entries this parameter is not relevant. */
        retrieveBackup?: "backup_admin_system"[];
        /** Only for deletion of keystore entries ```true``` must be selected. For retrieving backed up keystore entries this parameter is not relevant. */
        deleteEntries?: ("true" | "false")[];
        /**
         * Only relevant for retrieving backed up keystore entries (default ```overwrite```). There are different options possible:<br>
         * * ```replace``` - old keystore entries are deleted and imported entries are added.<br>
         * * ```overwrite``` - all entries are uploaded and possibly replace existing entries with the same alias.
         */
        importOption?: ("replace" | "overwrite")[];
        /**
         * Provide current keystore entries with the import status in the response.
         * @default "true"
         */
        returnKeystoreEntries?: (true | false)[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Collection of KeystoreEntry */
          d?: {
            results?: ComSapHciApiKeystoreEntryImported[];
          };
        },
        OdataError
      >({
        path: `/KeystoreResources('system')`,
        method: "PUT",
        query: query,
        body: KeystoreResource,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  historyKeystoreEntries = {
    /**
     * @description You can use the following request to get entries of the history keystore.
     *
     * @tags Keystore History
     * @name HistoryKeystoreEntriesList
     * @summary Get entries of the history keystore.
     * @request GET:/HistoryKeystoreEntries
     * @secure
     */
    historyKeystoreEntriesList: (
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems false
         */
        $select?: ("Alias" | "Hexalias" | "KeyType" | "LastModifiedBy" | "LastModifiedTime" | "Owner" | "Validity")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Collection of HistoryKeystoreEntry */
          d?: {
            results?: ComSapHciApiHistoryKeystoreEntry[];
          };
        },
        OdataError
      >({
        path: `/HistoryKeystoreEntries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  historyKeystoreEntriesHexalias = {
    /**
     * @description You can use the following request to get a keystore history entry for a certain alias.
     *
     * @tags Keystore History
     * @name HistoryKeystoreEntriesList
     * @summary Get keystore history entry by alias
     * @request GET:/HistoryKeystoreEntries('{Hexalias}')
     * @secure
     */
    historyKeystoreEntriesList: (
      hexalias: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems false
         */
        $select?: ("Alias" | "KeyType" | "LastModifiedBy" | "LastModifiedTime" | "Owner" | "Validity")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiHistoryKeystoreEntry;
        },
        OdataError
      >({
        path: `/HistoryKeystoreEntries('${hexalias}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to restore an entry from the keystore history to the renewal keystore.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions for the keystore.
     *
     * @tags Keystore History
     * @name HistoryKeystoreEntriesUpdate
     * @summary Restore an entry from history to renewal keystore.
     * @request PUT:/HistoryKeystoreEntries('{Hexalias}')
     * @secure
     */
    historyKeystoreEntriesUpdate: (
      hexalias: string,
      query: {
        /** URL encoded destination alias name (optional). If it is empty the new alias is provided in the form ```[number]_original alias```. */
        destinationAlias?: string;
        /**
         * Copy attribute must be ```true```
         * @default "true"
         */
        copy: (true | false)[];
      },
      KeystoreEntry: ComSapHciApiKeystoreEntryRename,
      params: RequestParams = {},
    ) =>
      this.request<void, OdataError>({
        path: `/HistoryKeystoreEntries('${hexalias}')`,
        method: "PUT",
        query: query,
        body: KeystoreEntry,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  certificateUserMappings = {
    /**
     * @description You can use the following request to get all certificate-to-user mappings.This resource is only available in the Neo environment.<br>For more information, see SAP Help Portal documentation at [Environment-Specific Aspects Integration Developers Should Know](https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/639a0612e32c498fa7480580d90c9ea6.html?locale=en-US).
     *
     * @tags Certificate-to-User Mapping
     * @name CertificateUserMappingsList
     * @summary Get all certificate-to-user mappings.
     * @request GET:/CertificateUserMappings
     * @secure
     */
    certificateUserMappingsList: (
      query?: {
        /**
         * Filter items only by user is supported.<br>
         * Example: ```User eq 'supplier1'``` returns certificate mapping for the user 'supplier1'
         */
        $filter?: string;
        /**
         * Order items by property values.
         * @uniqueItems true
         */
        $orderby?: (
          | "Id"
          | "Id desc"
          | "User"
          | "User desc"
          | "Certificate"
          | "Certificate desc"
          | "CreatedBy"
          | "CreatedBy desc"
          | "CreatedTime"
          | "CreatedTime desc"
          | "LastModifiedBy"
          | "LastModifiedBy desc"
          | "LastModifiedTime"
          | "LastModifiedTime desc"
          | "ValidUntil"
        )[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "User"
          | "Certificate"
          | "LastModifiedBy"
          | "LastModifiedTime"
          | "CreatedBy"
          | "CreatedTime"
          | "ValidUntil"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Collection of CertificateUserMapping */
          d?: {
            results?: ComSapHciApiCertificateUserMapping[];
          };
        },
        OdataError
      >({
        path: `/CertificateUserMappings`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add a new certificate-to-user mapping or to update the user of an existing mapping.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to create certificate-to-user mappings.This resource is only available in the Neo environment.<br>For more information, see SAP Help Portal documentation at [Environment-Specific Aspects Integration Developers Should Know](https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/639a0612e32c498fa7480580d90c9ea6.html?locale=en-US).
     *
     * @tags Certificate-to-User Mapping
     * @name CertificateUserMappingsCreate
     * @summary Add new certificate-to-user mapping.
     * @request POST:/CertificateUserMappings
     * @secure
     */
    certificateUserMappingsCreate: (
      CertificateUserMapping: ComSapHciApiCertificateUserMappingCreate,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiCertificateUserMapping;
        },
        OdataError
      >({
        path: `/CertificateUserMappings`,
        method: "POST",
        body: CertificateUserMapping,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  certificateUserMappingsId = {
    /**
     * @description You can use the following request to get a certificate-to-user mapping for a given Id.This resource is only available in the Neo environment.<br>For more information, see SAP Help Portal documentation at [Environment-Specific Aspects Integration Developers Should Know](https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/639a0612e32c498fa7480580d90c9ea6.html?locale=en-US).
     *
     * @tags Certificate-to-User Mapping
     * @name CertificateUserMappingsList
     * @summary Get certificate-to-user mapping.
     * @request GET:/CertificateUserMappings('{Id}')
     * @secure
     */
    certificateUserMappingsList: (
      id: string,
      query?: {
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("User" | "Certificate" | "LastModifiedBy" | "LastModifiedTime" | "CreatedBy" | "CreatedTime")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: ComSapHciApiCertificateUserMapping;
        },
        void | OdataError
      >({
        path: `/CertificateUserMappings('${id}')`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to delete certificate-to-user mapping.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete certificate-to-user mappings.This resource is only available in the Neo environment.<br>For more information, see SAP Help Portal documentation at [Environment-Specific Aspects Integration Developers Should Know](https://help.sap.com/docs/CLOUD_INTEGRATION/368c481cd6954bdfa5d0435479fd4eaf/639a0612e32c498fa7480580d90c9ea6.html?locale=en-US).
     *
     * @tags Certificate-to-User Mapping
     * @name CertificateUserMappingsDelete
     * @summary Delete certificate-to-user mapping.
     * @request DELETE:/CertificateUserMappings('{Id}')
     * @secure
     */
    certificateUserMappingsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, OdataError | void>({
        path: `/CertificateUserMappings('${id}')`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  accessPolicies = {
    /**
     * @description You can use the following request to get all access policies.<br>
     *
     * @tags Access Policies
     * @name AccessPoliciesList
     * @summary Get all access policies.
     * @request GET:/AccessPolicies
     * @secure
     */
    accessPoliciesList: (
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
         * For any filter use only the 'eq' operator.<br>
         * Example: ```RoleName eq 'AccessPolicy1'```.<br>
         * Available properties for filter: Id, RoleName, Description
         */
        $filter?: string;
        /**
         * Order items by property values 'RoleName' and/or 'Id'.
         * @uniqueItems true
         */
        $orderby?: ("Id" | "Id desc" | "RoleName" | "RoleName desc")[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: ("Id" | "RoleName" | "Description")[];
        /**
         * Related artifact references to be returned.
         * @uniqueItems true
         */
        $expand?: "ArtifactReferences"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiAccessPolicy[];
          };
        },
        OdataError
      >({
        path: `/AccessPolicies`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add access policies. You can also create respective artifact reference in one call.<br> **ArtifactReference** - Following values of the *Type* property: 'MESSAGE_QUEUE' 'GLOBAL_DATA_STORE' 'GLOBAL_VARIABLE' have only one value for the property *ConditionAttribute*: 'Name' Check the ArtifactReference model for more values.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to add user credentials.
     *
     * @tags Access Policies
     * @name AccessPoliciesCreate
     * @summary Add access policies.
     * @request POST:/AccessPolicies
     * @secure
     */
    accessPoliciesCreate: (AccessPolicy: ComSapHciApiAccessPolicyCreate, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/AccessPolicies`,
        method: "POST",
        body: AccessPolicy,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  accessPoliciesId = {
    /**
     * @description You can use the following request to delete access policy.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete access policies.
     *
     * @tags Access Policies
     * @name AccessPoliciesDelete
     * @summary Delete access policy with a certain Id.
     * @request DELETE:/AccessPolicies({Id})
     * @secure
     */
    accessPoliciesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, OdataError | void>({
        path: `/AccessPolicies(${id})`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description You can use the following request to update access policy.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to update access policies.
     *
     * @tags Access Policies
     * @name AccessPoliciesPartialUpdate
     * @summary Updates access policy with a certain Id.
     * @request PATCH:/AccessPolicies({Id})
     * @secure
     */
    accessPoliciesPartialUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, OdataError | void>({
        path: `/AccessPolicies(${id})`,
        method: "PATCH",
        secure: true,
        ...params,
      }),
  };
  artifactReferences = {
    /**
     * @description You can use the following request to get all artifact references.<br>
     *
     * @tags Artifact References
     * @name ArtifactReferencesList
     * @summary Get all artifact references.
     * @request GET:/ArtifactReferences
     * @secure
     */
    artifactReferencesList: (
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
         * For any filter use only the 'eq' operator.<br>
         * Example: ```Id eq 'ArtifactReference1'```.<br>
         * Available properties for filter: Id
         */
        $filter?: string;
        /**
         * Order items by property values.
         * @uniqueItems true
         */
        $orderby?: ("Id" | "Id desc" | "Name" | "Name desc")[];
        /**
         * Select properties to be returned.
         * @uniqueItems true
         */
        $select?: (
          | "Id"
          | "Name"
          | "Description"
          | "Type"
          | "ConditionAttribute"
          | "ConditionValue"
          | "ConditionType"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          d?: {
            results?: ComSapHciApiArtifactReference[];
          };
        },
        OdataError
      >({
        path: `/ArtifactReferences`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description You can use the following request to add artifact references to access policies. <br> **ArtifactReference** - Following values of the *Type* property: 'MESSAGE_QUEUE' 'GLOBAL_DATA_STORE' 'GLOBAL_VARIABLE' have only one value for the property *ConditionAttribute*: 'Name' Check the ArtifactReference model for more values.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to add user credentials.
     *
     * @tags Artifact References
     * @name ArtifactReferencesCreate
     * @summary Add artifact reference to access policy.
     * @request POST:/ArtifactReferences
     * @secure
     */
    artifactReferencesCreate: (ArtifactReference: ComSapHciApiArtifactReferenceCreatesep, params: RequestParams = {}) =>
      this.request<void, OdataError>({
        path: `/ArtifactReferences`,
        method: "POST",
        body: ArtifactReference,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  artifactReferencesId = {
    /**
     * @description You can use the following request to delete artifact reference.<br> In API sandbox only read APIs could be tested. You need to configure an API endpoint for your account, where you have the required write permissions to delete artifact reference.
     *
     * @tags Artifact References
     * @name ArtifactReferencesDelete
     * @summary Delete artifact reference with a certain Id.
     * @request DELETE:/ArtifactReferences({Id})
     * @secure
     */
    artifactReferencesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, OdataError | void>({
        path: `/ArtifactReferences(${id})`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
