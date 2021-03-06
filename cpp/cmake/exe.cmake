file(GLOB_RECURSE EXE_SOURCE_FILES "src/bin/*.cpp" "src/bin/*.c")

add_executable(${EXE_NAME} ${EXE_SOURCE_FILES})

if(LIB_NAME)
  target_link_libraries(${EXE_NAME} ${LIB_NAME})
endif()

execute_process(COMMAND node -p "require('./package.json').version"
  WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
  OUTPUT_VARIABLE OID_VERSION
)
string(REPLACE "\n" "" OID_VERSION ${OID_VERSION})

target_compile_definitions(${EXE_NAME} PRIVATE OID_VERSION=\"${OID_VERSION}\")

if(WIN32 AND MSVC)
  # set_target_properties(${EXE_NAME} PROPERTIES MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
  target_compile_options(${EXE_NAME} PRIVATE /utf-8)
  target_compile_definitions(${EXE_NAME} PRIVATE
    _CRT_SECURE_NO_WARNINGS
    UNICODE
    _UNICODE
  )
  if(CCPM_BUILD_DLL AND LIB_NAME)
    target_link_options(${EXE_NAME} PRIVATE /ignore:4199 /DELAYLOAD:${LIB_NAME}.dll)
  endif()
endif()
