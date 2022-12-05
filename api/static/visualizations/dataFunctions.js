let players = fetch('http://' + window.location.host + '/players/get')
    .then(response => response.json())
    .then(data => {
        let players = data.players;
        let playerList = document.getElementById('players')
        players.forEach(player => {
            let option = document.createElement('option')
            option.value = player
            playerList.appendChild(option)
        })
    });

