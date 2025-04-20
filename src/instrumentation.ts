import type { Logger } from "pino";
import { registerOTel } from "@vercel/otel";

declare global {
  // eslint-disable-next-line no-var
  var logger: Logger | undefined;

  // eslint-disable-next-line no-var
  var metrics:
    | {
        registry: import("prom-client").Registry;
        userSignups: import("prom-client").Counter<string>;
      }
    | undefined;
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const pino = (await import("pino")).default;
    const pinoLoki = (await import("pino-loki")).default;
    const promClient = await import("prom-client");

    const transport = pinoLoki({
      host: "http://localhost:3100", // Loki server address
      batching: true, // Enable batching of logs for better performance
      interval: 5, // Send logs every 5 seconds when batching
      labels: { app: "next-app" }, // Add application label to all logs
    });

    const logger = pino(transport);
    globalThis.logger = logger;

    const prometheusRegistry = new promClient.Registry();

    promClient.collectDefaultMetrics({
      register: prometheusRegistry,
    });

    // User signups counter
    const userSignups = new promClient.Counter({
      name: "user_signups_total",
      help: "Total number of user signups",
      labelNames: ["plan_type", "referral_source"],
      registers: [prometheusRegistry],
    });

    prometheusRegistry.registerMetric(userSignups);

    globalThis.metrics = {
      registry: prometheusRegistry,
      userSignups,
    };

    // Optional: enable OpenTelemetry tracing if you're using Vercel Observability
    //registerOTel();
  }
}
