cmake_minimum_required(VERSION 3.6)

project(oid)

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/lib/include)

if(WIN32 AND MSVC)
  set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT testoid)
  add_definitions("-D_CRT_SECURE_NO_WARNINGS -DUNICODE -D_UNICODE")
  set(
    CompilerFlags
    # CMAKE_CXX_FLAGS
    # CMAKE_CXX_FLAGS_DEBUG
    CMAKE_CXX_FLAGS_RELEASE
    # CMAKE_C_FLAGS
    # CMAKE_C_FLAGS_DEBUG
    CMAKE_C_FLAGS_RELEASE
  )
  foreach(CompilerFlag ${CompilerFlags})
    string(REPLACE "/MD" "/MT" ${CompilerFlag} "${${CompilerFlag}}")
  endforeach()

  set(CMAKE_C_FLAGS "/utf-8 ${CMAKE_C_FLAGS}")
  set(CMAKE_CXX_FLAGS "/utf-8 ${CMAKE_CXX_FLAGS}")
else()
  set(CMAKE_C_FLAGS_RELEASE "-static ${CMAKE_C_FLAGS_RELEASE}")
  set(CMAKE_CXX_FLAGS_RELEASE "-static ${CMAKE_CXX_FLAGS_RELEASE}")
endif()

add_subdirectory(lib)
add_subdirectory(test)

if(WIN32 AND MSVC)
  if(CMAKE_CL_64)
    set_target_properties(testoid PROPERTIES VS_DEBUGGER_WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/build/win32/x64/test/Debug")
  else()
    set_target_properties(testoid PROPERTIES VS_DEBUGGER_WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/build/win32/ia32/test/Debug")
  endif()
endif()
