import { trace } from "@opentelemetry/api";

export function startSpan(name: string, attributes?: Record<string, any>) {
  const tracer = trace.getTracer("next-app");
  const span = tracer.startSpan(name);

  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      span.setAttribute(key, value);
    }
  }

  return span;
}
