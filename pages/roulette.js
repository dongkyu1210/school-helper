// roulette.js

const rouletteItemsTextarea = document.getElementById('roulette-items');
const spinButton = document.getElementById('spin-button');
const rouletteWheel = document.getElementById('roulette-wheel');
const resultDisplay = document.getElementById('result-display');

// 색상 목록 (돌림판 조각에 번갈아 적용)
const colors = ['#3498db', '#f1c40f', '#e74c3c', '#2ecc71', '#9b59b6', '#e67e22', '#1abc9c', '#d35400'];

function drawRoulette() {
    rouletteWheel.innerHTML = '';
    
    // 1. 항목 목록 가져오기 및 정리
    let items = rouletteItemsTextarea.value.split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);

    if (items.length === 0) {
        rouletteWheel.style.transform = 'rotate(0deg)';
        resultDisplay.textContent = '항목을 입력하세요.';
        return;
    }
    
    const numItems = items.length;
    const anglePerItem = 360 / numItems; // 항목 하나당 각도
    
    // 2. 돌림판 조각 생성
    items.forEach((item, index) => {
        const segment = document.createElement('div');
        segment.classList.add('roulette-segment');
        segment.style.backgroundColor = colors[index % colors.length];
        
        // 조각의 시작 각도와 회전 각도 설정
        segment.style.transform = `rotate(${index * anglePerItem}deg) skewY(-${90 - anglePerItem}deg)`;

        const textSpan = document.createElement('span');
        textSpan.textContent = item;
        
        // 글자 위치를 정면으로 돌리기 (skewY 역변환)
        textSpan.style.transform = `translateY(-50%) rotate(90deg) skewY(${90 - anglePerItem}deg)`;
        
        segment.appendChild(textSpan);
        rouletteWheel.appendChild(segment);
    });
    
    // 3. 돌림판 항목 목록을 data 속성에 저장 (결과 계산용)
    rouletteWheel.dataset.items = JSON.stringify(items);
}

function spinRoulette() {
    const items = JSON.parse(rouletteWheel.dataset.items || '[]');
    if (items.length === 0) {
        alert("돌릴 항목을 입력해주세요!");
        return;
    }

    spinButton.disabled = true;
    resultDisplay.textContent = '돌아가는 중...';

    const numItems = items.length;
    const anglePerItem = 360 / numItems;
    
    // 1. 무작위 당첨 항목 선택
    const winningIndex = Math.floor(Math.random() * numItems);
    const winningItem = items[winningIndex];

    // 2. 멈출 각도 계산
    // 룰렛 포인터는 0도(12시 방향)를 가리킴. 
    // 당첨 항목의 중심 각도로 멈춰야 함.
    const centerAngle = winningIndex * anglePerItem + (anglePerItem / 2);
    
    // 최종 회전 각도: 여러 바퀴 회전 + 정확한 멈춤 위치
    // (5바퀴 회전) + (중심 각도)
    const totalRotation = 5 * 360 + (360 - centerAngle); 

    // 3. CSS 애니메이션 적용
    rouletteWheel.style.transition = 'transform 5s cubic-bezier(0.2, 0.8, 0.5, 1)';
    rouletteWheel.style.transform = `rotate(${totalRotation}deg)`;

    // 4. 애니메이션 종료 후 결과 표시
    rouletteWheel.addEventListener('transitionend', function handler() {
        // 결과를 보여주기 전 애니메이션을 멈추고 각도를 고정
        rouletteWheel.style.transition = 'none';
        
        // 5. 360도 나눈 나머지만큼 각도를 보정하여 다음 회전 준비
        const finalRotation = totalRotation % 360;
        rouletteWheel.style.transform = `rotate(${finalRotation}deg)`;

        resultDisplay.textContent = `당첨! 🎉 ${winningItem}`;
        spinButton.disabled = false;
        
        // 이벤트 리스너 제거 (중복 방지)
        rouletteWheel.removeEventListener('transitionend', handler);
    });
}

// 이벤트 리스너 연결
rouletteItemsTextarea.addEventListener('input', drawRoulette);
spinButton.addEventListener('click', spinRoulette);

// 페이지 로드 시 초기 돌림판 그리기
document.addEventListener('DOMContentLoaded', () => {
    // 예시 항목
    rouletteItemsTextarea.value = "1번 모둠\n2번 모둠\n3번 모둠\n4번 모둠";
    drawRoulette();
});
