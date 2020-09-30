class Spider {
  
  constructor(position) {
    
    this.position = this.pointHub = position;
    this.destination = null;
    this.moveToPositionCallback = null;
    this.group = new Group();
    this.group.applyMatrix = false;
    this.angle = 0;
    
    this.animate = true;
    this.rotationToggle = true;
    
    this.animationStep = 2;
    
   var bodyCircleRadius = 12; 
    var bodyCircle = new Path.Circle({
      center: this.position,
      radius: bodyCircleRadius,
      // strokeColor: 'white'
      fillColor: 'white'
    });
    this.group.addChild(bodyCircle);
    this.bodyCircle = bodyCircle;
    
    var headCircleRadius = 8;
    var headCircle = new Path.Circle({
      center: new Point(this.position.x + bodyCircleRadius + headCircleRadius/2, this.position.y),
      radius: headCircleRadius,
      // strokeColor: 'white'
      fillColor: 'white'
    });
    this.group.addChild(headCircle);
    this.headCircle = headCircle;
    
    // Front left leg
    var leg1 = new Path();
    leg1.strokeWidth = 2;
    leg1.strokeColor = 'white';
    leg1.strokeCap = 'round';
    leg1.add(new Point(0, 0));
    leg1.add(new Point(10, -18));
    leg1.add(new Point(25, -12));
    leg1.position = new Point(this.position.x + bodyCircleRadius + headCircleRadius/2, this.position.y - headCircleRadius);
    this.group.addChild(leg1);
    this.leg1 = leg1;
    
    // Front right leg
    var leg2 = new Path();
    leg2.strokeWidth = 2;
    leg2.strokeColor = 'white';
    leg2.strokeCap = 'round';
    leg2.add(new Point(0, 0));
    leg2.add(new Point(10, 18));
    leg2.add(new Point(25, 12));
    leg2.position = new Point(this.position.x + bodyCircleRadius + headCircleRadius/2, this.position.y + headCircleRadius);
    this.group.addChild(leg2);
    this.leg2 = leg2;
    
    // Middle-front left leg
    var leg3 = new Path();
    leg3.strokeWidth = 2;
    leg3.strokeColor = 'white';
    leg3.strokeCap = 'round';
    leg3.add(new Point(0, 0));
    leg3.add(new Point(5, -18));
    leg3.add(new Point(15, -25));
    leg3.position = new Point(this.position.x + bodyCircleRadius / 2, this.position.y - bodyCircleRadius);
    this.group.addChild(leg3);
    this.leg3 = leg3;
    
    // Middle-front right leg
    var leg4 = new Path();
    leg4.strokeWidth = 2;
    leg4.strokeColor = 'white';
    leg4.strokeCap = 'round';
    leg4.add(new Point(0, 0));
    leg4.add(new Point(5, 18));
    leg4.add(new Point(15, 25));
    leg4.position = new Point(this.position.x + bodyCircleRadius / 2, this.position.y + bodyCircleRadius);
    this.group.addChild(leg4);
    this.leg4 = leg4;
    
    // Middle-back left leg
    var leg5 = new Path();
    leg5.strokeWidth = 2;
    leg5.strokeColor = 'white';
    leg5.strokeCap = 'round';
    leg5.add(new Point(0, 0));
    leg5.add(new Point(-5, -18));
    leg5.add(new Point(-15, -25));
    leg5.position = new Point(this.position.x - bodyCircleRadius / 2, this.position.y - bodyCircleRadius);
    this.group.addChild(leg5);
    this.leg5 = leg5;
    
    // Middle-back right leg
    var leg6 = new Path();
    leg6.strokeWidth = 2;
    leg6.strokeColor = 'white';
    leg6.strokeCap = 'round';
    leg6.add(new Point(0, 0));
    leg6.add(new Point(-5, 18));
    leg6.add(new Point(-15, 25));
    leg6.position = new Point(this.position.x - bodyCircleRadius / 2, this.position.y + bodyCircleRadius);
    this.group.addChild(leg6);
    this.leg6 = leg6;
    
    // Back left leg
    var leg7 = new Path();
    leg7.strokeWidth = 2;
    leg7.strokeColor = 'white';
    leg7.strokeCap = 'round';
    leg7.add(new Point(0, 0));
    leg7.add(new Point(-10, -12));
    leg7.add(new Point(-25, 0));
    leg7.position = new Point(this.position.x - bodyCircleRadius, this.position.y - headCircleRadius);
    this.group.addChild(leg7);
    this.leg7 = leg7;
    
    // Back-right leg
    var leg8 = new Path();
    leg8.strokeWidth = 2;
    leg8.strokeColor = 'white';
    leg8.strokeCap = 'round';
    leg8.add(new Point(0, 0));
    leg8.add(new Point(-10, 12));
    leg8.add(new Point(-25, 0));
    leg8.position = new Point(this.position.x - bodyCircleRadius, this.position.y + headCircleRadius);
    this.group.addChild(leg8);
    this.leg8 = leg8;
  }
  
  setPosition(position) {
    this.group.position = this.position = position;
  }
  
  moveToPosition(position, callback) {
    this.destination = position;
    this.animate = true;
    
    if(callback) {
      this.moveToPositionCallback = callback;
    }
  }
  
  setAngle(angle) {
    this.group.rotation = this.angle = angle;
  }
  
  
  update(event) {
    if(this.animate) {
      // Handle animating leg movement
      if((event.time % 0.25).toFixed(1) == 0.0) {
        this.rotationToggle = !this.rotationToggle;
        var angle = this.rotationToggle ? 10 : -10;
        
        this.leg1.rotate(angle, this.headCircle.position);
        this.leg2.rotate(angle, this.headCircle.position);
        
        this.leg3.rotate(-angle, this.headCircle.position);
        this.leg4.rotate(-angle, this.headCircle.position);
        
        this.leg5.rotate(angle, this.bodyCircle.position);
        this.leg6.rotate(angle, this.bodyCircle.position);
        
        this.leg7.rotate(-angle, this.bodyCircle.position);
        this.leg8.rotate(-angle, this.bodyCircle.position);
      }
      
      // Handle moving to a destination location
      if(this.destination != null) {
        var vector = VectorHelper.subtractVectors(this.destination, this.position);
        
        if(vector.length < this.animationStep) {
          this.setPosition(this.destination);
          this.animate = false;
          this.destination = null;
          log("Spider reached destination");
          if(this.moveToPositionCallback) {
            this.moveToPositionCallback();
          }
        } else {
          var nextPoint = VectorHelper.addVectors(this.position, VectorHelper.multiply(vector.normalize(), this.animationStep));
          this.setPosition(nextPoint);
          this.setAngle(vector.angle);
        }
      }
    }
  }
  
}