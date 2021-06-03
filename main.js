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

// "javascript element size" (navbar height알아내기 위한 검색 키워드)
// element의 size를 결정하는 것 : content, scrollbars, padding, border : 
// * offsetWidth, offsetHeight, : transform 전 width, height (원래 element에 부여된 사이즈)
// * Element.getBoundingClientRect(), : transform 후 rendering width, height



//----------------------------------------------------------
///// 2. Handle scrolling when tapping on the navbar menu

// 클릭 시 원하는 id 알아야함
// navbarMenu 요소 받아오기


const navbarMenu = document.querySelector('.navbar__menu');

//navbarMenu에 event 추가 - 클릭되면 등록한 함수 호출되게
// click되면 click한 event가 들어옴
navbarMenu.addEventListener('click', (event) => {
    // 1)
    // console.log('df'); //잘 들어오는 거 확인

    // 2)
    // console.log(event.target); //클릭시에 타겟이 되는 요소가 출력이 됨
    // 타겟은 클릭한 요소가 출력됨 //-> home 누르면 home 출력

    // 3)
    // html : data-link="home" 등 section별 추가 => dataset 안에 우리가 정의한 data 할당됨.
    // dataset 안 data-link 정의한 거 / => link 찍어보면 정의한대로 #home... 등 나옴

    // 4)
    // navbar menu에는 data를 안 넣어서, 누르면 undefined 나오는 부분있음
    // => id 만 클릭됐을 때 출력, 
    //    우리가 원하지 않는 경우를 빨리 확인한 후, (더 이상 밑에 있는 함수가 실행되지 않도록) 함수리턴
    //    그 후 아래 코드 실행

    //target 변수 할당 (클릭했을 때 data-link 정의한 값 target에 할당)
    const target = event.target;   //*** <li class="navbar__menu__item" data-link="#about">About</li>

    // dataset에 있는 link 를 link변수에 할당
    const link = target.dataset.link;  //*** #about

    if(link == null) { //null 일 경우 아무것도 하지 않고
        return;
    }

    console.log(event.target.dataset.link);  // *** #about //이동하고자 하는 id 받아온 경우에만 (null이 아닐 때만) 출력

    //"javascript scroll to id"

    // *scrollIntoView() : element 자체에 있는 scrollIntoView(interface, 함수)를 이용해서 스크롤! 
    // element 에 있는 parent container 에 scroll 이 된다.

    //*****const scrollTo = document.querySelector(link); //link 받아와서 해당 link로 스크롤한다
    //*****scrollTo.scrollIntoView({behavior: 'smooth', block: 'center' });
    
    navbarMenu.classList.remove('open'); 
    //9. mediaquery의 작은 화면의 navbarmenu 클릭 시에 스크롤할 때는 menu open된 거 제거
    scrollIntoView(link);
    //selectNavItem(target);

    //behavior: 'auto'(default): 바로 이동
    // block : start(default) : 시작 끝 부분 / center: 위에 적당한 여백남기고 이동/ nearest
});


///// 9. Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
});



//----------------------------------------------------------
////// 3. Handle click on "contact me" button on home

//const homeContactBtn = document.querySelector('.home__contact');
//homeContactBtn.addEventListener('click', () => {
//    const scrollTo = document.querySelector('#contact');
//    scrollTo.scrollIntoView({behavior: 'smooth', block: 'center'});
//});

// *****반복되는 코드 => 아예 function 으로 만들어, selector만 추가하면 이동할 수 있도록

const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', () => {
    scrollIntoView('#contact'); // selector값에 #contact 전달하면서 function 호출
});

//----------------------------------------------------------
///// 4. Make home slowly fade to transparent as the window scrolls down

//#home으로 하면 배경까지 투명해져서 그 안에 .home__container 넣어서 하기(?) 
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;

