const play = document.getElementById('videoBtn');
const video = document.getElementById('video');

play.addEventListener('click', () => {
    video.play();
    video.setAttribute('controls', 'controls');
    play.classList.add('video__btn--hidden');
    
})