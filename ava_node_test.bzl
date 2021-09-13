"""NodeJS testing with AVA
"""

load("@build_bazel_rules_nodejs//:providers.bzl", "JSModuleInfo")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_test")

def _js_sources_impl(ctx):
    depsets = []
    for src in ctx.attr.srcs:
        if JSModuleInfo in src:
            provider = src[JSModuleInfo]
            files = provider.direct_sources
            depsets.append(files)
        if hasattr(src, "files"):
            depsets.append(src.files)
    sources = depset(transitive = depsets)

    ctx.actions.write(ctx.outputs.manifest, "".join([
        f.short_path + "\n"
        for f in sources.to_list()
        if f.path.endswith(".js") or f.path.endswith(".mjs")
    ]))

    return [DefaultInfo(files = sources)]

# Rule to get js sources from deps.
# Outputs a manifest file with the sources listed.
_js_sources = rule(
    implementation = _js_sources_impl,
    attrs = {
        "srcs": attr.label_list(
            allow_files = True,
        ),
    },
    outputs = {
        "manifest": "%{name}.MF",
    },
)

def ava_node_test(
        name,
        # AVA entrypoint, must be a Label
        ava_entry_point,
        srcs = [],
        data = [],
        deps = [],
        **kwargs):
    """Runs tests on NodeJS using the AVA test runner.

    Args:
        name: Name of the resulting label
        ava_entry_point: A label providing the test runner entry point.
        srcs: JavaScript source files containing Jasmine specs
        data: Runtime dependencies which will be loaded while the test executes
        deps: Other targets which produce JavaScript, such as ts_library
        **kwargs: Remaining arguments are passed to the test rule
    """
    _js_sources(
        name = "%s_js_sources" % name,
        srcs = srcs + deps,
        testonly = 1,
    )

    # what about npm deps?
    all_data = data + srcs + deps
    all_data.append(":%s_js_sources.MF" % name)
    all_data.append(Label("@build_bazel_rules_nodejs//third_party/github.com/bazelbuild/bazel/tools/bash/runfiles"))

    # Generate runfiles

    nodejs_test(
        name = name,
        data = all_data,
        entry_point = ava_entry_point,
        expected_exit_code = 0,
        **kwargs
    )
