file(GLOB_RECURSE TEST_SOURCE_FILES "test/*.c" "test/*.cpp")

add_executable(oidtest
  ${TEST_SOURCE_FILES}
)

# set_target_properties(oidtest PROPERTIES CXX_STANDARD 11)

target_link_libraries(oidtest oid)

if(WIN32 AND MSVC)
  set_directory_properties(PROPERTIES VS_STARTUP_PROJECT oidtest)
  # set_target_properties(oidtest PROPERTIES MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
  target_compile_options(oidtest PRIVATE /utf-8)
  target_compile_definitions(oidtest PRIVATE
    _CRT_SECURE_NO_WARNINGS
    UNICODE
    _UNICODE
  )
  if(BUILD_DLL)
    target_link_options(oidtest PRIVATE /ignore:4199 /DELAYLOAD:oid.dll)
  endif()
endif()
