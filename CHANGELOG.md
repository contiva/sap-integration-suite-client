# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2025-11-18

### Added
- **CacheManager Export**: `CacheManager` is now officially exported from the main package index, enabling connection pooling across multiple `SapClient` instances
- **Connection Pooling Support**: `SapClient` now accepts an optional `cacheManager` parameter in the config to share Redis connections

### Changed
- **External CacheManager Support**: `SapClient` can now use externally provided `CacheManager` instances for better resource management
- Internal tracking of external vs. internal cache managers to prevent improper disconnection

### Fixed
- **Cache Manager Export**: Fixed missing export that caused `TypeError: CacheManager is not a constructor` when trying to use connection pooling
- Proper cleanup handling for external vs. internal cache managers in `disconnect()` method

### Documentation
- Added documentation for Redis Connection Pooling implementation
- Updated README with connection pooling examples

## [2.0.0] - 2025-11-XX

### Added
- Initial TypeScript rewrite with full type safety
- Redis-based caching with stale-while-revalidate pattern
- Custom cache logger support for backend integration
- Comprehensive test suite
- Bug fixes for configuration handling and string escaping

### Breaking Changes
- Migrated from JavaScript to TypeScript
- Updated API structure and configuration format
- Enhanced error handling

---

[2.0.1]: https://github.com/contiva/sap-integration-suite-client/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/contiva/sap-integration-suite-client/releases/tag/v2.0.0

