'use strict';

///// 1. Navbar : Make navbar transparent when it is on the top
const navbar = document.querySelector('#navbar'); 
const navbarHeight = navbar.getBoundingClientRect().height; 

document.addEventListener('scroll', () => {

    if(window.scrollY > navbarHeight) {
        navbar.classList.add('navbar--dark'); 
    } else {
        navbar.classList.remove('navbar--dark'); //scroll 이 적어지면 (navbarHeight보다) 클래스 제거
    }
});


//----------------------------------------------------------
///// 2. Handle scrolling when tapping on the navbar menu

// 클릭 시 원하는 id 알아야함
// navbarMenu 요소 받아오기

const navbarMenu = document.querySelector('.navbar__menu');

navbarMenu.addEventListener('click', (event) => {
    
    //target 변수 할당 (클릭했을 때 data-link 정의한 값 target에 할당)
    const target = event.target;   

    // dataset에 있는 link 를 link변수에 할당
    const link = target.dataset.link;  

    if(link == null) { 
        return;
    }

    console.log(event.target.dataset.link);  

    navbarMenu.classList.remove('open'); 
    scrollIntoView(link);
});


///// 9. Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
});



//----------------------------------------------------------
////// 3. Handle click on "contact me" button on home

const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', () => {
    scrollIntoView('#contact'); // selector값에 #contact 전달하면서 function 호출
});

//----------------------------------------------------------
///// 4. Make home slowly fade to transparent as the window scrolls down

const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;

document.addEventListener('scroll', () => {
    home.style.opacity = 1 - window.scrollY / homeHeight;
});

//----------------------------------------------------------
///// 5. Show "arrow up" button when scrolling down
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
    if(window.scrollY > homeHeight / 2) {
        arrowUp.classList.add('visible');
    } else {
        arrowUp.classList.remove('visible');
    }
});

// Handle click on the "arrow up" button
arrowUp.addEventListener('click', () => {
    scrollIntoView('#home');
})

//----------------------------------------------------------
////// 6. Projects - filtering
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects'); 
const projects = document.querySelectorAll('.project'); 

workBtnContainer.addEventListener('click', (e) => { 

    const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
    if(filter == null) {
        return;
    }

      
    ///// 8. Remove selection from the previous item and select the new one 
    //(My work category btn 누르면 해당 버튼 활성화)
    const active = document.querySelector('.category__btn.selected');

    active.classList.remove('selected'); // * selected 이전에 선택된 아이 제거!

    const target = e.target.nodeName === 'BUTTON' ? e.target : //click된 게 button이면 e.target 그대로 쓰고, 아니면(span일 때) span의 parentNode를 쓴다 (버튼)
                        e.target.parentNode; //상태(조건이면) === a이면? e를 쓰고 : 아니면 etp를 쓴다
    //e.target.classList.add('selected'); //span이 클릭되면 에러남 -> 디버깅 툴 이용. target 구체적으로 지정 (항상 버튼만 오기 때문에 e를 이제 빼야함)

    target.classList.add('selected'); // * 새로 선택된 아이 추가!
    



    ///// 7. Projects - animation효과
    projectContainer.classList.add('anim-out'); // 클릭 시에 animation효과 줄 수 있게 클래스 추가

    setTimeout(() => {
        projects.forEach((project) => { //forEach() : projects array 를 번갈아가면서 project하나씩 받아와서 해줌(보여줄지 안보여줄지 결정)
            console.log(project.dataset.type); // 클릭시 다 출력됨 (클릭 시 다른 거 안 나오게 filtering해주면 됨!)
    
            if(filter ==='*' || filter === project.dataset.type) { //* 선택한 필터가 * 이거나 project에 있는 선택된 dataset와 같으면
                //* html에서는 기본적으로 보여지고, 버튼 클릭시에 안보여지게 
                project.classList.remove('invisible'); // (같으면 보여져야하니까 invisible 제거)
            } else {
                //* 다르면 invisible add
                project.classList.add('invisible'); 
            }
        });
        // opacity: 0인 anim-out효과 : 계속 없어진 상태이기 때문에 위의 코드 실행 후 이 클래스 제거필요
        projectContainer.classList.remove('anim-out');  
    }, 300);

    //==> 1. 클래스 추가해서 project 제거 (invisible하게)
    // 2. setTimeout() 으로 filtering(0.3초)
    // 3. project 제거하는 클래스를 제거 (visible하게)

});


