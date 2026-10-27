# Data Structures and Algorithms with Python — One Connected Question Journey

Think of this as one story:

> **A small program receives data. As the data grows, it becomes slow. To improve it, we must choose better ways to organize data and better steps to process it.**

We will build an imaginary Python application called **Nova Library**. It begins with a few books but eventually grows to millions of books, users, searches, recommendations, and delivery routes.

For every question, try to answer:

1. **What is the problem?**
2. **Which data structure or algorithm could solve it?**
3. **What are its time and space costs?**
4. **Why is it suitable—or unsuitable—for this situation?**
5. **How would Python affect the implementation?**

---

# Chapter 0: Problem Solving — “Before We Write Code”

Nova Library wants a program that finds the most frequently borrowed book.

It is tempting to start coding immediately, but a good solution begins by understanding the problem.

## Questions

1. What exactly is the input?
2. What should the output contain?
3. Can two books have the same highest borrowing count?
4. Should book titles be treated as case-sensitive?
5. What should happen when the input is empty?
6. How large can the input become?
7. Is the data already sorted?
8. Can the input contain invalid or missing values?
9. Should the result be calculated once or updated continuously?
10. How would the solution change if the data contained ten books versus ten million books?
11. Can you solve the problem manually using a small example?
12. What repeated work appears in your manual solution?
13. Which information must be remembered while processing the input?
14. Can the problem be divided into smaller problems?
15. How would you prove that your solution always returns the correct answer?

## Python-thinking questions

16. Which Python data type would represent one book?
17. Would you use a list, tuple, dictionary, class, or dataclass?
18. Which parts of a book should be mutable?
19. How would type hints make the solution easier to understand?
20. Should the function modify the input collection?
21. How would you test the function without depending on user input or files?

### Connection question

22. Two solutions produce the correct answer. How can we decide which one is better?

---

# Chapter 1: Complexity — “Correct Is Not Always Efficient”

Nova Library initially contains 100 books. Almost any solution feels fast.

Later, it contains ten million books. The same program now takes several minutes.

We need a way to discuss how an algorithm grows as the input grows.

## Questions

1. What does input size mean for a collection of books?
2. What is time complexity?
3. What is space complexity?
4. Why do we usually study growth rather than exact execution time?
5. What does Big-O notation describe?
6. What is the difference between:
   - `O(1)`
   - `O(log n)`
   - `O(n)`
   - `O(n log n)`
   - `O(n²)`
   - `O(2ⁿ)`?
7. If an algorithm takes one second for 1,000 records, must it take two seconds for 2,000 records?
8. Why can an `O(n)` algorithm sometimes be faster than an `O(log n)` algorithm for small inputs?
9. Why do constants matter in practice even though Big-O ignores them?
10. What is the difference between best-case, average-case, and worst-case complexity?
11. Why is worst-case analysis important for security-sensitive systems?
12. Can an algorithm save time by using more memory?
13. Can an algorithm save memory by doing more computation?
14. What is amortized complexity?
15. Why can appending to a Python list be considered amortized `O(1)` even though resizing occasionally occurs?

## Growth challenge

Suppose Nova uses these algorithms:

- Algorithm A examines each book once.
- Algorithm B compares every book with every other book.
- Algorithm C repeatedly divides the collection in half.
- Algorithm D tries every possible subset of books.

16. What is the likely complexity of each algorithm?
17. Which one becomes unusable first as the collection grows?
18. Which might remain practical for millions of records?
19. If the input doubles, how does the approximate work change for each algorithm?
20. When might an exponential algorithm still be acceptable?

## Python-specific questions

21. Why is membership testing usually faster in a Python set than in a list?
22. Why can inserting at the beginning of a list be expensive?
23. Why should performance assumptions be measured with realistic data?
24. What is the difference between measuring execution time and analyzing complexity?
25. Why can Python implementation details affect speed without changing Big-O complexity?

### Connection question

26. If storing and accessing data affects performance, how should Nova organize its collection?

---

# Chapter 2: Arrays and Python Lists — “Keeping Items in Order”

Nova stores book IDs in a Python list.

Lists are simple, ordered, and flexible—but not every operation is equally efficient.

## Questions

1. What does it mean for a data structure to be ordered?
2. How does an array differ from a Python list?
3. Why can Python access an element by index quickly?
4. Why is accessing the 500th item not normally slower than accessing the fifth item?
5. Why is inserting at the beginning of a list expensive?
6. What happens to existing elements when an item is inserted in the middle?
7. Why is appending usually faster than inserting at index zero?
8. What happens internally when a Python list runs out of capacity?
9. Why does a Python list usually use more memory than a low-level numeric array?
10. When is a list the right data structure?
11. When would a list be a poor choice?

## Scenario questions

12. Nova frequently adds newly returned books to the end of a collection. Is a list suitable?
13. Nova frequently removes the first waiting user. Is a list still suitable?
14. Nova needs to preserve the exact order in which books were added. Which structure could help?
15. Nova needs to find a particular unsorted book ID. What is the worst-case search time?
16. If the list is sorted, what faster search becomes possible?
17. What is the cost of keeping the list sorted after every insertion?
18. Would you sort once and search many times, or repeatedly perform linear searches?
19. What information would determine the better choice?

