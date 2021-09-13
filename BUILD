load("@npm//@bazel/typescript:index.bzl", "ts_project")
load("//:ava_node_test.bzl", "ava_node_test")

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

ava_node_test(
    name = "test",
    ava_entry_point = ":ava_runner.js",
    srcs = [
        ":compile_ts",
        ":package.json",
    ],
    deps = [
        "@npm//ava",
        "@npm//c8",
        "@npm//execa",
        "@npm//resolve-bin",
    ],
)
