/*
	Spiderweb Manager
*/
class Spiderweb_Manager {
  
  constructor(window, view) {
    
    // this.maxHeight = 300;
    this.maxHeight = 700;
    this.defaultStrokeWidth = 1;
    this.minNumberRadii = 6;
    this.maxNumberRadii = 9;
    this.radiiAngleOffset = 15;
    this.radiiLengthOffset = 0.3;
    this.radiiAnimationStep = 5;
    // this.radiiAnimationStep = 50;
    
    this.spiralDistanceStart = 5;
    this.spiralDistanceIncrement = 7;
    this.spiralDistanceOffset = 3;
    this.spiralAnimationStep = 2;
    // this.spiralAnimationStep = 50;
    
    this.netStrokeWidth = 1.5;
    this.netDistance = 15;
    this.netDistanceOffset = 3;
    this.hubRadius = 50;
    this.netAnimationStep = 2;
    // this.netAnimationStep = 50;
    
    this.timeUntilNextWebSeconds = 12;
    
  }

  init(windowWidth, windowHeight) {
    log("init");
    
    // Clear existing content
    project.activeLayer.removeChildren();
    
    this.windowHeight = windowHeight;
    this.width = windowWidth;
    this.height = Math.min(this.windowHeight, this.maxHeight);
    this.pointHub = new Point(this.width / 2, this.windowHeight / 2);
    
    this.minDimension = Math.min(this.width, this.height);
    // this.maxRadius = this.height / 6;
    this.maxRadius = this.minDimension * (2 / 5);
    
    this.spider = new Spider(this.pointHub);
    this.fly = new Fly(new Point(-50, this.height/2));
    
    // Scale down sizes for small web
    if(this.width < 450 || this.height < 450) {
      this.radiiAnimationStep = 3;
      
      this.spiralDistanceStart = 2;
      this.spiralDistanceIncrement = 4;
      this.spiralDistanceOffset = 1;
      this.spiralAnimationStep = 1;
      
      this.netDistance = 8;
      this.netDistanceOffset = 1;
      this.hubRadius = 20;
      this.netAnimationStep = 1;
      
      this.spider.scale(0.5);
      this.spider.animationStep = 1;
      this.fly.scale(0.5);
      this.fly.animationStep = 1;
    }
    
    // Info panel
    this.textItem = new PointText({
      content: '',
      point: new Point(20, 95),
      fontSize: 15,
      fillColor: 'white',
    });
    // Draw line underneath title
    var p = new Path([20, 120], [210, 120]);
    p.strokeColor = 'white';
    p.strokeWidth = this.defaultStrokeWidth;
    
    this.numberRadii = this.getRandomInt(this.minNumberRadii, this.maxNumberRadii);
    log("numberRadii: " + this.numberRadii);
    
    this.spiralDistance = this.spiralDistanceStart;
    this.totalWebLength = 0;
    
    this.radiiArray = [];
    this.currentRadiiIndex = 0;
    this.currentPoint = this.pointHub;
    this.nextPoint = null;
    
    this.path = new Path();
    this.path.strokeColor = 'white';
    this.path.strokeWidth = this.defaultStrokeWidth;
    this.path.add(this.currentPoint);
    
    this.areRadiiDrawn = false;
    this.isSpiralDrawn = false;
    this.isNetDrawn = false;
    this.isFlyCaught = false;
    this.isFlyWrapped = false;
    
    this.timeOnCompletion = 0;
    
    var self = this;
    view.onFrame = function(event) {
      self.update(event);
      self.spider.update(event);
      self.fly.update(event);
    }
    
  }

