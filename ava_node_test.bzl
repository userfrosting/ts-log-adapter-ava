"""NodeJS testing with AVA
"""

load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_test")

def ava_node_test(
        name,
        ava_entry_point,
        coverage,
        srcs = [],
        data = [],
        deps = [],
        **kwargs):
    """Runs tests on NodeJS using the AVA test runner.

    Args:
        name: Name of the resulting label
        ava_entry_point: AVA entrypoint of script which acts as interop
        coverage: Normalizes coverage
        srcs: JavaScript source files containing Jasmine specs
        data: Runtime dependencies which will be loaded while the test executes
        deps: Other targets which produce JavaScript, such as ts_library
        **kwargs: Remaining arguments are passed to the test rule
    """
    # what about npm deps?
    all_data = data + srcs + deps

    # Generate runfiles

    nodejs_test(
        name = name,
        data = all_data,
        entry_point = ava_entry_point,
        expected_exit_code = 0,
        _lcov_merger = coverage,
        **kwargs
    )