document.addEventListener('scroll', () => {
    //console.log(homeHeight); //708
    //console.log(1 - window.scrollY / homeHeight);

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
const projectContainer = document.querySelector('.work__projects'); // projects들 들어있음
const projects = document.querySelectorAll('.project'); // project들을 모두 배열로 받아옴 (8개의 프로젝트 요소가 projects에 할당)

workBtnContainer.addEventListener('click', (e) => { 

    const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
    //event 를 받아와서 filter값 //data-filter="*" 이 값 가져온다
    // e.target에 filter값없으면 parentNode에서 값 받아와서 filter에 할당.

    if(filter == null) {
        return;
    }
    //console.log(filter); //*/ front-end /back-end/ 숫자 클릭시 undefined -> button안에 숫자는 span이라서 data-filter없어서 undefined!


      
    ///// 8. Remove selection from the previous item and select the new one 
    //(My work category btn 누르면 해당 버튼 활성화)
    const active = document.querySelector('.category__btn.selected');

    /* ***** 디버깅 하는 방법 위의 코드 breakpoint 
    document.querySelector('.category__btn.selected'); //null
    document.querySelector('.category__count.selected'); // span 에 selected가 지정됨 
    => 코드 수정 필요. 그냥 target에 selected 할당하는 게 아니라 target 을 구체적으로 아래와 같이 정해줌
    */

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

    /*
    forEach() 와 같은 메소드들

    console.log('----------------');
    for(let project of projects) {
        console.log(project);
    }
    
    console.log('----------------');
    let project;
    for(let i = 0; i < projects.length; i++) {
        project = projects[i]; 
        console.log(project);
    }
    */

    //  *****
    /*
    ***** 개발자 툴 sources 열어서 디버깅 툴 활용하기!! (버튼 안에 숫자 클릭 시 undefined되는 문제)
    1. 개발자툴 - sources 열고 - console.log(filter) breakpoint 걸고 -  btn안의 숫자 클릭 
    2. watch : 다음과 같이 입력해서 확인
    "e.target"              //category__count
    "e.target.parentNode"   //button.category__btn.active
    "e.target.parentNode.dataset.filter" //버튼 누른 곳 나옴 // front-end
    */





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
    entries.forEach(entry => { // entries 빙글빙글 돌면서 
        // 콜백안에서 해당하는 섹션 찾아서 navbar메뉴 활성화해주는 것
        //console.log(entry.target); //빠져나가는 섹션 가르킴
        // 그 섹션의 아이디를 이용해서 해당하는 섹션과 네비게이션 아이템을 찾음
        // => sectionIds에 있는 배열을 이용해 똑같은 사이즈와 똑같은 인덱스로 하나는 섹션의 돔 요소를 배열로 만들었고, 
        // 하나는 인덱스와 같은 사이즈의 네비게이션 배열도 만들어놔서
        // 이 섹션이 빠져나가면 방향에 따라 그 다음에 해당하는 인덱스 찾아 -> 인덱스에 해당하는 섹션, nav item 찾을 수 있고, 이걸 활성화시킴

        if(!entry.isIntersecting && entry.intersectionRatio > 0) { //진입하지 않을 때 (빠져나갈 때) //** 문제2 해결 
            const index = sectionIds.indexOf(`#${entry.target.id}`);
            // console.log(index, entry.target.id); //빠져나가는 section 출력됨
            // console.log(entry); // **아래의 문제 출력확인 : 페이지 로딩되자마자 몇 콜백함수 발생- intersectionratio: 0


            // 선택해야하는 인덱스 selectedIndex 에 할당
            // let selectedIndex; //함수안에 있는 로컬변수가 아니라 밖에 있어야함
            // (y좌표)마이너스 : 스크롤링이 아래로 되어서 페이지가 올라옴 
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

//관찰자 만들어서
const observer = new IntersectionObserver(observerCallback, observerOptions); //만들어둔 () 전달
//observer 에게 sections 돌면서 해당 section 관찰
sections.forEach(section => observer.observe(section)); //sections를 빙글 돌면서 해당 섹션을 observer야, 우리거 관찰해줘라고 전달하는 것


// * 화면이 위로 나가는 경우 (스크롤 밑으로 내릴 때) : 
// - 마이너스, y좌표가 마이너스일때 해당 요소 인덱스 + 1 해서 다음 섹션 찾음
// * 아래에 있는 섹션이 밑으로 빠져나가는 경우 (스크롤 위로 올릴 때):
// - y 값이 플러스. 이 요소 이전 -1 된 인덱스 찾아 선택 : -1 


//사용자가 스스로 스크롤하는 경우 발생하는 이벤트 : wheel
// scroll : 브라우저에서 클릭시 자동적으로 스크롤링되는 스크롤링 자체에서 발생하는 이벤트
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