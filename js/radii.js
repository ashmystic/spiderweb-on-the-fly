class Radii {
  
  constructor(endPoint, startPoint) {
    this.endPoint = endPoint;
    this.currentPoint = startPoint;
    this.vector = VectorHelper.subtractVectors(endPoint, startPoint);
    
    this.intersectionPoint = startPoint;
    this.secondPoint = null;
    
    // Start a new Paper.js path
    var p = new Path();
    this.path = p;
    this.path.strokeColor = 'white';
    this.path.strokeWidth = 1;
    this.path.add(this.currentPoint);
    
    // var vector = this.destinationPoint - this.currentPoint;
    
  }
  
  addNextPoint(point) {
    this.currentPoint = point;
    this.path.add(this.currentPoint);
  }
  
  toString() {
    return "{Dest: " + this.endPoint.toString() + ", Curr: " + this.currentPoint.toString() + "}";
  }
}