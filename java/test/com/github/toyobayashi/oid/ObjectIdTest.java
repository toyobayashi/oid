package com.github.toyobayashi.oid;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class ObjectIdTest {
  @Test
  public void should_correctly_handle_objectId_timestamps() {
    ObjectId a = ObjectId.createFromTime(1);
    assertEquals(1000, a.getTimestamp().getTime());
  }

  @Test
  public void should_correctly_interpret_timestamps_beyond_2038() {
    Date date = new Date();
    long time = 2208988800000L;
    date.setTime(time);
    ObjectId id = new ObjectId(ObjectId.generate(date.getTime() / 1000));
    assertEquals(time, id.getTimestamp().getTime());
  }

  @Test
  public void should_correctly_create_ObjectId_from_uppercase_hexstring() throws Exception {
    String a = "AAAAAAAAAAAAAAAAAAAAAAAA";
    ObjectId b = new ObjectId(a);
    assertTrue(b.equals(a));

    a = "aaaaaaaaaaaaaaaaaaaaaaaa";
    b = new ObjectId(a);
    assertTrue(b.equals(a));
    assertEquals(a, b.toHexString());
  }

  @Test
  public void should_isValid_check_input_Buffer_length() {
    byte[] buffTooShort = {};
    byte[] buffTooLong = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 };
    byte[] buff12Bytes = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 };

    assertFalse(ObjectId.isValid(buffTooShort));
    assertFalse(ObjectId.isValid(buffTooLong));
    assertTrue(ObjectId.isValid(buff12Bytes));
  }

  @Test
  public void should_construct_with_a_idString_argument() throws Exception {
    String idString = "123456789012";
    ObjectId a = new ObjectId(idString);
    assertTrue(a.equals(idString));
  }

  @Test
  public void should_construct_with_createFromTime() {
    long time = 1414093117;
    assertEquals("5449593d0000000000000000", ObjectId.createFromTime(time).toHexString());
  }

  @Test
  public void should_correctly_retrieve_timestamp() {
    long seconds1 = new Date().getTime() / 1000;
    ObjectId object1 = new ObjectId();
    long seconds2 = object1.getTimestamp().getTime() / 1000;
    assertEquals(seconds1, seconds2);
  }

  @Test
  public void should_validate_valid_hex_strings() {
    assertTrue(ObjectId.isValid("54495ad94c934721ede76d90"));
    assertTrue(ObjectId.isValid("aaaaaaaaaaaaaaaaaaaaaaaa"));
    assertTrue(ObjectId.isValid("AAAAAAAAAAAAAAAAAAAAAAAA"));
    assertTrue(ObjectId.isValid("000000000000000000000000"));
    assertFalse(ObjectId.isValid("1"));
    assertTrue(ObjectId.isValid(ObjectId.generate()));
  }
}