## Python behavior questions

20. What is the difference between assigning one list to another variable and copying it?
21. Why can a shallow copy still share nested objects?
22. What problems can occur when a function unexpectedly modifies a list passed by the caller?
23. Why should a mutable list usually not be used as a default function argument?
24. What is the difference between a list comprehension and a generator expression?
25. When can a generator reduce memory usage?
26. What happens if a list is modified while it is being iterated?
27. Why can repeated string concatenation be less suitable than collecting pieces and joining them?

### Connection question

28. Nova frequently inserts and removes items from different positions. Is there a structure that avoids shifting many elements?

---

# Chapter 3: Linked Lists — “Connecting Items Instead of Keeping Them Together”

Instead of storing books next to each other, Nova could store each book in a node that points to another node.

This creates a linked list.

## Questions

1. What information does a singly linked-list node contain?
2. How is a doubly linked list different?
3. Why does a linked list not require elements to be stored next to one another?
4. Why can insertion at the head be `O(1)`?
5. Why is finding the 500th element usually `O(n)`?
6. Why does a linked list not provide efficient indexing?
7. What additional memory does each node require?
8. When is a doubly linked list worth its additional memory?
9. What is the purpose of the head pointer?
10. When is a tail pointer useful?
11. What is a circular linked list?
12. Where might circular lists be useful?

## Thought experiments

13. How would you insert a new node after a known node?
14. How would you remove the first node?
15. What special cases arise when the list is empty?
16. What changes when the list contains only one node?
17. How could you reverse a linked list without creating another list?
18. How could two pointers detect a cycle?
19. How could one slow pointer and one fast pointer find the middle node?
20. How would you determine whether two linked lists eventually merge?
21. What can go wrong if links are updated in the wrong order?
22. How could a lost reference make part of the list unreachable?

## Python-specific questions

23. Python already provides powerful lists and `collections.deque`. When would implementing a linked list still be useful?
24. Why might a hand-written linked list be slower than Python’s built-in structures despite better theoretical insertion complexity?
25. How does Python’s automatic memory management help when nodes are removed?
26. Can circular references affect memory management or debugging?

### Connection question

27. Some operations must follow “last in, first out,” while others follow “first in, first out.” Which specialized structures express these rules?

---

# Chapter 4: Stacks and Queues — “Who Should Be Served Next?”

Nova has two new problems:

- Recently opened pages should be closed in reverse order.
- Waiting users should be served in arrival order.

These problems require stacks and queues.

---

## Part A: Stacks

A stack follows **Last In, First Out**, or LIFO.

### Questions

1. What does LIFO mean?
2. What are the basic stack operations?
3. Why should pushing and popping normally be `O(1)`?
4. What is stack underflow?
5. Where do applications use stacks?
6. How does an Undo feature resemble a stack?
7. Why are nested brackets naturally checked with a stack?
8. How does browser Back history use stack-like behavior?
9. How does function calling involve a call stack?
10. Why can deeply nested recursion exhaust the call stack?
11. How could a stack evaluate a postfix expression?
12. How could two stacks support Back and Forward navigation?

### Python questions

13. Why is the end of a Python list suitable for stack operations?
14. Why is removing from the beginning of a list not equally efficient?
15. When might `deque` also be used as a stack?

---

## Part B: Queues

A queue follows **First In, First Out**, or FIFO.

### Questions

16. What does FIFO mean?
17. Why is FIFO suitable for a waiting line?
18. What are enqueue and dequeue operations?
19. Why is repeatedly removing index zero from a Python list inefficient?
20. Why is `collections.deque` usually a better Python queue?
21. What is a circular queue?
22. How can a circular queue reuse empty space?
23. What is a priority queue?
24. Why does a priority queue not necessarily follow arrival order?
25. How can starvation occur in a priority queue?
26. How might aging make a priority queue fairer?
27. When would a normal queue be better than a priority queue?

## Scenario challenge

Choose a stack, queue, deque, or priority queue for:

28. Undoing text-editor operations
29. Scheduling emergency patients
30. Processing print jobs in arrival order
31. Exploring nearby locations level by level
32. Checking balanced parentheses
33. Keeping the most recent ten searches
34. Serving tasks with different deadlines

### Connection question

35. Nova wants to find books by ID immediately rather than scanning a list. Which structure can provide fast lookup?

---

# Chapter 5: Hash Tables, Dictionaries, and Sets — “Finding Data Quickly”

Nova has millions of books. Searching through every book is too slow.

A hash table can often find a value using a key in approximately constant time.

Python’s `dict` and `set` are built on hashing.

## Questions

1. What is a key-value pair?
2. What does a hash function do?
3. Why must the same key consistently produce the same hash value during its lifetime?
4. What is a hash collision?
5. Can a good hash function completely prevent collisions?
6. How can a hash table handle collisions?
7. Why is dictionary lookup usually `O(1)` on average?
8. Why can worst-case lookup be slower?
9. What is the load factor?
10. Why does a hash table occasionally need to resize?
11. Why does resizing make individual operations occasionally expensive?
12. How does amortized analysis explain dictionary performance?
13. When is a dictionary better than a list?
14. When is a set better than a list?
15. Why does a set store unique values?
16. How can sets efficiently calculate union, intersection, and difference?

