const matchesList = document.getElementById('matchesList');
const nameInput = document.getElementById('nameInput');
// getData();

let savedMatches = JSON.parse(localStorage.getItem('savedMatches'));
let savedScores = [];
console.log(savedMatches)

async function getData() {
        //https://v3.football.api-sports.io/fixtures?league=2&season=2023&timezone=Europe/Moscow
        await fetch("https://v3.football.api-sports.io/fixtures?league=2&season=2023&timezone=Europe/Moscow", {
        "method": "GET",
        "headers": {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "aff6604dedf837f3aa1ee247df7203e0"
        }
        }).then(response => response.json().then(data => {
            let matches = data['response'];
            savedMatches = matches;
            localStorage.setItem('savedMatches', JSON.stringify(savedMatches));
            console.log(matches);
            renderMatches(matches);
        }));


}

renderMatches(savedMatches);

function renderMatches(data) {
    matchesList.innerHTML = '';
    data.forEach(match => {
        
        

        matchesList.insertAdjacentHTML('beforeend', template(match))
    });
    isEmpty();
};

function template(match) {
    const awayTeam = match.teams.away.name;
    const homeTeam = match.teams.home.name;
    const awayLogo = match.teams.away.logo;
    const homeLogo = match.teams.home.logo;

    const homeGoals = match.goals.home;
    const awayGoals = match.goals.away;

    const status = match.fixture.status.long;
    const matchDate = match.fixture.date.replace('T',' : ');
    const parts = matchDate.split('+');
    const trimmedDate = parts[0];

    return `<li class="match">
    <div class="match__home match-home">
        <div class="match-home__img">
            <img src="${homeLogo}" alt="${homeTeam}">
        </div>
        
    </div>
    <div class="match__info">
        <div class="match__time">${(status.toUpperCase() == 'Not Started'.toUpperCase() ? trimmedDate : status)}</div>
        <div class="match__score">
            <div class="score__home">${(homeGoals === null ? '?' : homeGoals)}</div>
            <div class="score__divide">-</div>
            <div class="score__away">${(awayGoals === null ? '?' : awayGoals)}</div>
        </div>
    </div>
    <div class="match__away match-away">
        <div class="match-away__img">
            <img src="${awayLogo}" alt="${awayTeam}" name="${awayTeam}">
        </div>
        
    </div>
</li>`;
}

function sortMatchesByDate() {
    console.log(savedMatches);
    savedMatches.sort((a, b) => {
        const dateA = new Date(a.fixture.date).getTime();
        const dateB = new Date(b.fixture.date).getTime();
        return dateA - dateB;
    });

    renderMatches(savedMatches);
}

nameInput.addEventListener('input', () => {
    const {value} = nameInput;
    
    const filteredMatches = savedMatches.filter(match => {
        return match.teams.away.name.toLowerCase().includes(value.toLowerCase()) || match.teams.home.name.toLowerCase().includes(value.toLowerCase());
    });
    
    renderMatches(filteredMatches);
});

function isEmpty() {
    if (matchesList.innerHTML == '') {
        matchesList.innerHTML = 'Not found..'
    }
}

function sortByRound(button) {
    const currentId = button.getAttribute('id');

    const sortedMatches = savedMatches.filter(mathch => {
        return mathch.league.round.includes(currentId);
    })

    renderMatches(sortedMatches);
}

function resetFilters() {
    nameInput.value = '';
    renderMatches(savedMatches);
}

function isToday() {
    const today = new Date().toISOString().split('T')[0]; // Получаем текущую дату в формате "год-месяц-день"
    
    const matchesToday = savedMatches.filter(match => {
        const matchDate = match.fixture.date.split('T')[0]; // Получаем дату матча в формате "год-месяц-день"
        return matchDate === today;
    });
    
    renderMatches(matchesToday);
}

function isThisWeek() {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // Начало недели (воскресенье)
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay())); // Конец недели (суббота)

    const matchesThisWeek = savedMatches.filter(match => {
        const matchDate = new Date(match.fixture.date);
        return matchDate >= startOfWeek && matchDate <= endOfWeek;
    });

    renderMatches(matchesThisWeek);
}

// async function getBestScores() {
//     fetch("https://v3.football.api-sports.io/players/topscorers?season=2023&league=2", {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "v3.football.api-sports.io",
// 		"x-rapidapi-key": "aff6604dedf837f3aa1ee247df7203e0"
// 	}
// }).then(response => response.json().then(data => {
//     let players = data['response'];
//     savedScores = players;

//     console.log(savedScores);
// }));
// }