  /*
   * update(event)
   *
   * Function gets called by requestAnimationFrame several times per second
   */
  update(event) {
    
    var self = this;
    
    // Update info panel
    var stage = this.isFlyWrapped ? "(6/6) : Digesting"
               :  (this.isFlyCaught ? "(5/6) : Wrapping prey" 
                  : (this.isNetDrawn ? "(4/6) : Awaiting prey" 
                    : (this.isSpiralDrawn ? "(3/6) : Creating sticky net" 
                      : (this.areRadiiDrawn ? "(2/6) : Creating spiral" 
                        : "(1/6) : Creating radii"))));
    
    var timeLeft = this.timeOnCompletion === 0 ? "" : "Time until next web starts: " + (this.timeUntilNextWebSeconds - (event.time - this.timeOnCompletion)).toFixed(0);
    
    this.textItem.content = "SPIDERWEB (ON THE FLY)"
              + "\n(About: https://git.io/Jtczo)"
              + "\n"
              + "\nCurrent stage " + stage
              + "\nTotal silk spun: " + this.getLengthInMeters(this.totalWebLength + this.path.length) + " meters"
               + "\n\n\n\n" + timeLeft
         	 	;
    
    // Draw radii
    if(this.areRadiiDrawn === false) {
      this.areRadiiDrawn = this.updateGenerateRadii(event);
      
    // Draw outward spiral  
    } else if(this.isSpiralDrawn === false) {
      this.isSpiralDrawn = this.updateGenerateSpiral(event);
      
    // Draw sticky net  
    } else if(this.isNetDrawn === false) {
      this.isNetDrawn = this.updateGenerateNet(event);
      
    // Draw fly
    } else if(this.isFlyCaught === false) {
      this.isFlyCaught = this.updateCatchPrey(event);
      
    // Wrap prey
    } else if(this.isFlyWrapped === false) {
      
      // Move spider to prey
      this.spider.moveToPosition(this.fly.position, function() {
        self.fly.animate = false;
        self.isFlyWrapped = true;
        self.timeOnCompletion = event.time;
      
        self.fly.moveToPosition(this.pointHub);
      
        // Move spider back to center
        self.spider.moveToPosition(self.pointHub, function() {});
      });
      
    // Restart simulation after delay  
    } else {
      var elapsedTime = event.time - this.timeOnCompletion;
      // log("elapsedTime", elapsedTime);
        
      if(elapsedTime >= this.timeUntilNextWebSeconds) {
        // view.onFrame = null;
        this.init(this.width, this.windowHeight);
      }
    }
  }

  updateGenerateRadii(event) {
    var areRadiiDrawn = false;
    
    if (this.radiiArray.length === 0) {
      var radiiPointTemplate = new Point(0, -this.maxRadius);
      for (var i = 0; i < this.numberRadii; i++) {
    
        var lengthMultiplier = this.getRandomNum(1, 1 + this.radiiLengthOffset);
        var nextRadiiPoint = radiiPointTemplate.clone()
          .rotate(360 / this.numberRadii * i + this.getRandomInt(-this.radiiAngleOffset, this.radiiAngleOffset));
        nextRadiiPoint = VectorHelper.multiply(nextRadiiPoint, lengthMultiplier);
        var radii = new Radii(VectorHelper.addVectors(nextRadiiPoint, this.pointHub), this.pointHub);
        this.radiiArray.push(radii);
      }
      log("radiiArray", this.radiiArray.toString());
    } else {
    
      var radii = this.radiiArray[this.currentRadiiIndex];
      var vector = VectorHelper.subtractVectors(radii.endPoint, radii.currentPoint);
    
      if (vector.length <= this.radiiAnimationStep) {
        radii.addNextPoint(radii.endPoint);
        this.totalWebLength += radii.vector.length;
        log("Finished drawing radii " + this.currentRadiiIndex);
        this.currentRadiiIndex++;
      } else {
        var nextPoint = VectorHelper.addVectors(radii.currentPoint, VectorHelper.multiply(vector.normalize(), this.radiiAnimationStep))
        radii.addNextPoint(nextPoint);
        this.spider.setPosition(nextPoint);
        this.spider.setAngle(radii.vector.angle);
      }
    
      if (this.currentRadiiIndex == (this.numberRadii)) {
        areRadiiDrawn = true;
        this.currentRadiiIndex = 0;
        log("Finished drawing all radii");
      }
    }
    return areRadiiDrawn;
  }
  
  updateGenerateSpiral(event) {
    var isSpiralDrawn = false;
    
    if (this.currentRadiiIndex >= this.numberRadii) {
      this.currentRadiiIndex = 0;
    }
    
    var radii = this.radiiArray[this.currentRadiiIndex];
    
    if (this.nextPoint === null || this.currentPoint === this.nextPoint) {
      // Calculate the next point on the radii line to draw to
      this.spiralDistance += this.spiralDistanceIncrement;
      var nextPoint = VectorHelper.addVectors(this.pointHub, VectorHelper.multiply(radii.vector.normalize(), this.getRandomInt(this.spiralDistance - this.spiralDistanceOffset, this.spiralDistance + this.spiralDistanceOffset)));
      log("nextPoint", nextPoint.toString());
    
      // Check if point is within radii line (within bounds of web)
      var vector = VectorHelper.subtractVectors(nextPoint, this.pointHub);
      log("radii.vector", radii.vector.toString());
      log("vector", vector.toString());
    
      if (vector.length + this.hubRadius / 2 > radii.vector.length) {
        isSpiralDrawn = true;
        this.currentRadiiIndex--;
        this.setPathforNet();
        log("Finished drawing spiral");
    
      } else {
        radii.intersectionPoint = nextPoint;
    
        var circle = new Path.Circle(this.nextPoint, 1);
        circle.strokeColor = 'white';
    
        this.nextPoint = nextPoint;
      }
    } else {
      // Gradually draw to point on next radii line
    
      var vector = VectorHelper.subtractVectors(this.nextPoint, this.currentPoint);
    
      if (vector.length <= this.spiralAnimationStep) {
        this.addNextPoint(this.nextPoint);
        this.path.reduce();
        log("Finished drawing line for radii " + this.currentRadiiIndex);
        this.currentRadiiIndex++;
      } else {
        // Draw line to intermediate point
        var intermediatePoint = VectorHelper.addVectors(this.currentPoint, VectorHelper.multiply(vector.normalize(), this.spiralAnimationStep));
        this.addNextPoint(intermediatePoint);
    
        this.spider.setPosition(intermediatePoint);
        this.spider.setAngle(vector.angle);
      }
    }
    return isSpiralDrawn;
  }
  
