add_library(lib2b STATIC)

target_include_directories(lib2b
    PRIVATE src
    PUBLIC include
)

target_sources(lib2b PRIVATE
    src/foo.cc
)

add_executable(2b)

target_include_directories(2b
    PRIVATE src
    PUBLIC include
)

target_link_libraries(2b PRIVATE lib2b)

if(EMSCRIPTEN)
    target_sources(2b PRIVATE
        src/wasm-api/api.cc
    )

    set_target_properties(2b PROPERTIES
        OUTPUT_NAME "2bwasm"
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/web/packages/compiler/wasm"
    )
else()
    target_sources(2b PRIVATE
        src/cli/main.cc
    )
endif()
