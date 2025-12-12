// timer.js

let countdown;
let isPaused = false;
let timeRemaining = 0; // 초 단위로 남은 시간 저장

const timerDisplay = document.getElementById('timer-display');
const inputMinutes = document.getElementById('input-minutes');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');

function displayTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainderSeconds = seconds % 60;
    
    // 시, 분, 초를 두 자리로 맞춤 (예: 5 -> 05)
    const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainderSeconds).padStart(2, '0')}`;
    timerDisplay.textContent = display;
}

function startTimer() {
    // 이미 실행 중인 타이머가 있다면 멈춤
    clearInterval(countdown);
    timerDisplay.classList.remove('finished');

    if (!isPaused) {
        // 새로 시작할 때, 입력된 분을 초로 변환
        const minutes = parseInt(inputMinutes.value);
        if (isNaN(minutes) || minutes <= 0) {
            alert("유효한 시간을 입력해 주세요.");
            return;
        }
        timeRemaining = minutes * 60;
    } 
    // 일시정지에서 재개할 경우 timeRemaining 값을 그대로 사용

    if (timeRemaining <= 0) return;

    isPaused = false;
    displayTime(timeRemaining);

    startButton.textContent = '재시작';
    startButton.disabled = true;
    pauseButton.disabled = false;
    pauseButton.textContent = '일시정지';
    inputMinutes.disabled = true;

    // 1초마다 타이머 업데이트
    countdown = setInterval(() => {
        timeRemaining--;
        displayTime(timeRemaining);

        if (timeRemaining <= 0) {
            clearInterval(countdown);
            timerDisplay.textContent = '시간 종료!';
            timerDisplay.classList.add('finished');
            
            // 알림 기능 (브라우저 지원 시)
            const audio = new Audio('alarm.mp3'); // 같은 폴더에 알림음 파일을 넣어주세요.
            // audio.play();

            startButton.textContent = '시작';
            startButton.disabled = false;
            pauseButton.disabled = true;
            inputMinutes.disabled = false;
        }
    }, 1000); // 1000ms = 1초
}

function pauseTimer() {
    clearInterval(countdown);
    isPaused = true;
    
    startButton.textContent = '재개';
    startButton.disabled = false;
    pauseButton.disabled = true;
    inputMinutes.disabled = true;
}

function resetTimer() {
    clearInterval(countdown);
    timeRemaining = 0;
    isPaused = false;
    
    displayTime(parseInt(inputMinutes.value) * 60 || 0); // 입력값으로 초기 시간 표시
    
    startButton.textContent = '시작';
    startButton.disabled = false;
    pauseButton.disabled = true;
    inputMinutes.disabled = false;
    
    timerDisplay.classList.remove('finished');
}

// 이벤트 리스너 연결
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// 페이지 로드 시 초기 시간 설정 (입력값 기반)
document.addEventListener('DOMContentLoaded', () => {
    resetTimer();
});
