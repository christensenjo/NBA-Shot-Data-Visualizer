######
######  Users must first install rpy2 via:
######  <pip install rpy2>
######
######  and change the R home directory below...
######
import os
os.environ["R_HOME"] = r"C:\Program Files\R\R-4.1.2" # change as needed

import rpy2

from rpy2.robjects.packages import importr
import rpy2.robjects.packages as rpackages
base = importr('base')
utils = importr('utils')

# select a mirror for R packages
utils.chooseCRANmirror(ind=1) # select the first mirror in the list

# R package names
packnames = ('ggplot2', 'hexbin')
from rpy2.robjects.vectors import StrVector
names_to_install = [x for x in packnames if not rpackages.isinstalled(x)]
if len(names_to_install) > 0:
    utils.install_packages(StrVector(names_to_install))

result = rpy2.robjects.r('''return 50 * 2''')


# get_ipython().run_cell_magic(
# "R",
# "-i df",
# '''
# library(ggplot2)
# ggplot(df, aes(x=reorder(cups_of_coffee,productivity), y=productivity)) +
# geom_col() +
# coord_flip()
# '''
# )

print(result)