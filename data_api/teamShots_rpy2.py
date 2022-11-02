######
######  Users must first install rpy2 via:
######  <pip install rpy2>
######
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

result = rpy2.robjects.r('''

    # Write R code here

    return 50 * 2
    
    
''')

print(result)