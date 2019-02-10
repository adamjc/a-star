# A* Searching for Mazes

https://adamjc.github.io/a-star

![](a-star-algorithm.gif)

It's not completely perfect, but I think the algorithm is correct. I've made a minor optimization so that unless `f(h)` is *much* better than current `f(h)`, we will still continue on our path.