## Python-specific questions

17. Why can strings and tuples often be dictionary keys?
18. Why cannot a normal list be a dictionary key?
19. What does it mean for an object to be hashable?
20. Why must hashable keys not change in a way that affects equality?
21. Can a tuple containing a list be used as a dictionary key?
22. What relationship should exist between equality and hash values?
23. Why can mutable objects make dangerous keys?
24. Does a Python dictionary preserve insertion order?
25. Is insertion order the same as sorted order?
26. What should happen when a requested key does not exist?
27. When would membership testing with `in` be more suitable than catching an exception?
28. When might a frequency dictionary solve a problem in one pass?

## Scenario questions

29. How would you count how often each word appears in a document?
30. How would you detect the first repeated book ID?
31. How would you find common books in two reading lists?
32. How would you group books by author?
33. How would you implement a simple cache?
34. What happens when the cache grows without limit?
35. How could maliciously chosen keys affect a poorly designed hash table?

### Connection question

36. Fast lookup is useful, but what if Nova needs its data arranged by hierarchy or search order?

---

# Chapter 6: Recursion — “A Problem Hidden Inside Itself”

Nova organizes books into categories, subcategories, and smaller subcategories.

The same task—visiting a category—is repeated inside every category.

This naturally suggests recursion.

## Questions

1. What is recursion?
2. What is a base case?
3. What happens when a recursive function has no reachable base case?
4. What is the recursive case?
5. How does the call stack remember unfinished function calls?
6. Why can recursion make some solutions easier to understand?
7. Why can recursion use more memory than iteration?
8. Can every recursive algorithm be written iteratively?
9. Can every iterative algorithm be written recursively?
10. When does recursion improve clarity?
11. When does recursion create unnecessary risk?

## Reasoning questions

12. How would you calculate factorial recursively?
13. How would you explain factorial without using code?
14. Why is naive recursive Fibonacci inefficient?
15. Which calculations are repeated in naive Fibonacci?
16. How could memoization prevent repeated work?
17. How could an iterative Fibonacci solution use less stack space?
18. How would recursion search through nested folders?
19. What should happen if a directory contains a symbolic-link cycle?
20. How would you prevent infinite traversal?

## Python-specific questions

21. Why does Python impose a recursion-depth limit?
22. Why is increasing that limit not always a safe solution?
23. Does Python automatically optimize tail recursion?
24. When should an explicit stack replace recursion?
25. How can caching recursive results improve performance?
26. What memory risks can an unlimited cache introduce?
27. Why should recursive functions be tested with very deep and very small inputs?

### Connection question

28. Recursive structures often appear as trees. How can Nova use a tree to represent its categories?

---

# Chapter 7: Trees — “Organizing Hierarchical Data”

Nova’s categories form a hierarchy:

- Books
  - Science
    - Physics
    - Biology
  - Arts
    - Music
    - Painting

This is naturally represented as a tree.

## Questions

1. What is a tree?
2. What are root, parent, child, sibling, leaf, and subtree?
3. What is the depth of a node?
4. What is the height of a tree?
5. What is the difference between a tree and a general graph?
6. Why are file systems often represented as trees?
7. What is a binary tree?
8. Must every binary tree be a Binary Search Tree?
9. What does it mean for a tree to be balanced?
10. Why does tree height affect performance?

## Traversal questions

11. What is depth-first traversal?
12. What is breadth-first traversal?
13. How do preorder, inorder, and postorder differ?
14. Which traversal would copy a tree structure?
15. Which traversal would naturally delete children before parents?
16. Why does inorder traversal of a Binary Search Tree produce sorted values?
17. Which data structure supports breadth-first traversal?
18. Which data structure supports iterative depth-first traversal?
19. How would you traverse an extremely deep tree without risking Python recursion limits?

## Binary Search Tree questions

20. What ordering rule defines a Binary Search Tree?
21. How is a value inserted?
22. How is a value searched?
23. Why can search be `O(log n)` in a balanced tree?
24. How can a Binary Search Tree become similar to a linked list?
25. What becomes the search complexity in that case?
26. Why is deletion harder when a node has two children?
27. How can the inorder successor help during deletion?
28. How should duplicate values be handled?
29. Why do self-balancing trees exist?
30. When might a dictionary be preferable to a Binary Search Tree?
31. When might an ordered tree be preferable to a dictionary?

## Python questions

32. Python does not include a built-in general Binary Search Tree. When should you use another standard structure instead of implementing one?
33. Could a sorted list with binary search be sufficient when updates are rare?
34. What costs arise when inserting into the middle of that sorted list?

### Connection question

35. Nova does not always need every item in sorted order—it often needs only the highest-priority item. Can a specialized tree help?

---

# Chapter 8: Heaps and Priority Queues — “Give Me the Most Important Item”

Nova must repeatedly select the next most urgent request.

Sorting every request after every change would be wasteful. A heap can maintain access to the smallest or largest priority.

## Questions

