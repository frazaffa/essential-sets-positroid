# positroid-essential-sets

Algorithm 1 of the paper `Combinatorics of Essential Sets for Positroids` for converting essential sets to bounded affine permutations.

This project is written in JavaScript/HTML. 

## How to run?

1. Open the `index.html` file in your favorite browser. It is recommended to use a Desktop/Laptop.
2. There is a textbox on the left side:
```
gridSize = 8;
label_to_matrix([
    [0,8,1],
    [3,4,2],
    [2,8,4],
    [2,3,4],
    [3,1,8],
]);
```
DO NOT change the order of these commands. Set the `gridSize` as the size of the ground-set of the positroid. Enter the rank conditions as a list of triplets `[r,i,j]` where `r` is the label (rank), and `[i,j]` is the corresponding square of the array as shown above.
3. Click `Run`. This should update the grid according to the input rank conditions.
4. Now, click `Next` to run the algorithm for one loop/step. If you want to run the algortithm automatically, click `Auto Run` button.
5. Click `Check` button to check that the generated dotting is proper and satisfies the input rank conditions.



