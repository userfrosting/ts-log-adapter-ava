import test, { LogFn } from "ava";
import { logAdapter } from "./main.js";

test("Log output matches expected", t => {
    const expectedSequence: [ string, ...any[] ][] = [
        [ "DEBUG" ],
        [ "DEBUG", undefined ],
        [ "DEBUG", { foo: "bar" } ],
        [ "DEBUG", "A debug message" ],
        [ "DEBUG", "Another debug message", { foo: "bar" } ],
        [ "TRACE" ],
        [ "TRACE", undefined ],
        [ "TRACE", { foo: "bar" } ],
        [ "TRACE", "A info message" ],
        [ "TRACE", "Another info message", { foo: "bar" } ],
        [ "INFO" ],
        [ "INFO", undefined ],
        [ "INFO", { foo: "bar" } ],
        [ "INFO", "A info message" ],
        [ "INFO", "Another info message", { foo: "bar" } ],
        [ "WARN" ],
        [ "WARN", undefined ],
        [ "WARN", { foo: "bar" } ],
        [ "WARN", "A warn message" ],
        [ "WARN", "Another warn message", { foo: "bar" } ],
        [ "ERROR" ],
        [ "ERROR", undefined ],
        [ "ERROR", { foo: "bar" } ],
        [ "ERROR", "A error message" ],
        [ "ERROR", "Another error message", { foo: "bar" } ],
    ];
    const inputs = expectedSequence.slice();
    const logInspector = (...values: any[]): void => {
        t.deepEqual(values, expectedSequence.shift());
    };
    logInspector.skip = logInspector;
    const mockLog: LogFn = logInspector;
    const logger = logAdapter(mockLog);

    t.plan(expectedSequence.length);

    for (const [ logLevel, ...args ] of inputs) {
        switch (logLevel) {
            case "DEBUG":
                logger.debug(...args);
                break;
            case "TRACE":
                logger.trace(...args);
                break;
            case "INFO":
                logger.info(...args);
                break;
            case "WARN":
                logger.warn(...args);
                break;
            case "ERROR":
                logger.error(...args);
                break;
            default:
                throw new Error(`Unexpected log level of ${logLevel}`);
        }
    }
});
