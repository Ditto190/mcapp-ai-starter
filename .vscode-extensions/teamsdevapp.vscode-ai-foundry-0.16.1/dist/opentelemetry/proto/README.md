# OpenTelemetry Protocol (OTLP) Proto Definitions

This folder contains Protocol Buffer (protobuf) definitions for the OpenTelemetry Protocol (OTLP), downloaded from the [OpenTelemetry Proto repository](https://github.com/open-telemetry/opentelemetry-proto).

## Purpose

These protobuf definitions are used to set up and run an OTLP gRPC server within this VS Code extension. The server receives telemetry data (traces, metrics, logs) from OpenTelemetry-compatible clients and processes them for display and analysis.

## Usage in This Project

The protobuf definitions are loaded and used by the `OtlpServerService` class (`src/service/otlp/otlpServerService.ts`) to:

## Dependencies

The protobuf definitions require these npm packages:

- `@grpc/grpc-js` - gRPC implementation for Node.js
- `@grpc/proto-loader` - Protocol Buffer loader for gRPC
