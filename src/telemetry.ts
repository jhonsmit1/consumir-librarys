// import { NodeSDK } from "@opentelemetry/sdk-node";
// import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
// import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";


// export const sdk = new NodeSDK({
//   serviceName: "consumer-service",
//   metricReader: new PeriodicExportingMetricReader({
//     exporter: new OTLPMetricExporter({
//       url: "http://localhost:4318/v1/metrics",
//     }),
//   }),
// });

import { NodeSDK } from "@opentelemetry/sdk-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";

const prometheusExporter = new PrometheusExporter(
  { port: 9464 },
  () => {
    console.log("Prometheus scrape endpoint: http://localhost:9464/metrics");
  }
);

export const sdk = new NodeSDK({
  metricReader: prometheusExporter,
});