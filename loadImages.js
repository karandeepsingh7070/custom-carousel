// Fetching Images
const fetchImages = async () => {
    let res = await fetch("https://api.pexels.com/v1/search?query=mountains", {
        headers: {
          Authorization: 'YyLmcdptIFOfBIySU2lKYYfbCMtLfpan9RcbFj0NT8Az8UUZnkKvLOub'
        }})
        let images = await res.json()
        return images
}

// lazy-loading
const handleBlurryImages = () => {
    let blurryContainers = document.querySelectorAll('.load-blury-bg')
    blurryContainers?.length && blurryContainers?.forEach(elm => {
        let img = elm.getElementsByTagName('img')[0]
        function loaded() {
            console.log("original image loaded")
            elm.classList.add('loaded')
        }
        if(img.complete) {
            loaded()
        }
        img.addEventListener('load',loaded)
    });
}

const renderImages = async () => {
    let wrapper = document.getElementsByClassName('carousel-wrapper')
    let lazyImages = JSON.parse(localStorage.getItem('lazyLoadedImages'))
    let lazyLoadedData = []
    if(!lazyImages?.length){
    let images = await fetchImages()
    let data = images?.photos
    lazyLoadedData = data?.map((photo) => ({original : photo?.src?.original, lowQuality : photo?.src?.tiny }))
    localStorage.setItem('lazyLoadedImages',JSON.stringify(lazyLoadedData))
    }else lazyLoadedData = lazyImages


    lazyLoadedData?.map((photo) => {
        let imgWrapper = document.createElement('div')
        imgWrapper.classList.add('load-blury-bg')
        imgWrapper.style.backgroundImage = `url(${photo.lowQuality})`
        let imgTag = document.createElement('img')
        imgTag.src = photo.original
        imgTag.loading = "lazy"
        imgTag.alt = ""
        imgWrapper.append(imgTag)
        wrapper[0].append(imgWrapper)
    })

}

renderImages()
document.addEventListener("DOMContentLoaded", (event) => {
    setTimeout(() => {
        handleBlurryImages()
    },0)
});