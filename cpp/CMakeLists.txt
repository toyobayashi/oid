cmake_minimum_required(VERSION 3.6)

project(oid)

set(LIB_NAME oid)
set(EXE_NAME oidgen)
set(TEST_EXE_NAME oidtest)

# set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

include(cmake/lib.cmake)
include(cmake/exe.cmake)
include(cmake/test.cmake)

execute_process(COMMAND node index.js
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE DEPS_LIST
)
execute_process(COMMAND node index.js lib
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE LIB_LIST
)

if(DEPS_LIST)
  string(REPLACE "\n" ";" DEPS_LIST ${DEPS_LIST})
  foreach(pkg ${DEPS_LIST})
    message("add_subdirectory: ${pkg}")
    add_subdirectory(${pkg})
  endforeach()
endif()

if(LIB_LIST)
  string(REPLACE "\n" ";" LIB_LIST ${LIB_LIST})
  target_link_libraries(oid ${LIB_LIST})
endif()
