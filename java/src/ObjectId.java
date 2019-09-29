import java.util.Date;
import java.util.regex.Pattern;

public class ObjectId {
  private static int index = (int) Math.floor((Math.random() * 0xffffff));
  private static final byte[] PROCESS_UNIQUE = {(byte) Math.floor(Math.random() * 256),
    (byte) Math.floor(Math.random() * 256), (byte) Math.floor(Math.random() * 256),
    (byte) Math.floor(Math.random() * 256), (byte) Math.floor(Math.random() * 256)};

  private static Pattern checkForHexRegExp = Pattern.compile("^[0-9a-fA-F]{24}$");

  public static boolean cacheHexString = false;

  private byte[] id;
  private String __id = null;

  public static boolean isValid(String id) {
    if (id == null)
      return false;
    return id.length() == 12 || (id.length() == 24 && checkForHexRegExp.matcher(id).matches());
  }

  public static boolean isValid(Integer id) {
    return id != null;
  }

  public static boolean isValid(Long id) {
    return id != null;
  }

  public static boolean isValid(ObjectId id) {
    return id != null;
  }

  public static boolean isValid(byte[] id) {
    return id.length == 12;
  }

  private static int getInc() {
    return (ObjectId.index = (ObjectId.index + 1) % 0xffffff);
  }

  public static byte[] generate(long time) {
    int inc = ObjectId.getInc();
    byte[] buffer = new byte[12];

    buffer[3] = (byte) (time & 0xff);
    buffer[2] = (byte) ((time >> 8) & 0xff);
    buffer[1] = (byte) ((time >> 16) & 0xff);
    buffer[0] = (byte) ((time >> 24) & 0xff);

    buffer[4] = PROCESS_UNIQUE[0];
    buffer[5] = PROCESS_UNIQUE[1];
    buffer[6] = PROCESS_UNIQUE[2];
    buffer[7] = PROCESS_UNIQUE[3];
    buffer[8] = PROCESS_UNIQUE[4];

    buffer[11] = (byte) (inc & 0xff);
    buffer[10] = (byte) ((inc >> 8) & 0xff);
    buffer[9] = (byte) ((inc >> 16) & 0xff);

    return buffer;
  }

  public static byte[] generate() {
    long time = new Date().getTime() / 1000;
    return generate(time);
  }

  public Date getTimestamp() {
    Date timestamp = new Date();
    long time = readUInt32BE(id);
    // long time = (id[3] & 0xff) | ((id[2] & 0xff) << 8) | ((id[1] & 0xff) << 16) | ((id[0] & 0xff) << 24);
    timestamp.setTime((long) Math.floor(time) * 1000);
    return timestamp;
  }

  public long getGenerationTime() {
    return readUInt32BE(id);
  }

  public void setGenerationTime(long value) {
    id[3] = (byte) (value & 0xff);
    id[2] = (byte) ((value >> 8) & 0xff);
    id[1] = (byte) ((value >> 16) & 0xff);
    id[0] = (byte) ((value >> 24) & 0xff);
  }

  public static ObjectId createFromHexString(String string) throws Exception {
    if (string.length() != 24) {
      throw new Exception("Argument passed in must be a single String of 24 hex characters");
    }

    byte[] array = new byte[12];

    for (int i = 0; i < 24; i += 2) {
      array[i / 2] = Byte.valueOf(string.substring(i, i + 2), 16);
    }

    return new ObjectId(array);
  }

  public static ObjectId createFromTime(long time) {
    byte[] buffer = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

    buffer[3] = (byte) (time & 0xff);
    buffer[2] = (byte) ((time >> 8) & 0xff);
    buffer[1] = (byte) ((time >> 16) & 0xff);
    buffer[0] = (byte) ((time >> 24) & 0xff);

    return new ObjectId(buffer);
  }

  public ObjectId() {
    this.id = ObjectId.generate();
    if (ObjectId.cacheHexString)
      this.__id = this.toHexString();
  }

  public ObjectId(int id) {
    this.id = ObjectId.generate(id);
    if (ObjectId.cacheHexString)
      this.__id = this.toHexString();
  }

  public ObjectId(byte[] id) {
    this.id = id;

    if (ObjectId.cacheHexString)
      __id = toHexString();
  }

  public ObjectId(ObjectId id) {
    this.id = new byte[12];
    byte[] buffer = id.getId();
    System.arraycopy(buffer, 0, this.id, 0, buffer.length);
    if (ObjectId.cacheHexString)
      __id = id.getCachedId();
  }

  public ObjectId(String id) throws Exception {
    boolean valid = ObjectId.isValid(id);

    if (!valid && id != null) {
      throw new Exception(
        "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
    } else if (valid && id.length() == 24) {
      this.id = new byte[12];

      for (int i = 0; i < 24; i += 2) {
        int tmp = Integer.decode("0x" + id.substring(i, i + 2));
        this.id[i / 2] = (byte) tmp;
      }
    } else if (id != null && id.length() == 12) {
      this.id = new byte[12];

      for (int i = 0; i < 12; i++) {
        this.id[i] = (byte) id.charAt(i);
      }
    } else {
      throw new Exception(
        "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
    }

    if (ObjectId.cacheHexString)
      this.__id = this.toHexString();
  }

  public boolean equals(ObjectId otherId) {
    if (otherId == null)
      return false;
    return this.toString().equals(otherId.toString());
  }

  public boolean equals(String otherId) {

    if (ObjectId.isValid(otherId) && otherId.length() == 12 && this.id != null) {
      return otherId.equals(this.toString("binary"));
    }

    if (ObjectId.isValid(otherId) && otherId.length() == 24) {
      return otherId.toLowerCase().equals(this.toHexString());
    }

    return false;
  }

  public byte[] getId() {
    return id;
  }

  public String getCachedId() {
    return __id;
  }

  public String toHexString() {
    StringBuilder result = new StringBuilder();
    String hex;
    for (byte anId : id) {
      hex = String.format("%02x", anId);
      result.append(hex);
    }
    return result.toString();
  }

  public String toString(String type) {
    if (type.equals("binary")) {
      StringBuffer result = new StringBuffer();

      for (int i = 0; i < id.length; i++) {
        result.append((char) (id[i]));
      }
      return result.toString();
    }
    return toString();
  }

  @Override
  public String toString() {
    return toHexString();
  }

  private long readUInt32BE(byte[] buf) {
    long first = buf[0] & 0xff;
    long last = buf[3] & 0xff;

    long a = (long) Math.pow(2, 24);
    long b = (long) Math.pow(2, 16);
    long c = (long) Math.pow(2, 8);

    return first * a +
      (buf[1] & 0xff) * b +
      (buf[2] & 0xff) * c +
      last;
  }
}
