let x=[],y=[],r=40,circlesWeirds=[],vibracionAnillo=1;function setup(){createCanvas(windowWidth,windowHeight);for(let i=0;i<10;i++)circlesWeirds.push(new circleWeird)}function draw(){background(31,29,46),stroke(255),strokeWeight(1),noFill();for(let i=0;i<circlesWeirds.length;i++)circlesWeirds[i].render(),circlesWeirds[i].update(),circlesWeirds[i].edges();push(),translate(width/4,height/4),beginShape();for(let i=0;i<50;i++){let t=map(i,0,50,0,TWO_PI),e=width/7*cos(t)+random(0,3),s=width/7*sin(t)+random(0,3);vertex(e,s)}endShape(CLOSE),pop(),ellipse(width/1.1,height/7,width/9),ellipse(width/1.2,height/1.5,width/5),ellipse(width/1.2,height/1.5,width/2.5,width/12),translate(width/1.2,height/1.5),push(),beginShape();for(let i=0;i<50;i++){let t=map(i,0,50,0,TWO_PI),e=width/4*cos(t)+random(0,2),s=width/12*sin(t)+random(0,2);vertex(e,s)}endShape(CLOSE),pop(),push(),beginShape();for(let i=0;i<12;i++){let t=map(i,0,12,0,TWO_PI),e=width/16+2^i,s=e*cos(t),h=e*sin(t);vertex(s,h)}endShape(CLOSE),pop()}function circleWeird(t,e){for(this.position=t?t.copy():createVector(random(width),random(height)),this.r=e?.5*e:random(15,50),this.position=createVector(random(width),random(height)),this.r=random(30,60),this.vel=p5.Vector.random2D(),console.log(this.vel),this.total=round(random(5,12)),this.offset=[],i=0;i<this.total;i++)this.offset[i]=random(.5*-this.r,.5*this.r);this.update=function(){this.position.add(this.vel)},this.render=function(){push(),stroke(255),noFill(),translate(this.position.x,this.position.y),beginShape();for(let i=0;i<this.total;i++){let t=map(i,0,this.total,0,TWO_PI),e=this.r+this.offset[i],s=e*cos(t),h=e*sin(t);vertex(s,h)}endShape(CLOSE),pop()},this.edges=function(){this.position.x>width+this.r?this.position.x=-this.r:this.position.x<-this.r&&(this.position.x=width+this.r),this.position.y>height+this.r?this.position.y=-this.r:this.position.y<-this.r&&(this.position.y=height+this.r)}}
//# sourceMappingURL=sketch.js.map
