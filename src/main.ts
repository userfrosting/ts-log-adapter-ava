import TsLog from "ts-log";
import { LogFn } from "ava";

/**
 * Maps lib logging to ava logging to assist debugging of failing tests.
 * @param log - Log function from test execution context.
 * @public
 */
export function logAdapter(log: LogFn): TsLog.Logger {
    return {
        /* c8 ignore next 2 */
        debug(...optionalParams) {
            return log("DEBUG", ...optionalParams);
        },
        trace(...optionalParams) {
            return log("TRACE", ...optionalParams);
        },
        info(...optionalParams) {
            return log("INFO", ...optionalParams);
        },
        warn(...optionalParams) {
            return log("WARN", ...optionalParams);
        },
        error(...optionalParams) {
            return log("ERROR", ...optionalParams);
        },
    }
}
