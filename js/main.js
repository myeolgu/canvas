let W = document.querySelector('.confetti').offsetWidth;
let H = document.querySelector('.confetti').offsetHeight;
const canvas = document.querySelector('.confetti');
const context = canvas.getContext("2d");
const maxConfettis = 40; // 흩날리는 개수
const particles = [];

const paperContainer = [
  "/image/paper01.png",
  "/image/paper02.png"
];

function selectRandomPaper() {
  const randomNum = Math.random();
  if (randomNum < 0.8) {
    return paperContainer[0];
  } else {
    return paperContainer[1];
  }
}

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
  // 이미지 넓이 세팅
  // x,y 값에 W값이랑 H값을 곱합니다.
  this.x = Math.random() * W; 
  this.y = -Math.random() * H;
  this.r = randomFromTo(6, 12); 
  this.d = Math.random() * maxConfettis;
  this.paper = selectRandomPaper(); 
  this.tiltAngleIncremental = Math.random() * 0.3; // 회전 속도 조절
  this.tiltAngle = 0;
  this.speed = 0.2 + Math.random() * 0;
  this.opacity = 1;

  this.image = new Image();
  this.image.src = this.paper;

  this.draw = function () {
    context.save();
    context.globalAlpha = this.opacity;
    context.translate(this.x, this.y);

    if (this.paper === paperContainer[0]) {
      // 이미지 1번("paper01.png")에 대한 3D 회전 설정
      context.transform(1, 0, 0, 1, 0, 0);
      context.transform(Math.cos(this.tiltAngle), 0, Math.sin(this.tiltAngle), 1, 0, 0);
      context.transform(Math.cos(0), Math.sin(0), -Math.sin(0), Math.cos(0), 0, 0); 
    } else if (this.paper === paperContainer[1]) {
      // 이미지 2번("paper02.png")에 대한 2D 회전 설정 유지
      context.rotate(this.tiltAngle);
    }
    context.drawImage(this.image, -this.r / 2, -this.r / 2, this.r, this.r);
    context.restore();
  };

  this.update = function () {
    this.tiltAngle += this.tiltAngleIncremental;
    this.y += (Math.cos(this.d) + 1 + this.r / 2) * this.speed;
    this.x += Math.sin(this.d) * 0.5; // x좌표 불규칙하게 이동
    if (this.y > H || this.opacity <= 0.01) {
      this.y = -Math.random() * H;
      this.x = Math.random() * W;
      this.opacity = 1;
    } else if (this.y > 0.8 * H) {
      this.opacity -= 0.03 + (0.004 * (H - this.y) / (0.2 * H));
      // 여기에서 80% 이상일 때 opacity를 0으로 설정
      if (this.opacity < 0.0) {
        this.opacity = 0;
      }
    }
  };
}

function Draw() {
  const results = [];
  requestAnimationFrame(Draw);
  context.clearRect(0, 0, W, window.innerHeight);

  for (var i = 0; i < maxConfettis; i++) {
    particles[i].update();
    results.push(particles[i].draw());
  }

  return results;
}

// 이미지 1번("paper01.png")에 대한 객체 생성 및 3D 회전 설정
for (var i = 0; i < maxConfettis; i++) {
  if (i % 2 === 0) {
    const particle = new confettiParticle();
    particles.push(particle);
  } else {
    particles.push(new confettiParticle());
  }
}

canvas.width = W;
canvas.height = H;
Draw();