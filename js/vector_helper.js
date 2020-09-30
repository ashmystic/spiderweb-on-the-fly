class VectorHelper {

  static addVectors(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
  }
  
  static subtractVectors(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
  }
  
  static multiply(p, factor) {
    return new Point(p.x * factor, p.y * factor)
  }
  
  static divide(p, factor) {
    return new Point(p.x / factor, p.y / factor)
  }
  
}