1. What is a heap?
2. What is the difference between a min-heap and a max-heap?
3. Is a heap fully sorted?
4. Which element can be accessed efficiently?
5. Why can insertion be `O(log n)`?
6. What is the purpose of “sifting” an element?
7. Why can reading the minimum be `O(1)`?
8. Why is removing the minimum usually `O(log n)`?
9. How can a binary heap be represented inside a list?
10. How are parent and child positions calculated?
11. Why does a heap not provide efficient search for an arbitrary value?
12. When is a heap better than a sorted list?

## Python-specific questions

13. Does Python’s `heapq` provide a min-heap or max-heap by default?
14. How could a priority queue handle items with equal priorities?
15. Why might inserting a sequence number prevent comparison problems?
16. What happens if two heap entries have equal priorities but their values cannot be compared?
17. How could you keep only the ten largest values from a stream?
18. Why might a fixed-size heap use less memory than sorting the entire stream?

## Scenario questions

19. How would a heap schedule urgent library requests?
20. How would a heap find the three cheapest delivery options?
21. How is a heap used in Dijkstra’s shortest-path algorithm?
22. How is heap sort different from repeatedly sorting a list?
23. Why can a priority queue cause starvation?
24. How would you add fairness without losing priority entirely?

### Connection question

25. Nova’s users search for titles by prefix, such as “alg…”. Can a structure organize data character by character?

---

# Chapter 9: Strings and Tries — “Searching Words and Prefixes”

Book titles, authors, messages, and search terms are strings.

Text algorithms must consider matching, prefixes, normalization, and international characters.

## Questions

1. Is a Python string mutable?
2. What happens when a string appears to be modified?
3. Why can repeatedly creating new strings be expensive?
4. What is substring searching?
5. What is prefix searching?
6. What is the difference between searching for an exact word and searching for all words beginning with a prefix?
7. How could a simple linear scan find a substring?
8. Why can naive pattern matching repeat comparisons?
9. What idea allows algorithms such as KMP to avoid rechecking known information?
10. When is a rolling hash useful in string searching?
11. Can hash matches be trusted without verifying the actual text?

## Trie questions

12. What is a trie?
13. What does each path through a trie represent?
14. Why is a trie useful for autocomplete?
15. How does the length of a search word affect trie lookup time?
16. Why can tries consume significant memory?
17. When might a sorted list plus binary search be simpler than a trie?
18. How would a trie represent the difference between `car` and `cart`?
19. How could Nova rank autocomplete suggestions by popularity?
20. What happens when suggestions must support spelling mistakes?

## Python and text questions

21. Why can indexing text be more complicated with Unicode than with simple ASCII assumptions?
22. Why might visually identical strings have different internal representations?
23. When should text be normalized?
24. What security problems can visually similar Unicode characters create?
25. Why is `.lower()` not always enough for language-independent case-insensitive comparison?
26. How would you avoid cutting a user-visible character incorrectly?

### Connection question

27. Nova can now organize data, but it still needs reliable methods for finding individual items. Which search algorithms should it use?

---

# Chapter 10: Searching — “Where Is the Item?”

Nova users expect search results immediately.

The correct searching algorithm depends on how the data is organized.

## Linear Search

1. How does linear search work?
2. Does linear search require sorted data?
3. What is its best-case complexity?
4. What is its worst-case complexity?
5. When is linear search a reasonable choice?
6. Why might linear search outperform a more advanced method on a tiny collection?

## Binary Search

7. What condition must normally be true before binary search can be used?
8. Why does binary search repeatedly discard half the search space?
9. What is its time complexity?
10. What happens if binary search is used on unsorted data?
11. How can incorrect boundary updates cause an infinite loop?
12. How should the midpoint be calculated?
13. How would you find the first occurrence of a duplicated value?
14. How would you find the last occurrence?
15. How would you find the correct insertion position for a missing value?
16. What does Python’s `bisect` module help accomplish?
17. Does `bisect` make insertion into a list `O(log n)` overall?
18. Why does shifting list elements still matter?

## Decision questions

19. Nova performs one search on unsorted data. Should it sort first?
20. Nova performs one million searches on mostly unchanged data. Should it sort first?
21. When is a dictionary lookup preferable to binary search?
22. When does binary search provide something a dictionary does not?
23. How could binary search solve a problem involving an answer range rather than an actual list?
24. What does it mean to “binary search the answer”?
25. Which condition must be monotonic for that technique to work?

### Connection question

26. Binary search benefits from sorted data. How should Nova sort efficiently?

---

# Chapter 11: Sorting — “Putting Data in Meaningful Order”

Nova needs to sort books by title, popularity, price, and publication date.

Different sorting algorithms make different trade-offs.

## General questions

1. Why is sorting useful beyond simply displaying data?
2. What is a comparison-based sorting algorithm?
3. What does it mean for a sorting algorithm to be stable?
4. Why might stability matter when sorting by several fields?
5. What does in-place sorting mean?
6. Is an in-place algorithm guaranteed to use no extra memory?
7. What is an adaptive sorting algorithm?
8. Why does existing order in the input sometimes matter?
9. Why is `O(n log n)` important for comparison-based sorting?
10. Can special knowledge about keys allow faster-than-`O(n log n)` sorting?

## Algorithm questions

### Bubble Sort

