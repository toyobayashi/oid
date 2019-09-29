cmake_minimum_required(VERSION 3.6)

project(oid)

add_executable(testoid main.cpp mocha.c)
target_link_libraries(testoid ${PROJECT_NAME})
