cmake_minimum_required(VERSION 3.6)

project(oid)

set(LIB_NAME oid)
set(EXE_NAME "${LIB_NAME}main")

include(cmake/lib.cmake)
include(cmake/exe.cmake)
include(cmake/test.cmake)
