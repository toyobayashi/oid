# oid-cpp

C implemention for MongoDB ObjectID

This is a C++ library, not for Node.js.

## C API

``` c
// #include "oid/oid.h"
typedef struct object_id {
  uint8_t id[12];
} object_id;

OID_API int oid_construct(object_id* oid);
OID_API int oid_construct_with_time(object_id* oid, uint32_t time);
OID_API int oid_construct_with_buf(object_id* oid, const uint8_t* buf, uint32_t len);
OID_API int oid_construct_with_oid(object_id* oid, const object_id* other);

OID_API int oid_generate(uint32_t time, uint8_t* id);
OID_API int oid_create_from_hex_string(const char* hex_string, object_id* oid);
OID_API int oid_to_hex_string(const object_id* oid, char* res);
OID_API int oid_is_valid(const char* res);

OID_API int oid_equals_buf(const object_id* oid, const uint8_t* buf, uint32_t len);
OID_API int oid_equals_oid(const object_id* oid, const object_id* other);
OID_API int oid_create_from_time(uint32_t time, object_id* oid);
OID_API uint32_t oid_get_timestamp(const object_id* oid);
```

## C++ API

``` cpp
// #include "oid/oid.hpp"

class ObjectId {
private:
  object_id* oid;

public:
  ObjectId();
  ObjectId(ObjectId&&);
  ObjectId(const ObjectId&);
  ObjectId(const object_id&);
  ObjectId(uint32_t);
  ObjectId(const std::vector<uint8_t>&);
  ObjectId(const std::string&);
  ObjectId(const char*);
  ~ObjectId();

  ObjectId& operator=(const ObjectId&);
  ObjectId& operator=(ObjectId&&);

  bool operator==(const ObjectId&) const;

  friend std::ostream& operator<<(std::ostream&, const ObjectId&);

  static std::vector<uint8_t> generate();
  static std::vector<uint8_t> generate(uint32_t);
  static ObjectId createFromHexString(const std::string&);
  static ObjectId createFromTime(uint32_t);

  static bool isValid(const std::vector<uint8_t>&);
  static bool isValid(const std::string&);

  std::string toHexString() const;
  bool equals(const ObjectId&) const;
  const object_id* data() const;

  uint32_t getTimestamp() const;
};
```
