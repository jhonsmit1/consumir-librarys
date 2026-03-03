import { NodeSDK } from "@opentelemetry/sdk-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { resourceFromAttributes } from "@opentelemetry/resources";

const serviceName = process.env.OTEL_SERVICE_NAME || "users-service";
const serviceVersion = process.env.OTEL_SERVICE_VERSION || "1.0.0";

const prometheusExporter = new PrometheusExporter(
  { port: 9464 },
  () => {
    console.log("Prometheus scrape endpoint: http://localhost:9464/metrics");
  }
);

const otlpTraceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318/v1/traces",
});

export const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    "service.name": serviceName,
    "service.version": serviceVersion,
  }),

  metricReader: prometheusExporter,
  traceExporter: otlpTraceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});
