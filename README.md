# NBA-Shot-Data-Visualizer

### Team Members

[Joel Christensen](https://github.com/christensenjo), [Sam Johnson](https://github.com/samjohnson1357), [Hagen Larsen](https://github.com/hagen-larsen-hl), [Marshal Taylor](https://github.com/mpt777)


### About
`NBA-Shot-Data-Visualizer` is our CS 5820 Data Visualization final project at Utah State University, Fall 2022. Built using a `Django` backend and displayed via `D3.js`, this dashboard will display a variety of visualizations focused on shot data.

## Getting Started

Since this is a Django project, several steps are required to run the server locally after cloning the repository. You'll need Python installed. 
In a terminal after changing to the `/api/` directory, complete the following steps:

    pip install djangorestframework # This may be moved to a requirements.txt file later
    pip install tqdm
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver

Navigate to [http://localhost:8000/](http://127.0.0.1:8000/) and begin using the dashboard.

To stop the server, use `Ctrl+C` in the terminal where the server is running.


## Seeding Data

Before using the visualization interface, the user will need to seed player data and shot data for the years they are interested in. To do so:
1. Navigate to [/players/seed](http://127.0.0.1:8000/players/seed)
2. Navigate to /shots/seed/?year=<YEAR>, replacing <YEAR> with the year you wish to seed shot data for.
3. Navigate to [/players/seedData](http://127.0.0.1:8000/players/seed) to seed ppg, rpg, apg, etc. data for players.
4. After seeding the necessary player and shot data, return to [http://localhost:8000/](http://127.0.0.1:8000/) and use the interface.
