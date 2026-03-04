cmake_minimum_required(VERSION 3.30)

project(2b)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_STATIC_LIBRARY_PREFIX "")
set(CMAKE_SHARED_LIBRARY_PREFIX "")

if(EMSCRIPTEN)
    add_link_options(-sMODULARIZE=1 -sEXPORT_ES6=1)
endif()

add_subdirectory(compiler)
