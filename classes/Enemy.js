class Enemy extends Sprite {
  constructor({ position = { x: 0, y: 0 } }, waypoints) {
    super({
      position,
      imageSrc: "assets/orc.png",
      frames: { max: 5, hold: 20 },
    });
    this.position = position;
    this.waypoints = waypoints;
    this.width = 80;
    this.height = 80;
    this.waypointIndex = 0;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.radius = 35;
    this.health = 100;
    this.velocity = {
      x: 0,
      y: 0,
    };
  }
  draw() {
    super.draw();

    //Health bar
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y - 8, this.width, 5);
    c.fillStyle = "green";
    c.fillRect(
      this.position.x,
      this.position.y - 8,
      (this.width * this.health) / 100,
      5
    );
  }
  update() {
    this.draw();
    super.update();

    const waypoint = this.waypoints[this.waypointIndex];
    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;
    const angle = Math.atan2(yDistance, xDistance);
    const speed = 1;
    this.velocity.x = Math.cos(angle) * speed;
    this.velocity.y = Math.sin(angle) * speed;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    if (
      Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
        Math.abs(this.velocity.x * 3) &&
      Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
        Math.abs(this.velocity.y * 3) &&
      this.waypointIndex < this.waypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }
}
