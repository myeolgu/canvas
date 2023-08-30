let W = window.innerWidth;
let H = document.getElementById('confetti').clientHeight;
const canvas = document.getElementById('confetti');
const context = canvas.getContext("2d");
const maxConfettis = 60;
const particles = [];

const paperContainer = [
  "/image/paper01.png", 
  "/image/paper02.png", 
  "/image/paper03.png"  
];

// 이미지 선택 함수
function selectRandomPaper() {
    const randomNum = Math.random();
    if (randomNum < 0.4) {
      return paperContainer[0]; // "paper01.png" 선택 확률: 40%
    } else if (randomNum < 0.8) {
      return paperContainer[1]; // "paper02.png" 선택 확률: 40%
    } else {
      return paperContainer[2]; // "paper03.png" 선택 확률: 20%
    }
  }

// 무작위 정수 생성 함수
function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

// ConfettiParticle 생성자 함수
function confettiParticle() {
  this.x = Math.random() * W;
  this.y = -Math.random() * H;
  this.r = randomFromTo(6, 12);
  this.d = Math.random() * maxConfettis + 6;
  this.paper = selectRandomPaper(); // 무작위 이미지 선택
  this.tilt = Math.floor(Math.random() * 12) - 6;
  this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
  this.tiltAngle = 0;
  this.speed = 0.3 + Math.random() * 0; // 떨어지는 속도
  this.opacity = 1; // 초기 투명도

  this.image = new Image();
  this.image.src = this.paper;

  this.draw = function() {
    context.save();
    context.globalAlpha = this.opacity; // 투명도 설정
    context.translate(this.x, this.y);
    context.rotate(this.tilt * Math.PI / 180);
    context.drawImage(this.image, -this.r / 2, -this.r / 2, this.r, this.r);
    context.restore();
  };

  this.update = function() {
    this.tiltAngle += this.tiltAngleIncremental;
    this.y += (Math.cos(this.d) + 1 + this.r / 2) * this.speed;
    this.x += Math.sin(this.d) * 2; // 좌우로 약간 흔들리도록
    this.tilt = Math.sin(this.tiltAngle - this.y / H * Math.PI) * 15;
    // 화면 아래로 벗어났을 때 재설정
    if (this.y > H || this.opacity <= 0.01) {
      this.y = -Math.random() * H;
      this.x = Math.random() * W;
      this.opacity = 1; // 투명도 초기화
    } else if (this.y > 0 * H) {
      // 60% 지점 이상에서 투명도를 감소시켜 사라지도록 설정
      this.opacity -= 0.008; // 더 빠르게 사라지도록 수정
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
  function() {
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
