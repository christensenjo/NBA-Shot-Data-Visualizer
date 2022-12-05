function getShots() {
    fetch('http://' + window.location.host + '/shots/get/?player=' + document.getElementById('player').value + '&start_date=' + document.getElementById('start_date').value + '&end_date=' + document.getElementById('end_date').value)
        .then(response => response.json())
        .then(data => {
            //Pane 1 - League Comparison

            //Pane 2 - Heatmap
            //heatMap(data)

        });
}

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