11. Why does Bubble Sort repeatedly move large elements toward the end?
12. What is its worst-case complexity?
13. What useful lesson does it teach despite rarely being the best practical choice?

### Selection Sort

14. How does Selection Sort choose the next item?
15. Why does it perform relatively few swaps?
16. Why does it still make many comparisons?

### Insertion Sort

17. Why is Insertion Sort effective for small or nearly sorted inputs?
18. How is it similar to arranging cards in your hand?
19. Why can it still become `O(n²)`?

### Merge Sort

20. How does Merge Sort divide and combine data?
21. Why is its time complexity `O(n log n)`?
22. Why does it usually need additional memory?
23. Why is it suitable for linked lists and external sorting?

### Quick Sort

24. What is a pivot?
25. What is partitioning?
26. Why is Quick Sort often fast in practice?
27. What input or pivot choices can cause worst-case `O(n²)` behavior?
28. How can randomized pivot selection reduce this risk?
29. Is Quick Sort naturally stable?

### Heap Sort

30. How does Heap Sort repeatedly select the next element?
31. Why does it guarantee `O(n log n)`?
32. Why might it have different practical performance from Python’s built-in sorting?

## Python-specific questions

33. What is the difference between `sorted()` and `list.sort()`?
34. Which one returns a new list?
35. What is a key function?
36. Why is a key function often clearer than a custom comparison function?
37. Is Python’s built-in sort stable?
38. How can stability support sorting by multiple fields?
39. Why should production Python usually use the built-in sort rather than a hand-written sorting algorithm?
40. What advantages does Python’s Timsort gain from already sorted runs?
41. What happens if the key function performs expensive work repeatedly?
42. How could keys be precomputed when necessary?
43. How should missing values be handled during sorting?
44. What deterministic tie-breaker should be used when equal values must have a consistent order?

### Connection question

45. Merge Sort and Quick Sort solve problems by dividing them into smaller parts. Is this a general strategy?

---

# Chapter 12: Divide and Conquer — “Solve Smaller Versions, Then Combine”

Divide and Conquer follows three ideas:

1. Divide the problem.
2. Solve smaller subproblems.
3. Combine their results.

## Questions

1. How does Merge Sort use Divide and Conquer?
2. How does Binary Search use it?
3. What makes the subproblems smaller?
4. Why is a base case necessary?
5. When is combining results easy?
6. When can combining results become the expensive part?
7. How does balanced division affect performance?
8. What happens if one subproblem contains almost all the input?
9. How can recursion trees help analyze complexity?
10. What does the recurrence `T(n) = 2T(n/2) + O(n)` describe conceptually?
11. Why does dividing into halves often lead to logarithmic depth?
12. Can Divide and Conquer run subproblems in parallel?
13. What overhead could make parallel processing slower for small inputs?
14. How would you find the maximum value using Divide and Conquer?
15. Is that necessarily better than a simple linear scan?
16. What does this comparison teach about choosing the simplest suitable algorithm?

### Connection question

17. Divide and Conquer solves independent subproblems. What if the same subproblems appear repeatedly?

---

# Chapter 13: Dynamic Programming — “Stop Solving the Same Problem Again”

Nova plans reading rewards and delivery routes. Many possible decisions lead to the same smaller subproblems.

Dynamic Programming saves and reuses those results.

## Questions

1. What is an overlapping subproblem?
2. What is optimal substructure?
3. Why are both ideas important for Dynamic Programming?
4. How is memoization different from ordinary recursion?
5. What is tabulation?
6. How does top-down DP differ from bottom-up DP?
7. When is memoization easier to design?
8. When can tabulation use less overhead?
9. How do you define a DP state?
10. Why is choosing the state often the hardest part?
11. What is a recurrence relation?
12. What are the base cases?
13. In what order must states be calculated?
14. Is every recursive problem a DP problem?
15. Can DP reduce exponential time to polynomial time?
16. What memory cost may accompany that improvement?
17. How can state compression reduce memory use?

## Problem-thinking questions

18. Why is naive Fibonacci exponential?
19. How does memoization change its complexity?
20. In the climbing-stairs problem, what should one state represent?
21. In the coin-change problem, what decisions are available?
22. In the longest common subsequence problem, why are two positions needed?
23. In the 0/1 knapsack problem, why must the remaining capacity be part of the state?
24. Why is greedy selection not always correct for coin change?
25. How would you reconstruct the selected items rather than returning only the best score?
26. How can an incorrectly chosen state produce a correct-looking but incomplete solution?

## Python-specific questions

27. When can a dictionary represent sparse DP states?
28. When is a list more memory-efficient than a dictionary?
29. How can Python caching tools support memoization?
30. Why should cached function arguments be hashable?
31. How can an unbounded memoization cache exhaust memory?
32. Why should large DP tables be estimated before allocation?

### Connection question

33. DP remembers repeated subproblems. But what if a locally best choice can directly lead to the global best solution?

---

# Chapter 14: Greedy Algorithms — “Choose the Best Option Right Now”

A greedy algorithm makes the best-looking current decision and does not normally reconsider it.

## Questions

