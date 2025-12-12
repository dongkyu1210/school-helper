// seating.js

const studentList = document.getElementById('student-list');
const inputCols = document.getElementById('input-cols');
const arrangeButton = document.getElementById('arrange-button');
const seatingChart = document.getElementById('seating-chart');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 요소 교환
    }
}

function arrangeSeating() {
    // 1. 학생 이름 목록 가져오기 및 정리
    const rawNames = studentList.value;
    // 공백을 제거하고, 빈 줄은 제외한 후, 배열로 만듭니다.
    let students = rawNames.split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);

    if (students.length === 0) {
        alert("학생 이름을 입력해 주세요.");
        return;
    }

    // 2. 학생 이름 무작위 섞기
    shuffleArray(students);

    // 3. 열(Column) 개수 설정
    const numCols = parseInt(inputCols.value);
    if (isNaN(numCols) || numCols <= 0) {
        alert("유효한 열 개수(1 이상의 숫자)를 입력해 주세요.");
        return;
    }
    
    // 4. 자리표 생성 및 CSS Grid 설정
    seatingChart.innerHTML = ''; // 기존 자리표 초기화
    seatingChart.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;

    // 5. 학생을 배치하고 빈 자리 처리
    const totalDesks = students.length; 
    let studentIndex = 0;

    for (let i = 0; i < totalDesks; i++) {
        const desk = document.createElement('div');
        desk.classList.add('desk-card');
        
        // 섞인 학생 배열에서 이름을 가져와 배치
        const name = students[studentIndex];
        desk.textContent = name;
        
        seatingChart.appendChild(desk);
        studentIndex++;
    }

    alert(`${students.length}명의 학생을 ${numCols}열로 무작위 배치했습니다.`);
}

arrangeButton.addEventListener('click', arrangeSeating);

// 초기 예시 데이터
document.addEventListener('DOMContentLoaded', () => {
    // 예시 학생 이름 목록을 미리 채워둡니다.
    const exampleNames = [
        "김민준", "이서연", "박도현", "정하윤", 
        "최우진", "김지우", "강준서", "송은채", 
        "한서준", "오채은", "임시우", "신수아"
    ].join('\n');
    studentList.value = exampleNames;

    // 초기 화면에 배치 결과를 보여줍니다.
    arrangeSeating(); 
});
