cmake_minimum_required(VERSION 3.6)

project(oid)

set(LIB_NAME oid)
set(EXE_NAME oidgen)
set(TEST_EXE_NAME oidtest)

# set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
# set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

include(cmake/lib.cmake)
include(cmake/exe.cmake)

if(CCPM_BUILD_TEST)
  include(cmake/test.cmake)
  target_link_libraries(${TEST_EXE_NAME} cmocha)
endif()

execute_process(COMMAND node index.js
  WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
  OUTPUT_VARIABLE DEPS_LIST_oid
)

if(DEPS_LIST_oid)
  string(REPLACE "\n" ";" DEPS_LIST_oid ${DEPS_LIST_oid})
  foreach(pkg ${DEPS_LIST_oid})
    message("add_subdirectory: ${pkg} ${pkg}")
    add_subdirectory(${pkg} ${pkg})
  endforeach()
endif()