  updateGenerateNet(event) {
    var isNetDrawn = false;
    
    if (this.currentRadiiIndex < 0) {
      this.currentRadiiIndex = this.numberRadii - 1;
    }
    
    var radii = this.radiiArray[this.currentRadiiIndex];
    
    if (this.nextPoint === null || this.currentPoint === this.nextPoint) {
      // Calculate the next point on the radii line to draw to
      var nextPoint = VectorHelper.subtractVectors(radii.intersectionPoint, VectorHelper.multiply(radii.vector.normalize(), this.getRandomInt(this.netDistance - this.netDistanceOffset, this.netDistance + this.netDistanceOffset)));
      log("nextPoint", nextPoint.toString());
    
      var vector = VectorHelper.subtractVectors(nextPoint, this.pointHub);
      log("radii.vector", radii.vector.toString());
      log("vector", vector.toString());
    
      // Check if next point is inside hub radius
      if (vector.length <= this.hubRadius) {
        isNetDrawn = true;
        log("Finished drawing net");
    
        this.currentPoint = this.nextPoint = null;
        this.spider.moveToPosition(this.pointHub);
    
      } else {
        radii.intersectionPoint = nextPoint;
    
        var circle = new Path.Circle(this.nextPoint, 1);
        circle.strokeColor = 'white';
    
        this.nextPoint = nextPoint;
    
      }
    } else {
      // Gradually draw to point on next radii line
    
      var vector = VectorHelper.subtractVectors(this.nextPoint, this.currentPoint);
      // console.log("Diff: " + vector + ", length:" + vector.length);
    
      if (vector.length <= this.netAnimationStep) {
        this.addNextPoint(this.nextPoint);
        this.path.reduce();
        log("Finished drawing line for radii " + this.currentRadiiIndex);
        this.currentRadiiIndex--;
      } else {
        // Draw line to intermediate point
        var intermediatePoint = VectorHelper.addVectors(this.currentPoint, VectorHelper.multiply(vector.normalize(), this.netAnimationStep));
        this.addNextPoint(intermediatePoint);
    
        this.spider.setPosition(intermediatePoint);
        this.spider.setAngle(vector.angle);
      }
    }
    return isNetDrawn;
  }
  
  updateCatchPrey(event) {
    var isFlyCaught = false;
    
    if (this.currentPoint === null) {
      this.currentPoint = this.fly.position;
    }
    
    // Set destination
    if (this.nextPoint === null) {
      var leftWindow = this.getRandomInt(this.pointHub.x - this.maxRadius + this.hubRadius * 2, this.pointHub.x - this.hubRadius);
      var rightWindow = this.getRandomInt(this.pointHub.x + this.hubRadius * 3, this.pointHub.x + this.maxRadius - this.hubRadius * 2);
      var x = Math.random() < 0.5 ? leftWindow : rightWindow;
    
      this.nextPoint = new Point(x, this.pointHub.y);
    
      // Gradually move to destination
    } else {
    
      var distance = this.nextPoint.x - this.currentPoint.x;
    
      if (distance <= this.fly.animationStep) {
        this.currentPoint = this.nextPoint;
        isFlyCaught = true;
        log("Fly reached destination");
      } else {
        var y = this.pointHub.y + (Math.sin(event.time) * this.maxRadius / 3);
        this.currentPoint = new Point(this.currentPoint.x + this.fly.animationStep, y);
        this.fly.setPosition(this.currentPoint);
      }
    }
    return isFlyCaught;
  }
  
  getLengthInMeters(pixels) {
    var dpi_x = document.getElementById('dpi').offsetWidth;
    
    // 39.37 inches in a meter
    return (pixels / dpi_x / 39.37).toFixed(2);
  }
  
  addNextPoint(point) {
    this.currentPoint = point;
    this.path.add(this.currentPoint);
  }
  
  setPathforNet() {
    this.totalWebLength += this.path.length;
    
    var p = new Path();
    this.path = p;
    this.path.strokeColor = "white";
    this.path.strokeWidth = this.netStrokeWidth;
  }
  
  getRandomNum(min, max) {
    return min + Math.random() * (max - min);
  }
  
  getRandomInt(min, max) {
    return Math.floor(min + Math.random() * (max-min+1));
  }
  
}