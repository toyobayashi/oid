cmake_minimum_required(VERSION 3.6)

project(oid)

add_executable(oidgen main.c)
target_link_libraries(oidgen ${PROJECT_NAME})