1. What is a greedy choice?
2. Why are greedy algorithms often simple and fast?
3. Does a locally best choice always create a globally best result?
4. What must be proven before trusting a greedy strategy?
5. What is the greedy-choice property?
6. How can an exchange argument help prove correctness?
7. Why does selecting the earliest finishing activity maximize the number of compatible activities?
8. Why does repeatedly choosing the largest coin fail for some coin systems?
9. Why does fractional knapsack support a greedy solution?
10. Why does 0/1 knapsack generally require a different approach?
11. How does Huffman coding use repeated greedy choices?
12. How do minimum-spanning-tree algorithms use greedy decisions?
13. How can sorting be an important first step in a greedy algorithm?
14. When might a greedy approximation be acceptable even if it is not always optimal?
15. What should be documented when an algorithm sacrifices optimality for speed?

## Design challenge

Nova wants to schedule the largest possible number of events in one room.

16. Should it choose the event that:
   - Starts first?
   - Is shortest?
   - Ends first?
   - Has the fewest conflicts?
17. Construct an example where a wrong greedy choice fails.
18. How would you justify the correct strategy rather than merely observing that it works?

### Connection question

19. What if no safe greedy rule exists and Nova must explore different choices?

---

# Chapter 15: Backtracking — “Try, Fail, Undo, and Try Again”

Nova wants to arrange events under many constraints.

Backtracking explores a choice, checks whether it can still succeed, and reverses the choice when necessary.

## Questions

1. What is a decision tree?
2. What does it mean to choose, explore, and unchoose?
3. How is backtracking different from ordinary brute force?
4. What is pruning?
5. How can constraints reject a partial solution early?
6. Why can good pruning dramatically improve performance?
7. Does pruning always change worst-case exponential complexity?
8. How does backtracking solve a maze?
9. How can it solve Sudoku?
10. How does it generate permutations?
11. How can duplicate input values create duplicate results?
12. How could sorting help skip repeated choices?
13. Why must mutable state be restored after a recursive call?
14. What bugs occur when the same result list is stored without copying?
15. When should backtracking stop after finding one answer?
16. When must it continue to find every answer?
17. How could choices be ordered to find a solution sooner?
18. How could an impossible input cause excessive computation?
19. Should a public service place limits on expensive combinatorial requests?

### Connection question

20. Some problems are not simple sequences or hierarchies. They contain many-to-many relationships. How should Nova represent them?

---

# Chapter 16: Graphs — “Everything Is Connected”

Nova now connects:

- Users to friends
- Books to related books
- Libraries to roads
- Courses to prerequisites

These relationships form graphs.

## Foundations

1. What is a graph?
2. What are vertices and edges?
3. What is the difference between directed and undirected graphs?
4. What is a weighted graph?
5. What is a cycle?
6. What is a path?
7. What is a connected component?
8. What is the degree of a vertex?
9. How does a graph differ from a tree?
10. Can a tree be considered a graph?

## Representation questions

11. What is an adjacency list?
12. What is an adjacency matrix?
13. Which representation uses less memory for a sparse graph?
14. Which provides fast testing of whether a particular edge exists?
15. How could Python dictionaries and sets represent an adjacency list?
16. How should isolated vertices be represented?
17. How would edge direction affect storage?
18. How should weighted edges be represented?

## BFS and DFS

19. How does Breadth-First Search explore a graph?
20. Which data structure does BFS require?
21. How does Depth-First Search explore?
22. Which structure does iterative DFS require?
23. Why must graph traversal track visited vertices?
24. What happens without a visited set when the graph contains a cycle?
25. Why does BFS find the shortest path in an unweighted graph?
26. Why does ordinary DFS not guarantee that shortest path?
27. How would you reconstruct the path rather than only discovering the destination?
28. How can DFS detect cycles?
29. How can BFS find degrees of separation in a social network?
30. How can graph traversal find disconnected groups?

## Directed graphs and dependencies

31. What is a Directed Acyclic Graph?
32. How can course prerequisites form a DAG?
33. What is topological ordering?
34. Why is topological sorting impossible when a dependency cycle exists?
35. How could Nova report the actual cycle instead of only saying that one exists?
36. Where are topological orders used in software builds and task scheduling?

## Shortest paths

37. Why does BFS work for unweighted shortest paths?
38. What problem does Dijkstra’s algorithm solve?
39. Why does Dijkstra commonly use a priority queue?
40. Why does Dijkstra fail with negative edge weights?
41. Which algorithms can handle negative weights?
42. What is a negative-weight cycle?
43. How can a heuristic help A* search?
44. What happens if the heuristic overestimates the remaining cost?

## Minimum spanning trees

45. What is a spanning tree?
46. What is a minimum spanning tree?
47. How is a minimum spanning tree different from a shortest-path tree?
48. How does Kruskal’s algorithm choose edges?
49. How does Prim’s algorithm grow a tree?
50. Where might Nova use a minimum spanning tree to reduce connection cost?

### Connection question

51. Kruskal’s algorithm must quickly determine whether two vertices are already connected. Which specialized structure can help?

---

# Chapter 17: Disjoint Sets — “Are These Items Already Connected?”

A Disjoint Set Union structure maintains separate groups and efficiently joins them.

It is also called **Union-Find**.

## Questions

