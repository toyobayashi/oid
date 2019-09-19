require("should");
var ObjectId = require("../");

describe("ObjectIds", function() {
  it("should construct with no arguments", function() {
    var o = new ObjectId();
    o.should.be.instanceof(ObjectId);
  });

  it("should have an `id` property", function() {
    var o = new ObjectId();
    o.should.have.property("id");
    o.id.should.have.length(12);
    ObjectId.isValid(o.id).should.not.be.ok;
  });

  it("should construct with a `time` argument", function() {
    var time = 1414093117;
    var o = new ObjectId(time);
    o.should.be.instanceof(ObjectId);
    o.toHexString().substr(0,8).should.eql("5449593d");
  });

  it("should construct with an `array` argument", function() {
    var array = [ 84, 73, 90, 217, 76, 147, 71, 33, 237, 231, 109, 144 ];
    var o = new ObjectId(array);
    o.should.be.instanceof(ObjectId);
    o.toHexString().should.eql("54495ad94c934721ede76d90");
  });

  it("should construct with a `buffer` argument", function() {
    var buffer = Buffer.from([ 84, 73, 90, 217, 76, 147, 71, 33, 237, 231, 109, 144 ]);
    var o = new ObjectId(buffer);
    o.should.be.instanceof(ObjectId);
    o.toHexString().should.eql("54495ad94c934721ede76d90");
  });

  it("should construct with a `hexString` argument", function() {
    var hexString = "54495ad94c934721ede76d90";
    var o = new ObjectId(hexString);
    o.should.be.instanceof(ObjectId);
    o.toHexString().should.eql(hexString);
  });

  it("should construct with a `idString` argument", function() {
    var idString = "TIZÙLG!íçm";
    var o = new ObjectId(idString);
    o.should.be.instanceof(ObjectId);
    o.id.should.eql(idString);
  });

  it("should construct with `ObjectId.createFromTime(time)` and should have 0's at the end", function() {
    var time = 1414093117;
    var o = ObjectId.createFromTime(time);
    o.should.be.instanceof(ObjectId);
    o.toHexString().should.eql("5449593d0000000000000000");
  });

  it("should construct with `ObjectId.createFromHexString(hexString)`", function() {
    var hexString = "54495ad94c934721ede76d90";
    var o = ObjectId.createFromHexString(hexString);
    o.should.be.instanceof(ObjectId);
    o.toHexString().should.eql(hexString);
  });

  it("should correctly retrieve timestamp", function() {
    var testDate = new Date();
    var object1 = new ObjectId();
    var seconds1 = Math.floor(testDate.getTime()/1000);
    var seconds2 = Math.floor(object1.getTimestamp().getTime()/1000);
    seconds1.should.eql(seconds2);
  });

  it("should validate valid hex strings", function() {
    ObjectId.isValid("54495ad94c934721ede76d90").should.be.ok;
    ObjectId.isValid("aaaaaaaaaaaaaaaaaaaaaaaa").should.be.ok;
    ObjectId.isValid("AAAAAAAAAAAAAAAAAAAAAAAA").should.be.ok;
    ObjectId.isValid("000000000000000000000000").should.be.ok;
  });

  it("should validate legit ObjectId objects", function() {
    var o = new ObjectId();
    ObjectId.isValid(o).should.be.ok;
  });

  it("should invalidate bad strings", function() {
    ObjectId.isValid().should.not.be.ok;
    ObjectId.isValid(null).should.not.be.ok;
    ObjectId.isValid({}).should.not.be.ok;
    ObjectId.isValid([]).should.not.be.ok;
    ObjectId.isValid(true).should.not.be.ok;
    ObjectId.isValid("invalid").should.not.be.ok;
    ObjectId.isValid("").should.not.be.ok;
    ObjectId.isValid("zzzzzzzzzzzzzzzzzzzzzzzz").should.not.be.ok;
    ObjectId.isValid("54495-ad94c934721ede76d9").should.not.be.ok;
  });

  it("should evaluate equality with .equals()", function() {
    var id1 = new ObjectId();
    var id2 = new ObjectId(id1.toHexString());
    (id1.equals(id2)).should.be.true;
  });

  it("should evaluate equality with via deepEqual", function() {
    var id1 = new ObjectId();
    var id2 = new ObjectId(id1.toHexString());
    id1.should.eql(id2);

    var id3 = new ObjectId();
    id1.should.not.eql(id3, "id1 is not the same as id3");
  });

  it("should generate valid hex strings", function() {
    var h = ObjectId.generate();
    ObjectId.isValid(h).should.be.ok;
  });

  it("should convert to a hex string for JSON.stringify", function() {
    var hexString = "54495ad94c934721ede76d90";
    var o = { o: new ObjectId(hexString) };
    var strngd = JSON.stringify(o);
    strngd.should.eql('{"o":"54495ad94c934721ede76d90"}');
  });

  it("should convert to a hex string for ObjectId.toString()", function() {
    var hexString = "54495ad94c934721ede76d90";
    var o = new ObjectId(hexString);
    o.toString().should.eql("54495ad94c934721ede76d90");
  });

  it("should throw and error if constructing with an invalid string", function() {
    (function(){
      var o = new ObjectId("tttttttttttttttttttttttt");
    }).should.throw();
  });

  it("should not throw an error for objects without toString", function() {
    var obj = Object.create({}, { toString: { value: false, writeable: false } });
    obj.toString.should.not.be.ok;
    ObjectId.isValid(obj).should.not.be.ok;
  });
});
