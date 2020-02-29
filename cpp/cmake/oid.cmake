set(SOURCE_FILES "src/oid.c")

if(BUILD_DLL)
  add_library(oid SHARED
    ${SOURCE_FILES}
  )

  target_compile_definitions(oid PRIVATE OID_BUILD_DLL)
else()
  add_library(oid STATIC
    ${SOURCE_FILES}
  )
endif()

# set_target_properties(oid PROPERTIES CXX_STANDARD 11)

# set_target_properties(oid PROPERTIES PREFIX "lib")

if(WIN32 AND MSVC)
  # target_link_libraries(oid ntdll)
  # set_target_properties(oid PROPERTIES MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
  target_compile_options(oid PRIVATE /utf-8)
  target_compile_definitions(oid PRIVATE
    _CRT_SECURE_NO_WARNINGS
    UNICODE
    _UNICODE
  )
else()
  if(BUILD_DLL)
    target_compile_options(oid PRIVATE -fPIC)
  endif()
endif()

target_include_directories(oid
  PUBLIC
    ${PROJECT_SOURCE_DIR}/include
)
