import numpy as np

x = np.array([1, 2, 3], dtype=np.float32)
Z = np.zeros((2, 4), dtype=np.float32)   # also ones, full, empty
a = np.arange(0, 10, 2)                  # 0..8 step 2
b = np.linspace(1, 100, 100)                 # 5 points inc. endpoints


print (b.reshape(10,10).flatten())