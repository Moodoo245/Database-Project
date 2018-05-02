
# coding: utf-8

# In[36]:


import os
import numpy as np
import re


# In[59]:
# function to clean, put name in attribute and remember to change the filter in sub for each element of the row
def clean(name):
    with open(name + '.csv', encoding="utf8") as csvfile:
        reader = csv.reader(csvfile)
        with open(name + '_clean.csv', 'w', newline='', encoding="utf8") as csvfile:
            wr = csv.writer(csvfile, quoting=csv.QUOTE_ALL)
            a = next(reader)
            wr.writerow((a[0], a[1]))
            for row in reader:
                l = [re.sub('[^0-9]+', '', row[0]), re.sub('[^A-Za-zéêñ ]+', '', row[1])]
                wr.writerow(l)
				
				
				
				
				
				
v = set()
with open('languages_clean.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    l = list(reader)
    for i in range(len(l)):
        for k in range(len(l[i][1])):
                v.add(l[i][j][k])


# In[60]:


v


# In[33]:


import csv

with open('languages_clean', 'w', encoding="utf8") as csvfile:
    wr = csv.writer(csvfile, quoting=csv.QUOTE_ALL)
    help(wr.writerow)


# In[ ]:


s = "Pédro+ *ç%+--est 045 gai"


# In[ ]:


help(wr.)


# In[27]:


re.sub('[^A-Za-z ]+', '', s)


# In[68]:





# In[69]:


clean("actors")

