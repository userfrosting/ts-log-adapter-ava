load("@npm//@bazel/typescript:index.bzl", "ts_project")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_test")

ts_project(
    name = "compile_ts",
    srcs = [
        "src/main.ts",
        "src/main.test.ts"
    ],
    deps = [
        "@npm//ava",
        "@npm//ts-log",
    ],
    source_map = True,
    declaration = True,
    out_dir = "dist"
)

nodejs_test(
    name = "test",
    entry_point = "@npm//:node_modules/ava/cli.js",
    data = [
        ":compile_ts",
        "@npm//ava",
        ":package.json"
    ],
)
