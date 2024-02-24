const filterArea = document.getElementById('filterArea');

function openFilter(button) {
    button.classList.toggle('active');
    filterArea.classList.toggle('active');
}