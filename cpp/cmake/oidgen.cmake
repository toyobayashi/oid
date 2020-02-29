set(BIN_SOURCE_FILES "src/main.c")

add_executable(oidgen ${BIN_SOURCE_FILES})

target_link_libraries(oidgen oid)

if(WIN32 AND MSVC)
  # set_target_properties(oidgen PROPERTIES MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
  target_compile_options(oidgen PRIVATE /utf-8)
  target_compile_definitions(oidgen PRIVATE
    _CRT_SECURE_NO_WARNINGS
    UNICODE
    _UNICODE
  )
  if(BUILD_DLL)
    target_link_options(oidgen PRIVATE /ignore:4199 /DELAYLOAD:oid.dll)
  endif()
endif()
