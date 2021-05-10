/* eslint-disable no-undef */

/** @type {typeof import('../dist/oid').ObjectId} */
var ObjectId;

if (typeof window === 'undefined') {
  require('should');
  ObjectId = require('../dist/oid.js').ObjectId;
} else {
  ObjectId = oid.ObjectId;
}

describe('ObjectIds', function() {
  it('should correctly handle objectId timestamps', function() {
    // var test_number = {id: ObjectI()};
    var a = ObjectId.createFromTime(1);
    a.id[0].should.eql(0);
    a.id[1].should.eql(0);
    a.id[2].should.eql(0);
    a.id[3].should.eql(1);
    a.getTimestamp().getTime().should.eql(1000);

    var b = new ObjectId();
    b.generationTime = 1;
    b.id[0].should.eql(0);
    b.id[1].should.eql(0);
    b.id[2].should.eql(0);
    b.id[3].should.eql(1);
    b.generationTime.should.eql(1);
    b.getTimestamp().getTime().should.eql(1000);
  });

  it('should correctly create ObjectId from uppercase hexstring', function() {
    var a = 'AAAAAAAAAAAAAAAAAAAAAAAA';
    var b = new ObjectId(a);
    var c = b.equals(a); // => false
    c.should.eql(true);

    a = 'aaaaaaaaaaaaaaaaaaaaaaaa';
    b = new ObjectId(a);
    c = b.equals(a); // => true
    c.should.eql(true);
    b.toString().should.eql(a);
  });

  if (typeof require !== 'undefined') {
    it('should correctly allow for node.js inspect to work with ObjectId', function() {
      var a = 'AAAAAAAAAAAAAAAAAAAAAAAA';
      var b = new ObjectId(a);
      require('util').inspect(b).should.equal('new ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa")')
    });
  }

  it('should isValid check input Buffer length', function() {
    var buffTooShort = new Uint8Array([]);
    var buffTooLong = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    var buff12Bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    ObjectId.isValid(buffTooShort).should.not.be.ok();
    ObjectId.isValid(buffTooLong).should.not.be.ok();
    ObjectId.isValid(buff12Bytes).should.be.ok();
  });

  it('should throw if a 12-char string is passed in with character codes greater than 256', function() {
    (function () { return new ObjectId('abcdefghijkl').toHexString() }).should.not.throw();
    (function () { return new ObjectId('abcdefŽhijkl').toHexString() }).should.throw(TypeError);
  });

  it('should correctly interpret timestamps beyond 2038', function() {
    var farFuture = new Date('2040-01-01T00:00:00.000Z').getTime();
    var a = new ObjectId(ObjectId.generate(farFuture / 1000));
    a.getTimestamp().getTime().should.eql(farFuture);
  });

  it('should construct with no arguments', function() {
    var o = new ObjectId();
    o.should.be.instanceof(ObjectId);
  });

  it('should have an `id` property', function() {
    var o = new ObjectId();
    o.should.have.property('id');
    o.id.should.have.length(12);
    ObjectId.isValid(o.id).should.be.ok();
  });

  it('should construct with a `time` argument', function() {
    var time = 1414093117;
    var o = new ObjectId(time);
    o.should.be.instanceof(ObjectId);
    o.toHexString().substr(0,8).should.eql('5449593d');
  });

  if (typeof window === 'undefined') {
    it('should construct with a `buffer` argument', function() {
      var buffer = Buffer.from([ 84, 73, 90, 217, 76, 147, 71, 33, 237, 231, 109, 144 ]);
      var o = new ObjectId(buffer);
      o.should.be.instanceof(ObjectId);
      o.id.should.be.instanceof(Uint8Array);
      o.toHexString().should.eql('54495ad94c934721ede76d90');
    });
  }
  
  it('should construct with a `Uint8Array` argument', function() {
    var buffer = new Uint8Array(12);
    var copy = [ 84, 73, 90, 217, 76, 147, 71, 33, 237, 231, 109, 144 ];
    for (var i = 0; i < 12; i++) {
      buffer[i] = copy[i];
    }
    var o = new ObjectId(buffer);
    o.should.be.instanceof(ObjectId);
    o.toHexString().should.eql('54495ad94c934721ede76d90');
  });

  it('should construct with a `hexString` argument', function() {
    var hexString = '54495ad94c934721ede76d90';
    var o = new ObjectId(hexString);
    o.should.be.instanceof(ObjectId);
    o.toHexString().should.eql(hexString);
  });

  it('should construct with `ObjectId.createFromTime(time)` and should have 0\'s at the end', function() {
    var time = 1414093117;
    var o = ObjectId.createFromTime(time);
    o.should.be.instanceof(ObjectId);
    o.toHexString().should.eql('5449593d0000000000000000');
  });

  it('should construct with `ObjectId.createFromHexString(hexString)`', function() {
    var hexString = '54495ad94c934721ede76d90';
    var o = ObjectId.createFromHexString(hexString);
    o.should.be.instanceof(ObjectId);
    o.toHexString().should.eql(hexString);
  });

  it('should correctly retrieve timestamp', function() {
    var testDate = new Date();
    var object1 = new ObjectId();
    var seconds1 = Math.floor(testDate.getTime()/1000);
    var seconds2 = Math.floor(object1.getTimestamp().getTime()/1000);
    seconds1.should.eql(seconds2);
  });

  it('should validate valid hex strings', function() {
    ObjectId.isValid('54495ad94c934721ede76d90').should.be.ok();
    ObjectId.isValid('aaaaaaaaaaaaaaaaaaaaaaaa').should.be.ok();
    ObjectId.isValid('AAAAAAAAAAAAAAAAAAAAAAAA').should.be.ok();
    ObjectId.isValid('000000000000000000000000').should.be.ok();
  });

  it('should validate legit ObjectId objects', function() {
    var o = new ObjectId();
    ObjectId.isValid(o).should.be.ok();
  });

  it('should invalidate bad strings', function() {
    ObjectId.isValid().should.not.be.ok();
    ObjectId.isValid(null).should.not.be.ok();
    ObjectId.isValid({}).should.not.be.ok();
    ObjectId.isValid([]).should.not.be.ok();
    ObjectId.isValid(true).should.not.be.ok();
    ObjectId.isValid('invalid').should.not.be.ok();
    ObjectId.isValid('').should.not.be.ok();
    ObjectId.isValid('zzzzzzzzzzzzzzzzzzzzzzzz').should.not.be.ok();
    ObjectId.isValid('54495-ad94c934721ede76d9').should.not.be.ok();
  });

  it('should evaluate equality with .equals()', function() {
    var id1 = new ObjectId();
    var id2 = new ObjectId(id1.toHexString());
    (id1.equals(id2)).should.be.true();
  });

  it('should evaluate equality with via deepEqual', function() {
    var id1 = new ObjectId();
    var id2 = new ObjectId(id1.toHexString());
    id1.id.should.eql(id2.id);

    var id3 = new ObjectId();
    id1.id.should.not.eql(id3.id, 'id1 is not the same as id3');
  });

  it('should generate valid hex strings', function() {
    var h = ObjectId.generate();
    ObjectId.isValid(h).should.be.ok();
  });

  it('should convert to a hex string for JSON.stringify', function() {
    var hexString = '54495ad94c934721ede76d90';
    var o = { o: new ObjectId(hexString) };
    var strngd = JSON.stringify(o);
    strngd.should.eql('{"o":"54495ad94c934721ede76d90"}');
  });

  it('should convert to a hex string for ObjectId.toString()', function() {
    var hexString = '54495ad94c934721ede76d90';
    var o = new ObjectId(hexString);
    o.toString().should.eql('54495ad94c934721ede76d90');
  });

  it('should throw and error if constructing with an invalid string', function() {
    (function(){
      new ObjectId('tttttttttttttttttttttttt');
    }).should.throw();
  });

  it('should not throw an error for objects without toString', function() {
    var obj = Object.create({}, { toString: { value: false, writeable: false } });
    obj.toString.should.not.be.ok();
    ObjectId.isValid(obj).should.not.be.ok();
  });

  if (typeof window === 'undefined') {
    it('should correctly create ObjectId from Buffer', function () {
      var a = 'AAAAAAAAAAAAAAAAAAAAAAAA';
      var b = new ObjectId(Buffer.from(a, 'hex'));
      var c = b.equals(a); // => false
      c.should.be.true()
  
      a = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      b = new ObjectId(Buffer.from(a, 'hex'));
      c = b.equals(a); // => true
      a.should.eql(b.toString())
      c.should.be.true()
    });
  }
});
