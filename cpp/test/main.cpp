#include <iostream>
#include <vector>
#ifdef _WIN32
#include <cstdlib>
#endif
#include <oid/oid.hpp>
#include "mocha.h"

static int should_correctly_handle_objectId_timestamps() {
  ObjectId a = ObjectId::createFromTime(1);
  expect(a.getTimestamp() == 1);
  return 0;
}

static int should_correctly_interpret_timestamps_beyond_2038() {
  ObjectId id(ObjectId::generate(2208988800));
  expect(id.getTimestamp() == 2208988800);
  return 0;
}

static int should_correctly_create_ObjectId_from_uppercase_hexstring() {
  std::string a = "AAAAAAAAAAAAAAAAAAAAAAAA";
  ObjectId b(a);
  expect(b.equals(a) == true);

  a = "aaaaaaaaaaaaaaaaaaaaaaaa";
  b = ObjectId(a);
  expect(b.equals(a) == true);
  expect(b.toHexString() == a);
  return 0;
}

static int should_print() {
  ObjectId a;
  std::cout << "    " << a << std::endl;
  return 0;
}

static int should_isValid_check_input_Buffer_length() {
  std::vector<uint8_t> buffTooShort = {};
  std::vector<uint8_t> buffTooLong = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 };
  std::vector<uint8_t> buff12Bytes = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 };

  expect(ObjectId::isValid(buffTooShort) == false);
  expect(ObjectId::isValid(buffTooLong) == false);
  expect(ObjectId::isValid(buff12Bytes) == true);
  return 0;
}

static int should_construct_with_a_idString_argument() {
  std::string idString = "123456789012";
  ObjectId a(idString);
  expect(a.equals(idString) == true);
  return 0;
}

static int should_construct_with_createFromTime() {
  uint32_t time = 1414093117;
  expect(ObjectId::createFromTime(time).toHexString() == "5449593d0000000000000000");
  return 0;
}

static int should_correctly_retrieve_timestamp() {
  uint32_t seconds1 = (uint32_t)time(nullptr);
  ObjectId object1;
  uint32_t seconds2 = object1.getTimestamp();
  expect(seconds1 == seconds2);
  return 0;
}

static int should_validate_valid_hex_strings() {
  expect(ObjectId::isValid("54495ad94c934721ede76d90") == true);
  expect(ObjectId::isValid("aaaaaaaaaaaaaaaaaaaaaaaa") == true);
  expect(ObjectId::isValid("AAAAAAAAAAAAAAAAAAAAAAAA") == true);
  expect(ObjectId::isValid("000000000000000000000000") == true);
  expect(ObjectId::isValid(ObjectId::generate()) == true);
  return 0;
}

int main () {
#ifdef _WIN32
  system("chcp 65001");
#endif
  int res = 0;
  res = describe("ObjectId",
    should_print,
    should_correctly_interpret_timestamps_beyond_2038,
    should_correctly_create_ObjectId_from_uppercase_hexstring,
    should_isValid_check_input_Buffer_length,
    should_correctly_handle_objectId_timestamps,
    should_construct_with_a_idString_argument,
    should_construct_with_createFromTime,
    should_correctly_retrieve_timestamp,
    should_validate_valid_hex_strings);
  return res;
}