1. What problem does Union-Find solve?
2. What does the `find` operation determine?
3. What does `union` do?
4. How can a parent array represent groups?
5. What is path compression?
6. Why does path compression speed up future searches?
7. What is union by rank or size?
8. Why should a shallow tree be attached under a deeper tree?
9. How do these optimizations make operations nearly constant time in practice?
10. How can Union-Find detect a cycle in an undirected graph?
11. How does Kruskal’s algorithm use it?
12. How could it group users belonging to the same community?
13. What operations does ordinary Union-Find not support efficiently?
14. Why is separating a previously joined group difficult?

### Connection question

15. Nova now knows many structures and algorithms. How can it choose the right one instead of memorizing all of them?

---

# Chapter 18: Choosing the Right Tool — “There Is No Best Structure”

The best structure depends on the operations that matter most.

## Questions

1. Do you need ordered or unordered data?
2. Are duplicate values allowed?
3. Is fast lookup important?
4. Is fast insertion important?
5. Must the smallest or largest item be repeatedly available?
6. Must items be processed by arrival order?
7. Must recent items be processed first?
8. Are relationships hierarchical or many-to-many?
9. Is the input static or frequently changing?
10. Is memory limited?
11. Is worst-case performance important?
12. Is thread safety required?
13. Does the result need to be deterministic?
14. Can input be maliciously chosen?
15. Is the built-in Python implementation sufficient?

## Selection challenge

Choose the most appropriate structure:

16. Unique usernames
17. Books grouped by author
18. Undo history
19. Customer waiting line
20. Emergency-room scheduling
21. Autocomplete words
22. Folder hierarchy
23. City-road network
24. Frequently accessed cached pages
25. A continuously updated median
26. The ten largest values from a massive stream
27. Dependencies between software packages
28. Checking whether two network devices are connected
29. Finding repeated values
30. Maintaining sorted data with frequent searches but rare updates

For each choice, explain:

- The important operations
- Their expected complexity
- The main trade-off
- The closest alternative

---

# Chapter 19: Python-Specific Algorithmic Thinking

Understanding the language is part of understanding the algorithm.

## Built-in structures

1. When should you use `list`?
2. When should you use `tuple`?
3. When should you use `set`?
4. When should you use `dict`?
5. When should you use `deque`?
6. When should you use a heap?
7. Why should standard-library structures usually be preferred over hand-written versions in production?
8. When is implementing a structure yourself still educational or necessary?

## Mutability and identity

9. What is the difference between equality and identity?
10. Why can two equal lists be different objects?
11. What does it mean for an object to be mutable?
12. Why can aliasing produce surprising changes?
13. What is the difference between shallow and deep copying?
14. Why can deep copying an arbitrary object graph be expensive or inappropriate?
15. Why are immutable values safer as dictionary keys?

## Iteration and generators

16. What is an iterable?
17. What is an iterator?
18. What is a generator?
19. Why can generators process large streams with little memory?
20. What is lost after a one-time iterator has been consumed?
21. Why might converting every input to a list defeat streaming?
22. When is lazy evaluation useful?
23. When can lazy evaluation make debugging or error timing less obvious?

## Functions and sorting

24. Why are small, pure functions easier to test?
25. What is a key function?
26. How can a lambda improve or reduce readability?
27. Why should expensive work not be hidden carelessly inside a sorting key?
28. How can stable sorting support multiple ordering rules?

## Safety and correctness

29. Why should inputs be validated before running an expensive algorithm?
30. How can extremely large inputs become a denial-of-service risk?
31. Why should recursive depth, collection size, and processing time sometimes be limited?
32. Why should untrusted data never control arbitrary code execution?
33. Why should algorithms avoid modifying caller-owned data unless clearly documented?
34. Why are clear exceptions better than silently returning incorrect results?
35. How do type hints, tests, and assertions serve different purposes?

---

# Cross-Chapter Detective Challenges

## 1. The Search That Became Slow

Nova originally stored 100 books in a list. It now stores ten million books, and title searches are slow.

Investigate:

1. Is the data sorted?
2. Are searches exact, prefix-based, or substring-based?
3. How frequently are books inserted?
4. Would a dictionary, sorted list, trie, or database index be suitable?
5. What memory trade-offs would each choice introduce?
6. How would you measure improvement?
7. Which solution is simplest while still meeting the requirement?

---

## 2. The Memory-Hungry Program

A Python program processes a ten-gigabyte log file and runs out of memory.

Ask:

1. Did it read the entire file into a list?
2. Could it process one line at a time?
3. Could a generator help?
4. Does it really need every record?
5. Could it maintain only counts or the top few values?
6. Is an unlimited dictionary or cache growing?
7. Would a heap keep only the most important results?
8. How would you verify where memory is being used?

---

## 3. The Correct but Slow Fibonacci Function

A recursive Fibonacci function returns correct answers for small values but becomes extremely slow.

Ask:

1. Which calls are repeated?
2. What is the approximate time complexity?
3. Could memoization help?
4. Could bottom-up calculation use less stack space?
5. Is Fibonacci the actual business problem, or only a teaching example?
6. What does this teach us about correctness versus efficiency?

---

## 4. The Duplicate Payment

Nova receives the same transaction twice.