//----------------------------------------------------------
// ** 요구사항
// 1. 스크롤링 시 해당하는 섹션의 메뉴 아이템 활성화
// 2. 클릭시 이동하는 것에 문제되지 않도록 구현
// 3. 윈도우창 작아지거나 모바일 모드에서도 동일하게 스크롤링 시 해당 섹션의 메뉴 아이템 활성화

// ** 구현순서
// 1. 모든 섹션 요소들과 메뉴 아이템들을 갖고 온다
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다

//1.
//sectionids 라는 아이디의 배열을 갖고 있는 변수 설정
const sectionIds = [
    '#home', 
    '#about', 
    '#skills', 
    '#work', 
    '#testimonials', 
    '#contact',
];

// 각각의 id를 섹션 돔 요소로 변환하는 새로운 배열 만들기
// map : 배열을 하나씩 돌면서 새로운 것으로 변환할 수 있는 api 
const sections = sectionIds.map(id => document.querySelector(id)); //sections 별 id
const navItems = sectionIds.map(id => 
    document.querySelector(`[data-link="${id}"]`) 
); // navbar menu item 별 id
//console.log(sections);
//console.log(navItems);


//2. 새로운 observer 만들어서 콜백 전달, 옵션 전달 => 만들어진 observer이용해서 각 섹션들 관찰
let selectedNavIndex = 0; // 현재 선택된 메뉴 인덱스 / 로컬변수가 아니기 때문에 좀 더 의미있게 변수명 수정

let selectedNavItem = navItems[0]; //현재선택된 navitem (선택된 메뉴 요소)
function selectNavItem(selected) { //새로 선택될때마다 이전꺼 지우고 새로운 거 active지정
    selectedNavItem.classList.remove('active'); 
    selectedNavItem = selected;
    selectedNavItem.classList.add('active'); 
}

//----------------------------------------------------------
///// 3,5 function
function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({behavior: 'smooth', block: 'center'});
    selectNavItem(navItems[sectionIds.indexOf(selector)]); //contact me, arrow up 클릭시에도 메뉴바아이템 활성화되도록
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3, 
}

//observerCallback : entries, observer 라는 인자를 받는 콜백함수
const observerCallback = (entries, observer) => { 
    entries.forEach(entry => { 
       
        if(!entry.isIntersecting && entry.intersectionRatio > 0) {  
            const index = sectionIds.indexOf(`#${entry.target.id}`);
            if(entry.boundingClientRect.y < 0) {
                // 마이너스 -> 뒤에 따라오는 인덱스 선택
                selectedNavIndex = index + 1;
            } else {
                // 플러스 -> 이전의 인덱스 선택
                selectedNavIndex = index - 1;
            }
        }
    }); 
};

const observer = new IntersectionObserver(observerCallback, observerOptions); 
sections.forEach(section => observer.observe(section)); 


// * 화면이 위로 나가는 경우 (스크롤 밑으로 내릴 때) : 
// - 마이너스, y좌표가 마이너스일때 해당 요소 인덱스 + 1 해서 다음 섹션 찾음
// * 아래에 있는 섹션이 밑으로 빠져나가는 경우 (스크롤 위로 올릴 때):
// - y 값이 플러스. 이 요소 이전 -1 된 인덱스 찾아 선택 : -1 

window.addEventListener('wheel', () => {
    if(window.scrollY === 0){
        selectedNavIndex = 0;
    } else if (
        window.scrollY + window.innerHeight === 
        document.body.clientHeight
    ) {
        selectedNavIndex = navItems.length - 1;
    }
    selectNavItem(navItems[selectedNavIndex]);
});