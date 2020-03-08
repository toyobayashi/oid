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
endif()

execute_process(COMMAND node index.js
  WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
  OUTPUT_VARIABLE DEPS_LIST_oid
)

if(DEPS_LIST_oid)
  string(REPLACE "\n" ";" DEPS_LIST_oid ${DEPS_LIST_oid})
  foreach(pkg ${DEPS_LIST_oid})
    string(REPLACE "," ";" DEP_PATHS ${pkg})
    list(GET DEP_PATHS 0 ABSOLUTE_PATH)
    list(GET DEP_PATHS 1 RELATIVE_PATH)
    get_property(CCPM_SOURCE_LIST GLOBAL PROPERTY "CCPM_SOURCE_LIST")
    if(NOT CCPM_SOURCE_LIST)
      set_property(GLOBAL PROPERTY "CCPM_SOURCE_LIST" "${ABSOLUTE_PATH}")
      message("add_subdirectory: ${ABSOLUTE_PATH} ${RELATIVE_PATH}")
      add_subdirectory(${ABSOLUTE_PATH} ${RELATIVE_PATH})
    else()
      list(FIND CCPM_SOURCE_LIST ${ABSOLUTE_PATH} FIND_INDEX)
      if(${FIND_INDEX} MATCHES "-1")
        set_property(GLOBAL PROPERTY "CCPM_SOURCE_LIST" "${CCPM_SOURCE_LIST};${ABSOLUTE_PATH}")
        message("add_subdirectory: ${ABSOLUTE_PATH} ${RELATIVE_PATH}")
        add_subdirectory(${ABSOLUTE_PATH} ${RELATIVE_PATH})
      else()
        message("found ${ABSOLUTE_PATH}")
      endif()
    endif()
  endforeach()
endif()

if(CCPM_BUILD_TEST)
  target_link_libraries(${TEST_EXE_NAME} cmocha)
endif()