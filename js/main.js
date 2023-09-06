let W = document.querySelector('.confetti').offsetWidth;
let H = document.querySelector('.confetti').offsetHeight;
const canvas = document.querySelector('.confetti');
const context = canvas.getContext("2d");
const maxConfettis = 20; // 흩날리는 개수
const particles = [];

const paperContainer = [
  "/image/paper01.png",
  "/image/paper02.png"
];

function selectRandomPaper() {
  const randomNum = Math.random();
  if (randomNum < 1) {
    return paperContainer[0];
  } else {
    return paperContainer[1];
  }
}

function selectRandomRotation() {
  // 0 또는 1 중에서 랜덤하게 선택하여 오른쪽 또는 왼쪽 회전 설정
  return Math.random() < 0.5 ? 1 : -1;
}

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
  // 이미지 넓이 세팅
  // x,y 값에 W값이랑 H값을 곱합니다.
  this.x = Math.random() * W; 
  this.y = -Math.random() * H;
  this.r = randomFromTo(12, 18); 
  this.d = Math.random() * maxConfettis;

  this.paper = selectRandomPaper(); 
  this.rotationDirection = selectRandomRotation(); // 랜덤 회전 방향 설정
  this.tiltAngleIncremental = (Math.random() + 0.05) * 0.1; // 3d 회전 속도 조절 
  this.rotateAngleIncremental = (Math.random() + 0.05) * 0.15; // 2d 회전 속도 조절
  this.tiltAngle = 0;
  this.rotateAngle = 0;
  this.speed = 0.1 + Math.random() * 0.12; // 이동 속도 조절
  this.opacity = 1;

  this.image = new Image();
  this.image.src = this.paper;

  this.draw = function () {
    context.save();

    // 현재 불투명도를 저장
    context.globalAlpha = this.opacity;

    // 현재 떨어지는 위치
    context.translate(this.x, this.y);

    if (this.paper === paperContainer[0]) {
      /*
        Math.cos(0) = 1, Math.sin(0) = 0
        transform(a, b, c, d, e, f)
        context.transform(Math.cos(this.tiltAngle), 0, Math.sin(this.tiltAngle), 1, 0, 0);
      */ 
      context.transform(Math.cos(this.tiltAngle), 0, 0.2, 1, 0, 0);
      context.rotate(this.rotateAngle * this.rotationDirection);

    } else if (this.paper === paperContainer[1]) {
      // 이미지 2번("paper02.png")에 대한 회전 설정 (오른쪽 또는 왼쪽)
      context.rotate(this.tiltAngle * this.rotationDirection);
    }

    // 그릴 이미지의 객체 [ x좌표, y좌표 시작 위치 ]
    context.drawImage(this.image, -this.r / 2, -this.r / 2, this.r, this.r);

    // 초기화
    context.restore();
  };

  this.update = function () {
    this.tiltAngle += this.tiltAngleIncremental;
    this.rotateAngle += this.rotateAngleIncremental;
    this.y += (Math.cos(this.d) + 1 + this.r / 2) * this.speed;
    this.x += Math.sin(this.d) * (Math.random() + 0.5); // 초기 이동 방향
    // if (this.y > 0.2 * H) {
    //   this.x -= Math.sin(this.d) * (Math.random() + 1); // 이미지가 40% 이상 내려올 때 이동 방향 변경
    // }
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

/* 다 그려주면 다시 그려주는 함수 */
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

// particles 배열에는 maxConfettis 개수만큼의 confettiParticle 객체가 저장되며,
// 이후에 애니메이션을 통해 이들을 그려서 화면에 표시
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
