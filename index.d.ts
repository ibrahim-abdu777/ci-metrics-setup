export type RunStatus = "passed" | "failed" | "flaky" | "skipped" | "unknown";
export interface RunEntry { name: string; status: RunStatus; duration_ms: number | null; line: string; idx: number; }
export interface Summary { count: number; passed: number; failed: number; flaky: number; skipped: number; unknown: number; passRate: number; averageDurationMs: number; noDuration: number; }
export declare function loadMetrics(): RunEntry[];
export declare function latestEntry(metrics: RunEntry[]): RunEntry;
export declare function summarize(metrics: RunEntry[]): Summary;
