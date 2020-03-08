#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "oid/oid.h"

#define OID_VERSION "1.0.0"

void printHelp(const char* exec_name) {
  printf("Usage: %s [options]\n", exec_name);
  printf("\nOptions:\n");
  printf("  -v, -V, --version   output the version number\n");
  printf("  -h, --help          output usage information\n");
  printf("  -n, --number <N>    output N number of ObjectIds\n");
  printf("\nRepo: https://github.com/toyobayashi/oid\n");
}

int main(int argc, const char** argv) {
  object_id id;
  int n;
  int i;
  char hex[25];

  if (argc <= 1) {
    oid_construct(&id);
    oid_to_hex_string(&id, hex);
    printf("%s\n", hex);
    return 0;
  }

  if (strcmp(argv[1], "-v") == 0 || strcmp(argv[1], "--version") == 0 || strcmp(argv[1], "-V") == 0) {
    printf("%s\n", OID_VERSION);
    return 0;
  }

  if (strcmp(argv[1], "-h") == 0 || strcmp(argv[1], "--help") == 0) {
    printHelp(argv[0]);
    return 0;
  }

  if (strcmp(argv[1], "-n") == 0 || strcmp(argv[1], "--number") == 0) {
    n = 1;
    if (argc >= 3) {
      n = atoi(argv[2]);
    }

    if (n == 0) {
      n = 1;
    }

    for (i = 0; i < n; i++) {
      oid_construct(&id);
      oid_to_hex_string(&id, hex);
      printf("%s\n", hex);
    }
    return 0;
  }

  printHelp(argv[0]);
  return 0;
}
