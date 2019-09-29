#ifndef __OID_HPP__
#define __OID_HPP__

#include <string>
#include <vector>
#include <ctime>
#include <iostream>
#include "oid.h"

class ObjectId {
private:
  object_id* oid;

public:
  ObjectId();
  ObjectId(const ObjectId&);
  ObjectId(const object_id&);
  ObjectId(uint32_t);
  ObjectId(const std::vector<uint8_t>&);
  ObjectId(const std::string&);
  ~ObjectId();

  operator object_id*();
  operator const object_id*();
  ObjectId& operator=(const ObjectId&);
  ObjectId& operator=(const object_id&);

  friend std::ostream& operator<<(std::ostream&, const ObjectId&);

  static std::vector<uint8_t> generate();
  static std::vector<uint8_t> generate(uint32_t);
  static ObjectId createFromHexString(const std::string&);
  static ObjectId createFromTime(uint32_t);

  static bool isValid(const std::vector<uint8_t>&);
  static bool isValid(const std::string&);

  std::string toHexString() const;
  bool equals(const std::string&) const;
  bool equals(const ObjectId&) const;
  bool equals(const std::vector<uint8_t>&) const;

  uint32_t getTimestamp() const;
};

ObjectId::operator object_id*() {
  return oid;
}

ObjectId::operator const object_id*() {
  return oid;
}

ObjectId& ObjectId::operator=(const ObjectId& id) {
  for (uint8_t i = 0; i < 12; i++) {
    oid->id[i] = id.oid->id[i];
  }
  return *this;
}

ObjectId& ObjectId::operator=(const object_id& coid) {
  for (uint8_t i = 0; i < 12; i++) {
    oid->id[i] = coid.id[i];
  }
  return *this;
}

ObjectId::~ObjectId() {
  delete oid;
  oid = nullptr;
}

ObjectId::ObjectId() {
  oid = new object_id;
  oid_construct(oid);
}

ObjectId::ObjectId(const object_id& coid) {
  oid = new object_id;
  oid_construct_with_oid(oid, &coid);
}

ObjectId::ObjectId(const ObjectId& other) {
  oid = new object_id;
  oid_construct_with_oid(oid, other.oid);
}

ObjectId::ObjectId(uint32_t time) {
  oid = new object_id;
  oid_construct_with_time(oid, time);
}

ObjectId::ObjectId(const std::vector<uint8_t>& buf) {
  oid = new object_id;
  oid_construct_with_buf(oid, buf.data(), static_cast<uint32_t>(buf.size()));
}

ObjectId::ObjectId(const std::string& str) {
  oid = new object_id;
  oid_construct_with_buf(oid, (const uint8_t*)str.c_str(), static_cast<uint32_t>(str.length()));
}

std::ostream& operator<<(std::ostream& os, const ObjectId& objectId) {
  os << objectId.toHexString();
  return os;
}

std::vector<uint8_t> ObjectId::generate() {
  return generate(static_cast<uint32_t>(time(nullptr)));
}

std::vector<uint8_t> ObjectId::generate(uint32_t time) {
  uint8_t buf[12] = { 0 };
  oid_generate(time, buf);
  return std::vector<uint8_t>(buf, buf + 12);
}

ObjectId ObjectId::createFromHexString(const std::string& hex) {
  object_id coid;
  oid_create_from_hex_string(hex.c_str(), &coid);
  return coid;
}

ObjectId ObjectId::createFromTime(uint32_t time) {
  object_id coid;
  oid_create_from_time(time, &coid);
  return coid;
}

bool ObjectId::isValid(const std::vector<uint8_t>& buf) {
  uint64_t len = buf.size();
  return (len == 12 || len == 24);
}

bool ObjectId::isValid(const std::string& str) {
  return oid_is_valid(str.c_str());
}

std::string ObjectId::toHexString() const {
  char res[25] = { 0 };
  oid_to_hex_string(oid, res);
  return res;
}

bool ObjectId::equals(const std::string& str) const {
  return static_cast<bool>(oid_equals_buf(oid, (const uint8_t*)str.c_str(), static_cast<uint32_t>(str.length())));
}

bool ObjectId::equals(const std::vector<uint8_t>& buf) const {
  return static_cast<bool>(oid_equals_buf(oid, buf.data(), static_cast<uint32_t>(buf.size())));
}

bool ObjectId::equals(const ObjectId& objectId) const {
  return static_cast<bool>(oid_equals_oid(oid, objectId.oid));
}

uint32_t ObjectId::getTimestamp() const {
  return oid_get_timestamp(oid);
}

#endif
