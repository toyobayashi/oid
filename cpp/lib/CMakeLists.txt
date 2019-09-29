cmake_minimum_required(VERSION 3.6)

project(oid)

file(GLOB_RECURSE CURRENT_HEADERS src/*.h include/*.h src/*.hpp include/*.hpp)

aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR}/src srcDir)
add_library(oid STATIC ${srcDir} ${CURRENT_HEADERS})
target_include_directories(oid PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include)

if(WIN32 AND MSVC)
  source_group("Header Files" FILES ${CURRENT_HEADERS})
endif()
