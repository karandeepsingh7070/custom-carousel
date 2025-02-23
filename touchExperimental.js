import { handleBlurryImages, renderImages } from "./loadImages.js";

document.addEventListener("DOMContentLoaded", () => {
    const carouselWrapper = document.querySelector('.carousel-wrapper')
    const toggleSwitch = document.querySelector(".toggle-switch input");
    let backNavigation = document.querySelector(".back");
    let nextNavigation = document.querySelector(".next");
    let keyClickDebounce // to handle multiple key presses

    const loadNextImages = () => {
        let index = JSON.parse(localStorage.getItem('index'))
        index = (index + 1) % window.totalImages.length;
        JSON.stringify(localStorage.setItem('index',index))
        renderImages()
        handleBlurryImages()
    }
    const loadPreviousImages = () => {
        let index = JSON.parse(localStorage.getItem('index'))
        if(index == window.totalImages.length || index == 0) {
            index = 0
        }else {
            index = index - 1 
        }
        index = index == 0 ? window.totalImages.length - 1 : index % window.totalImages.length;
        JSON.stringify(localStorage.setItem('index',index))
        renderImages()
        handleBlurryImages()
    }


    // autoslide logic and reset handling in case of touch
    let delay = 3000
    let remainingTimer = delay
    let slideInterval

    let slideTimer = document.querySelector('.slide-timer')

    const resetTimer = () => {
        if (toggleSwitch.checked) return
        showTimer()
        slideInterval = setInterval(() => {
            showTimer()
            autoSlide()
        }, delay)
    }
    const autoSlide = () => {
        loadNextImages()
        carouselWrapper.scrollTo({
            left: carouselWrapper.scrollLeft + 400,
            behavior: "smooth",
        });
        // carouselWrapper.scrollLeft += 400
    }
    let timerInterval
    const showTimer = () => {
        remainingTimer = delay
        clearInterval(timerInterval)
        slideTimer.innerText = `Slide changing in : ${Math.floor(remainingTimer / 1000)}`
        timerInterval = setInterval(() => {
            remainingTimer = remainingTimer - 1000
            if (delay - remainingTimer <= delay) {
                slideTimer.innerText = `Slide changing in : ${Math.floor(remainingTimer / 1000)}`
            } else {
                clearInterval(timerInterval)
            }
        }, 1000)
    }

    toggleSwitch.addEventListener("change", function () {
        if (this.checked) {
            clearInterval(slideInterval)
        } else {
            resetTimer()
        }
    });

    const moveToRight = autoSlide
    const moveToLeft = () => {
        loadPreviousImages()
        carouselWrapper.scrollTo({
            left: carouselWrapper.scrollLeft - 400,
            behavior: "smooth",
        });
        // carouselWrapper.scrollLeft -= 400
    }
    // debounce handling
    const handleKeyDown = (e) => {
        clearTimeout(keyClickDebounce)
        keyClickDebounce = setTimeout(() => {
            resetTimer()
            if (e.key === 'ArrowRight') {
                moveToRight()
            } else if (e.key === 'ArrowLeft') {
                moveToLeft()
            }
        },300)
    }

    const attachEvents = () => {
        document.addEventListener('keydown', handleKeyDown);
        backNavigation.addEventListener('click', moveToLeft)
        nextNavigation.addEventListener('click', moveToRight)
    }

    attachEvents()
    resetTimer()
});