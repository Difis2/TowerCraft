class Ally extends Sprite {
  constructor({ position = { x: 0, y: 0 } }) {
    super({
      position,
      imageSrc: "./../assets/mago.png",
      frames: {
        max: 4,
        hold: 20,
      },
      offset: {
        x: -18,
        y: -30,
      },
    });
    this.position = position;
    this.size = 32;
    this.center = {
      x: this.position.x + this.size / 2,
      y: this.position.y + this.size / 2,
    };
    this.projectiles = [];
    this.radius = 150;
    this.target;
  }
  draw() {
    super.draw();
    if (this.target || (!this.target && this.frames.current !== 0)) {
      super.update();
    }
    // c.beginPath();
    // c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    // c.fillStyle = "rgba(0,0,255,0.2)";
    // c.fill();
  }
  update() {
    this.draw();
    if (
      this.target &&
      this.frames.current === 3 &&
      this.frames.elapsed % this.frames.hold === 0
    ) {
      console.log("shoot");
      this.shoot();
    }
  }
  shoot() {
    this.projectiles.push(
      new Projectile({
        position: { x: this.center.x, y: this.center.y - 40 },
        enemy: this.target,
      })
    );
  }
}
