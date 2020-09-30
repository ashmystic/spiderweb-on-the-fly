class Fly {
  
  constructor(position) {
    this.position = this.pointHub = position;
    this.destination = null;
    this.group = new Group();
    this.group.applyMatrix = false;
    this.angle = 0;
    
    this.animate = true;
    this.rotationToggle = true;
    
    this.animationStep = 2;
    
    var bodyEllipseRadius = 12;
    var bodyEllipse = new Path.Ellipse({
      center: this.position,
      radius: [bodyEllipseRadius, bodyEllipseRadius / 3],
      fillColor: 'white'
    });
    this.group.addChild(bodyEllipse);
    this.bodyEllipse = bodyEllipse;
    
    var headCircleRadius = 4;
    var headCircle = new Path.Circle({
      center: new Point(this.position.x + bodyEllipseRadius + headCircleRadius / 2, this.position.y),
      radius: headCircleRadius,
      // strokeColor: 'white'
      fillColor: 'white'
    });
    this.group.addChild(headCircle);
    this.headCircle = headCircle;
    
    // Left wing
    var wing1 = new Path.Ellipse({
      center: this.position,
      radius: [bodyEllipseRadius, bodyEllipseRadius / 3],
      fillColor: 'white'
    });
    this.group.addChild(wing1);
    this.wing1 = wing1;
    
    // Right wing
    var wing2 = new Path.Ellipse({
      center: this.position,
      radius: [bodyEllipseRadius, bodyEllipseRadius / 3],
      fillColor: 'white'
    });
    this.group.addChild(wing2);
    this.wing2 = wing2;
  }
  
  setPosition(position) {
    this.group.position = this.position = position;
  }
  
  moveToPosition(position) {
    this.destination = position;
    this.animate = true;
  }
  
  setAngle(angle) {
    this.group.rotation = this.angle = angle;
  }
  
  update(event) {
    if (this.animate) {
      // Handle animating leg movement
      if ((event.time % 0.10).toFixed(1) == 0.0) {
        this.rotationToggle = !this.rotationToggle;
        var angle = this.rotationToggle ? 20 : -20;
    
        this.wing1.rotate(angle, this.headCircle.position);
        this.wing2.rotate(-angle, this.headCircle.position);
      }
    
      // Handle moving to a destination location
      if (this.destination != null) {
        var vector = VectorHelper.subtractVectors(this.destination, this.position);
    
        if (vector.length < this.animationStep) {
          this.setPosition(this.destination);
          this.animate = false;
          this.destination = null;
          log("Fly reached destination");
        } else {
          var nextPoint = VectorHelper.addVectors(this.position, VectorHelper.multiply(vector.normalize(), this.animationStep));
          this.setPosition(nextPoint);
          this.setAngle(vector.angle);
        }
      }
    }
  }
}