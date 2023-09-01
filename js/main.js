let W = window.innerWidth;
let H = document.getElementById('confetti').offsetHeight;
const canvas = document.getElementById('confetti');
const context = canvas.getContext("2d");
const maxConfettis = 40;
const particles = [];

const paperContainer = [
  "/image/paper01.png",
  "/image/paper02.png"
];

// 이미지 호출 확률
function selectRandomPaper() {
  const randomNum = Math.random();
  if (randomNum < 0.8) {
    return paperContainer[0]; // "paper01.png" 선택 확률: 80%
  } else {
    return paperContainer[1]; // "paper02.png" 선택 확률: 20%
  }
}

// 무작위 정수 생성 함수
// ConfettiParticle의 크기를 무작위로 설정
function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

// ConfettiParticle 생성자 함수
function confettiParticle() {
  this.x = Math.random() * W; // 이미지의 넓이
  this.y = -Math.random() * H; // 이미지의 높이
  this.r = randomFromTo(6, 12); // 넓이는 6px ~ 12px로 랜덤으로 나오게 세팅
  this.d = Math.random() * maxConfettis - 6; // 0 이상 maxConfettis의 값 미만의 무작위 숫자를 생성
  this.paper = selectRandomPaper(); // 무작위 이미지 선택
  this.tilt = Math.floor(Math.random() * 12) - 6;
  this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
  this.tiltAngle = 0;
  this.speed = 0.3 + Math.random() * 0; // 떨어지는 속도
  this.opacity = 1; // 초기 투명도

  this.image = new Image();
  this.image.src = this.paper;


  this.draw = function () {
    context.save();
    context.globalAlpha = this.opacity; // 투명도 설정
    context.translate(this.x, this.y);
    context.rotate(this.tilt * Math.PI / 180);

    // 3D 회전 적용
    context.transform(1, 0, 0, 1, 0, 0); // 초기화
    context.transform(Math.cos(this.tiltAngle), 0, Math.sin(this.tiltAngle), 1, 0, 0);
    context.transform(Math.cos(0), Math.sin(0), -Math.sin(0), Math.cos(0), 0, 0);

    context.drawImage(this.image, -this.r / 2, -this.r / 2, this.r, this.r);
    context.restore();
  };



  this.update = function () {
    this.tiltAngle += this.tiltAngleIncremental;
    this.y += (Math.cos(this.d) + 1 + this.r / 2) * this.speed;
    this.x += Math.sin(this.d) * 0.3; // 좌우 흔들림 설정
    this.tilt = Math.sin(this.tiltAngle - this.y / H * Math.PI) * 15;
  
    // 화면 아래로 벗어났을 때 재설정
    if (this.y > H || this.opacity <= 0.01) {
      this.y = -Math.random() * H;
      this.x = Math.random() * W;
      this.opacity = 1; // 투명도 초기화
    } else if (this.y > 0.8 * H) {
      // 80% 지점 이상에서 투명도를 감소시켜 사라지도록 설정
      const distanceFromBottom = H - this.y;
      this.opacity = distanceFromBottom / (0.2 * H); // 80% 지점에서 0이 되도록 설정
    }
  };
}

// 애니메이션 함수
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

// 창 크기 변경 이벤트 처리
window.addEventListener(
  "resize",
  function () {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },
  false
);

// ConfettiParticle 객체 생성 및 초기화
for (var i = 0; i < maxConfettis; i++) {
  particles.push(new confettiParticle());
}

// 캔버스 크기 초기화 및 애니메이션 시작
canvas.width = W;
canvas.height = H;
Draw();