Ask:

1. Would a set help identify processed transaction IDs?
2. What happens if the program restarts and the set is lost?
3. Should the information be stored persistently?
4. Could checking and inserting separately create a race condition?
5. What uniqueness guarantee should the database provide?
6. Why is selecting a data structure only part of the complete solution?

---

## 5. The Unfair Task Scheduler

High-priority tasks continuously enter a priority queue. Low-priority tasks never run.

Ask:

1. Is the heap functioning correctly?
2. Is the algorithm fair?
3. What is starvation?
4. Could waiting time gradually increase priority?
5. Should some tasks have deadlines?
6. Which matters more here: strict priority or bounded waiting?

---

## 6. The Recommendation Maze

Nova recommends books by following relationships:

- Users like books.
- Books share authors.
- Books belong to categories.
- Users follow other users.

Ask:

1. Is this naturally a graph?
2. What should the vertices represent?
3. What should the edges represent?
4. Are edges directed or undirected?
5. Should edges have weights?
6. Would BFS, DFS, shortest paths, or ranking algorithms help?
7. How would you prevent cycles from causing endless traversal?
8. How would you limit the amount of personal data exposed?

---

# Algorithm Design Challenges

## Challenge 1: Recently Viewed Books

Nova must remember the 20 most recently viewed books.

1. Should duplicate views be kept?
2. Should viewing an existing book move it to the front?
3. Which operations must be fast?
4. Would a list alone be enough?
5. Could a dictionary combined with a doubly linked list help at larger scale?
6. Which simpler Python structure might be sufficient for only 20 items?

---

## Challenge 2: Top Ten Books

Millions of ratings arrive continuously. Nova must show the ten highest-rated books.

1. Should it sort every book after every rating?
2. Could a heap maintain only ten candidates?
3. How should ties be handled?
4. What happens when a book’s rating changes?
5. Is the ranking exact or approximate?
6. How often must the displayed result be updated?

---

## Challenge 3: Course Prerequisites

A student wants to take “Advanced Algorithms.”

1. How should prerequisites be represented?
2. How can Nova detect circular prerequisites?
3. How can it produce a valid learning order?
4. Can several valid orders exist?
5. How should unavailable courses affect the result?
6. Which graph algorithm solves this problem?

---

## Challenge 4: Library Delivery Routes

A delivery vehicle must visit several libraries.

1. Is the goal to reach one destination or visit all destinations?
2. Are roads weighted by distance, time, or cost?
3. Can road weights be negative?
4. Would BFS or Dijkstra solve the problem?
5. Is this actually related to the Traveling Salesperson Problem?
6. Must the result be optimal?
7. Would an approximation be acceptable for hundreds of locations?

---

# Final Capstone — Build Nova Library’s Algorithmic Design

Nova Library must support:

- Millions of books
- User accounts
- Exact title lookup
- Prefix autocomplete
- Waiting lists
- Urgent requests
- Category hierarchies
- Book recommendations
- Delivery routes
- Trending-book calculations
- Course prerequisites
- Large log streams

## Design questions

1. Which structure would store books by unique ID?
2. Which structure would preserve books in display order?
3. How would exact title lookup work?
4. How would prefix autocomplete work?
5. Which structure would represent a normal waiting list?
6. Which structure would represent urgent requests?
7. How would category hierarchies be represented?
8. How would recommendations be modeled as a graph?
9. Which algorithm would find nearby related books?
10. Which algorithm would find the shortest delivery route?
11. How would course prerequisites be ordered?
12. How would prerequisite cycles be detected?
13. How would the system find the ten most popular books?
14. How would large logs be processed without loading everything into memory?
15. Which data should be cached?
16. How would cache growth be limited?
17. Which operations need stable sorting?
18. Where could binary search be useful?
19. Where could Dynamic Programming be useful?
20. Where could a greedy algorithm be sufficient?
21. Where might backtracking become dangerously expensive?
22. Which input limits would protect the service from resource exhaustion?
23. How would malformed data be handled?
24. Which assumptions must be documented?
25. How would you test correctness and performance separately?
26. How would you compare two possible solutions?
27. Which Python standard-library tools would reduce implementation complexity?
28. Which parts should remain simple rather than using advanced structures?
29. What happens when the amount of data grows by 100 times?
30. Which design decisions would need to change first?

---

# The Ultimate Understanding Question

A user searches for a book, joins its waiting list, receives a recommendation, and asks for the shortest delivery route.

Explain how Nova might use:

- A dictionary for book lookup
- A trie or sorted structure for autocomplete
- A queue for the waiting list
- A heap for urgent requests
- A tree for categories
- A graph for recommendations
- BFS or DFS for exploration
- Dijkstra’s algorithm for routes
- Sorting for displaying results
- A set for preventing duplicates
- A generator for processing large data streams
- Complexity analysis for confirming scalability

For every choice, explain:

1. Why the structure or algorithm fits
2. Its expected time and space complexity
3. Its most important limitation
4. The Python feature or standard-library tool that could implement it

If you can tell this complete story, you are no longer memorizing data structures and algorithms. You are learning to answer the most important question:

> **“Given this problem, this data, and these constraints, why is this the right solution?”**