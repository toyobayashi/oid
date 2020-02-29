cmake_minimum_required(VERSION 3.6)

project(oid)

if(BUILD_DLL AND NOT WIN32)
  set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -Wl,-rpath=$ORIGIN")
endif()

include(cmake/oid.cmake)
include(cmake/oidgen.cmake)
include(cmake/oidtest.cmake)
