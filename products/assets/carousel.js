// вытаскивает из html элемент с классом .slider-container
let sliderContainer = document.querySelector(".slider-container");
let sliderElement = sliderContainer.querySelector(".slider");
let leftContolElement = sliderContainer.querySelector(".control .left");
let rightContolElement = sliderContainer.querySelector(".control .right");
let pagesControlElement = sliderContainer.querySelector(".pages");

for (let i = 0; i < sliderElement.childElementCount; i++) {
    sliderElement.children[i].dataset.position = i;
}

leftContolElement.onclick = prev;
rightContolElement.onclick = next;

function next() {
    // первый дочерний элемент слайдера
    let outSlide = sliderElement.firstElementChild;
    // out нужен для плавной прокрутки этого элемента влево
    outSlide.classList.add("out");
    // следующий элемент после outSlide
    let inSlide = outSlide.nextElementSibling;
    // in так же для анимации
    inSlide.classList.add("in");

    setTimeout(() => {
        sliderElement.append(outSlide);
        outSlide.classList.remove("out");
        inSlide.classList.remove("in");
        setActivePage(+inSlide.dataset.position);
    }, 200);

}
function prev() {
    let outSlide = sliderElement.firstElementChild;
    if (outSlide) {
        outSlide.classList.add("out");
        let inSlide = outSlide.nextElementSibling;
        if (inSlide) {
            inSlide.classList.add("in");
        }
        setTimeout(() => {
            sliderElement.append(outSlide);
            outSlide.classList.remove("out");
            inSlide.classList.remove("in");
            setActivePage(+inSlide.dataset.position);
        }, 200);
    }
}
function setActivePage(index) {
    let currentActiveElements = pagesControlElement.querySelectorAll(".active");
    currentActiveElements.forEach(element => {
        element.classList.remove("active");
    });
    let activeElement = pagesControlElement.children[index];
    if (activeElement) {
        activeElement.classList.add("active");
    }
}
