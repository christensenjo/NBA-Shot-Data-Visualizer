# Get NBA Data Library
devtools::install_github("abresler/nbastatR")
library("nbastatR")

Sys.setenv(VROOM_CONNECTION_SIZE = 500001)

# Get all shots data & Save Regular Season Shot Data to csv file
# 2000
all_shots <- teams_shots(all_active_teams = T, seasons = 2000, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2000_regSeason_shotData.csv", row.names = TRUE)

# 2001
all_shots <- teams_shots(all_active_teams = T, seasons = 2001, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2001_regSeason_shotData.csv", row.names = TRUE)

# 2002
all_shots <- teams_shots(all_active_teams = T, seasons = 2002, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2002_regSeason_shotData.csv", row.names = TRUE)

# 2003
all_shots <- teams_shots(all_active_teams = T, seasons = 2003, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2003_regSeason_shotData.csv", row.names = TRUE)

# 2004
all_shots <- teams_shots(all_active_teams = T, seasons = 2004, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2004_regSeason_shotData.csv", row.names = TRUE)

# 2005
all_shots <- teams_shots(all_active_teams = T, seasons = 2005, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2005_regSeason_shotData.csv", row.names = TRUE)

# 2006
all_shots <- teams_shots(all_active_teams = T, seasons = 2006, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2006_regSeason_shotData.csv", row.names = TRUE)

# 2007
all_shots <- teams_shots(all_active_teams = T, seasons = 2007, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2007_regSeason_shotData.csv", row.names = TRUE)

# 2008
all_shots <- teams_shots(all_active_teams = T, seasons = 2008, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2008_regSeason_shotData.csv", row.names = TRUE)

# 2009
all_shots <- teams_shots(all_active_teams = T, seasons = 2009, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2009_regSeason_shotData.csv", row.names = TRUE)

# 2010
all_shots <- teams_shots(all_active_teams = T, seasons = 2010, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2010_regSeason_shotData.csv", row.names = TRUE)

# 2011
all_shots <- teams_shots(all_active_teams = T, seasons = 2011, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2011_regSeason_shotData.csv", row.names = TRUE)

# 2012
all_shots <- teams_shots(all_active_teams = T, seasons = 2012, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2012_regSeason_shotData.csv", row.names = TRUE)

# 2013
all_shots <- teams_shots(all_active_teams = T, seasons = 2013, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2013_regSeason_shotData.csv", row.names = TRUE)

# 2014
all_shots <- teams_shots(all_active_teams = T, seasons = 2014, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2014_regSeason_shotData.csv", row.names = TRUE)

# 2015
all_shots <- teams_shots(all_active_teams = T, seasons = 2015, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2015_regSeason_shotData.csv", row.names = TRUE)

# 2016
all_shots <- teams_shots(all_active_teams = T, seasons = 2016, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2016_regSeason_shotData.csv", row.names = TRUE)

# 2017
all_shots <- teams_shots(all_active_teams = T, seasons = 2017, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2017_regSeason_shotData.csv", row.names = TRUE)

# 2018
all_shots <- teams_shots(all_active_teams = T, seasons = 2018, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2018_regSeason_shotData.csv", row.names = TRUE)

# 2019
all_shots <- teams_shots(all_active_teams = T, seasons = 2019, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2019_regSeason_shotData.csv", row.names = TRUE)

# 2020
all_shots <- teams_shots(all_active_teams = T, seasons = 2020, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2020_regSeason_shotData.csv", row.names = TRUE)

# 2021
all_shots <- teams_shots(all_active_teams = T, seasons = 2021, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2021_regSeason_shotData.csv", row.names = TRUE)

# 2022
all_shots <- teams_shots(all_active_teams = T, seasons = 2022, season_types = "Regular Season", date_from = 20000602, date_to = 20220612)
write.csv(all_shots,"C:\\Users\\chris\\OneDrive\\Documents\\DOCUMENTS\\School\\Data Vis\\final_project\\nba_2022_regSeason_shotData.csv", row.names = TRUE)
