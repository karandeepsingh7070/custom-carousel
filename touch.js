document.addEventListener("DOMContentLoaded", (event) => {
    const carouselWrapper = document.querySelector('.carousel-wrapper')
    const toggleSwitch = document.querySelector(".toggle-switch input");
    let backNavigation = document.querySelector(".back");
    let nextNavigation = document.querySelector(".next");
    let isTouchActive = false
    let prevPageX
    let prevScrollLeft
    let scrollCoardinate
    let hold = false
    let keyClickDebounce // to handle multiple key presses
    // let isScrollDisabled = false


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

    //
    const snapToGrid = () => {
        if (carouselWrapper.scrollLeft == (carouselWrapper.scrollWidth - carouselWrapper.clientWidth)) return
        scrollCoardinate = Math.abs(scrollCoardinate)
        let ImageWidth = 400
        let totalShift = ImageWidth - scrollCoardinate
        if (carouselWrapper.scrollLeft > prevScrollLeft) { // right scroll
            if (scrollCoardinate > ImageWidth / 3) {
                carouselWrapper.scrollTo({
                    left: carouselWrapper.scrollLeft + totalShift,
                    behavior: "smooth",
                });
                // carouselWrapper.scrollLeft += totalShift
            } else { // revert to original position
                carouselWrapper.scrollTo({
                    left: carouselWrapper.scrollLeft - scrollCoardinate,
                    behavior: "smooth",
                });
                // carouselWrapper.scrollLeft -= scrollCoardinate
            }
        } else { // left scroll
            if (scrollCoardinate > ImageWidth / 3) {
                carouselWrapper.scrollTo({
                    left: carouselWrapper.scrollLeft - totalShift,
                    behavior: "smooth",
                });
                // carouselWrapper.scrollLeft -= totalShift
            } else { // revert to original position
                carouselWrapper.scrollTo({
                    left: carouselWrapper.scrollLeft + scrollCoardinate,
                    behavior: "smooth",
                });
                // carouselWrapper.scrollLeft += scrollCoardinate
            }
        }
    }
    const trackPosition = (e) => {
        if (!isTouchActive) return
        e.preventDefault()
        isScrollDisabled = true
        hold = true
        // console.log(e.pageX,prevPageX)
        scrollCoardinate = (e.pageX || e.touches[0].pageX) - prevPageX
        carouselWrapper.scrollLeft = prevScrollLeft - scrollCoardinate
    }
    const startTouch = (e) => {
        e.preventDefault()
        prevPageX = e.pageX || e.touches[0].pageX
        prevScrollLeft = carouselWrapper.scrollLeft
        isTouchActive = true
        clearInterval(slideInterval)
        resetTimer()
    }
    const endTouch = (e) => {
        e.preventDefault()
        isTouchActive = false
        if (!hold) return
        hold = false
        isScrollDisabled = false
        snapToGrid()
    }

    const moveToRight = autoSlide
    const moveToLeft = () => {
        // if (carouselWrapper.scrollLeft == 0) {
        //     carouselWrapper.scrollTo({
        //         left: 6000,
        //         behavior: "smooth",
        //     });
        // }
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
        carouselWrapper?.addEventListener('mousedown', startTouch)
        carouselWrapper?.addEventListener('mousemove', trackPosition)
        carouselWrapper?.addEventListener('mouseout', endTouch)
        carouselWrapper?.addEventListener('mouseup', endTouch)

        carouselWrapper?.addEventListener('scroll', () => {
            // infinite scroll
            if (carouselWrapper.scrollLeft == (carouselWrapper.scrollWidth - carouselWrapper.clientWidth)) {
                carouselWrapper.scrollTo({
                    left: 0,
                    behavior: "smooth",
                });
            }
        })
        // restricting scroll behiviour
        // carouselWrapper?.addEventListener('scroll', (e) => {
        //     if (!isScrollDisabled) {
        //         var scrollLeft = carouselWrapper.scrollLeft
        //         let remainingShift = Math.ceil(scrollLeft / 400)
        //         // console.log(scrollLeft, remainingShift)
        //         carouselWrapper.scrollLeft = (remainingShift * 400) - scrollCoardinate
        //     }
        // })

        carouselWrapper?.addEventListener('touchstart', startTouch)
        carouselWrapper?.addEventListener('touchmove', trackPosition)
        carouselWrapper?.addEventListener('touchcancel', endTouch)
        carouselWrapper?.addEventListener('touchend', endTouch)
        document.addEventListener('keydown', handleKeyDown);

        backNavigation.addEventListener('click', moveToLeft)
        nextNavigation.addEventListener('click', moveToRight)
    }

    attachEvents()
    resetTimer()
});