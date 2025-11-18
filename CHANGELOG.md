# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.2] - 2025-11-18

### Fixed - Critical Bugs
- **Token Refresh Race Condition**: Multiple parallel requests no longer trigger simultaneous OAuth token refreshes. Now uses `tokenRefreshPromise` for synchronization.
- **Unsafe JSON Parsing**: Fixed crash when request body is not JSON (FormData, Blob). Added safe try-catch fallback.
- **Redis Connection Race Condition**: Replaced inefficient polling with Promise-based `connectPromise` for parallel connection attempts.
- **CSRF Token Never Renewed**: Expired CSRF tokens are now automatically refreshed with 403 error retry using `csrfTokenPromise`.
- **Unsafe Redis Connection String Parsing**: Added validation to prevent crashes with invalid connection string formats.
- **Memory Leak - Event Listeners**: Redis event listeners are now properly removed in `CacheManager.close()`.

### Performance Optimizations
- Replaced redundant error handling patterns with `Promise.allSettled()` for parallel artifact loading
- Removed unnecessary OAuth token null checks
- Replaced expensive `JSON.stringify()` comparisons with reference equality (O(1) vs O(n))
- Cache key generation upgraded from MD5 to SHA-256
- Cached `DEBUG` environment variable to avoid repeated lookups (18+ per request)

### Security
- Cache key generation now uses SHA-256 instead of deprecated MD5 algorithm

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

