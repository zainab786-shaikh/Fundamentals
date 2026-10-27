# Operating Systems: A Connected, Question-Driven Learning Journey

The questions below progress from **understanding → application → analysis → design**. Many reuse the same imaginary computer, **Nova**, so every chapter remains connected to the larger operating-system story.

For each question, try answering in four parts:

1. **What is the problem?**
2. **Which OS mechanism solves it?**
3. **What trade-off does the solution introduce?**
4. **How does it connect to another chapter?**

---

## Chapter 0 — Booting: Awakening the Machine

### Conceptual questions

1. Nova has a CPU, RAM, and an SSD, but RAM is empty when power is first applied. How can the machine execute enough instructions to load an operating system?
2. What responsibilities belong to firmware, the bootloader, and the kernel? Why not put everything into one component?
3. Why is the kernel normally loaded into RAM instead of being executed directly from storage?
4. Compare BIOS and UEFI. What modern capabilities make UEFI more suitable for current computers?
5. What is POST checking, and what should happen if an essential component fails?

### Investigation and design questions

6. Trace Nova’s journey from pressing the power button to displaying a login screen. Identify every major transfer of control.
7. The firmware finds two bootable operating systems. Design a safe mechanism that lets the user choose one.
8. An attacker replaces Nova’s bootloader with a malicious version. How could Secure Boot detect or prevent this?
9. The bootloader successfully loads the kernel, but the kernel cannot locate its root file system. Which stage succeeded, and where should troubleshooting begin?
10. If you were designing a bootloader for an embedded device, what features would you omit compared with a desktop bootloader, and why?

### Connection question

11. The bootloader initially has broad control over the machine. How does control become more restricted once user programs begin running?

---

## Chapter 1 — Dual Mode, System Calls, and Kernel Architecture

### Conceptual questions

1. Why must applications run in user mode rather than kernel mode?
2. What hardware support is required to enforce the separation between user mode and kernel mode?
3. What happens, step by step, when a user program calls `read()` to obtain data from a file?
4. How is a system call different from an ordinary function call?
5. Why must the kernel validate every pointer, buffer size, file descriptor, and permission supplied through a system call?

### Scenario questions

6. A text editor attempts to execute a privileged CPU instruction. What should happen, and which OS component handles it?
7. A program passes a pointer to memory it does not own into a system call. What security checks should the kernel perform?
8. Imagine that applications could write directly to disk sectors. Describe three failures or attacks that could result.
9. A device driver crashes inside a monolithic kernel. Why might the entire system crash? Would the result necessarily be the same in a microkernel?
10. Compare monolithic, microkernel, and hybrid architectures in terms of:
   - Performance
   - Fault isolation
   - Security
   - Maintainability
   - Communication overhead

### Design question

11. You are designing an OS for a medical device where reliability matters more than maximum performance. Which kernel architecture would you consider, and what evidence would you need before choosing it?

### Connection question

12. A system call blocks while waiting for disk data. How can the scheduler use that waiting time to run another process?

---

## Chapter 2 — Processes and CPU Scheduling

### Conceptual questions

1. What information must the OS store in a Process Control Block?
2. Explain the difference between a program, a process, and a job.
3. Why can several programs appear to run simultaneously on a single-core CPU?
4. What information must be saved and restored during a context switch?
5. Why is a context switch necessary but still considered overhead?

### Scheduling exercise

Nova has the following processes:

| Process | Arrival time | CPU burst | Priority |
|---|---:|---:|---:|
| P1 | 0 | 8 | 3 |
| P2 | 1 | 4 | 1 |
| P3 | 2 | 2 | 2 |
| P4 | 3 | 1 | 1 |

Assume a lower priority number means higher priority.

6. Draw Gantt charts for:
   - FCFS
   - Non-preemptive SJF
   - Preemptive SJF/SRTF
   - Round Robin with quantum 2
   - Preemptive Priority Scheduling
7. Calculate each process’s waiting time, turnaround time, and response time.
8. Which algorithm gives the lowest average waiting time?
9. Which algorithm gives the most predictable response for interactive users?
10. Which processes risk starvation, and how could aging help?

### Design questions

11. Why is a very small Round Robin quantum inefficient, while a very large quantum begins to resemble FCFS?
12. Design a Multilevel Feedback Queue for a system running interactive applications, background backups, and CPU-intensive simulations.
13. Should antivirus software always receive higher priority than a music player? Explain the user-experience and security trade-offs.
14. Two scheduling algorithms have the same average waiting time. What additional metrics would you compare before choosing one?

### Connection question

15. When a running process requests disk I/O, how do its state and position in the scheduling queues change?

---

## Chapter 3 — Threads, Concurrency, and Parallelism

### Conceptual questions

1. Which resources are shared by threads in the same process, and which resources remain private to each thread?
2. Why is creating or switching threads generally cheaper than creating or switching processes?
3. Explain the difference between concurrency and parallelism using a single-core and a multicore machine.
4. Compare user-level threads and kernel-level threads.
5. How do many-to-one, one-to-one, and many-to-many threading models behave when one thread blocks?

### Scenario questions

6. Design a threaded web server that handles 10,000 mostly idle network connections. Would one thread per connection be appropriate?
7. A four-core computer runs a program with twelve CPU-intensive threads. How many can execute simultaneously, and what happens to the others?
8. A browser runs every tab as a thread in one process. What performance benefits might this provide, and what isolation problems could occur?
9. Compare these models for a chat server:
   - One process per client
   - One thread per client
   - A worker thread pool
   - Async/event-driven I/O
10. A program spends 90% of its time waiting for network responses. Would adding CPU cores significantly improve it? What design change might help more?

### Design questions

11. How would you choose an appropriate thread-pool size for:
   - CPU-bound work
   - I/O-bound work
12. Give an example where multithreading makes a program slower due to synchronization, scheduling, or cache effects.
13. Why can testing a concurrent program repeatedly fail to reveal a race condition that still exists?

### Connection question

14. Threads improve performance by sharing memory. Why does that same feature create the need for synchronization?

---

## Chapter 4 — Synchronization and Race Conditions

### Conceptual questions

1. What makes an operation such as `counter++` non-atomic?
2. Define the critical-section requirements:
   - Mutual exclusion
   - Progress
   - Bounded waiting
3. How is a mutex different from a semaphore?
4. When is a counting semaphore more appropriate than a binary semaphore?
5. What does a monitor provide that manually managed locks do not?

### Race-condition investigation

Two threads execute the following operation on a shared counter initially equal to zero:

```text
repeat 100,000 times:
    counter = counter + 1
```

6. Why might the final result be less than 200,000?
7. Break one increment into read, modify, and write operations, and construct an interleaving that loses an update.
8. Propose three ways to fix the race condition.
9. Compare the correctness and performance implications of:
   - A mutex
   - An atomic increment
   - Thread-local counters followed by aggregation

### Classic-problem questions

10. Design a bounded Producer–Consumer buffer using semaphores. What does each semaphore represent?
11. In the Reader–Writer problem, how can reader preference starve writers?
12. How would a fair Reader–Writer lock prevent starvation?
13. Why does the Dining Philosophers problem represent real systems such as database transactions or resource managers?
14. Does Peterson’s Algorithm remain sufficient for arbitrary numbers of threads and modern multicore hardware? Explain its practical limitations.

### Security question

15. How could a race condition become a security vulnerability rather than merely a correctness bug? Consider a check-then-use operation involving file permissions.

### Connection question

16. How can a synchronization mechanism that prevents races accidentally introduce deadlock?

---

## Chapter 5 — Deadlocks

### Conceptual questions

1. Explain the four Coffman conditions using the Dining Philosophers problem:
   - Mutual exclusion
   - Hold and wait
   - No preemption
   - Circular wait
2. Why must all four conditions exist simultaneously for deadlock to occur?
3. What is the difference between deadlock, starvation, and livelock?
4. Why does a cycle in a resource-allocation graph indicate deadlock only under certain resource assumptions?
5. Compare prevention, avoidance, detection and recovery, and ignoring deadlocks.

### Scenario questions

6. Thread A locks `accounts` and then `transactions`. Thread B locks `transactions` and then `accounts`. Construct the exact execution sequence that causes deadlock.
7. Fix the preceding deadlock using a global lock-ordering rule.
8. A process holds a printer and waits for a scanner. Another holds the scanner and waits for the printer. Which Coffman condition would resource preemption break?
9. Why are timeouts useful but not a complete proof of deadlock freedom?
10. How can “try lock and retry” avoid deadlock but produce livelock?

### Banker's Algorithm questions

11. What does it mean for a system to be in a safe state?
12. Is every unsafe state already deadlocked? Explain the distinction.
13. Given each process’s maximum demand, current allocation, and available resources, determine whether a safe execution sequence exists.
14. Why is the Banker's Algorithm difficult to use in general-purpose operating systems?
15. Where might avoidance techniques still be practical because resource needs are predictable?

### Recovery and security questions

16. If a deadlock is detected, how should the OS choose a victim process to terminate or roll back?
17. Could a malicious program deliberately create resource deadlocks as a denial-of-service attack? What limits could mitigate it?

### Connection question

18. How could a deadlock involving file-system locks prevent unrelated processes from opening files?

---

## Chapter 6 — Inter-Process Communication

### Conceptual questions

1. Why can threads communicate through shared process memory while separate processes normally cannot?
2. Compare anonymous pipes and named pipes.
3. When is a message queue preferable to shared memory?
4. Why is shared memory usually fast after setup?
5. Why does shared memory still require synchronization?
6. How do sockets allow the same communication model to work locally and across a network?
7. What additional failure modes appear when moving from local IPC to network IPC?
8. Why can RPC never make a remote call behave exactly like a local function call?

### Design scenarios

9. Choose an IPC mechanism for each case and justify it:
   - A shell connecting `cat file.txt | grep error`
   - A parent receiving a result from a short-lived child
   - A high-throughput video-processing pipeline
   - Two unrelated local applications exchanging notifications
   - A mobile application communicating with a cloud service
10. Design IPC between a browser process and a sandboxed rendering process. How would you prevent the renderer from requesting unauthorized operations?
11. A process writes messages faster than another can consume them. Where should backpressure be implemented?
12. If an RPC request times out, can the client safely assume the server did not execute it? How could request IDs and idempotency help?
13. How should messages be versioned so older and newer processes can communicate during a rolling upgrade?
14. What validation must a receiving process perform before trusting an IPC message?

### Connection question

15. If two processes share a memory segment, which Chapter 4 and Chapter 5 problems immediately become relevant again?

---

## Chapter 7 — Memory Management and Virtual Memory

### Conceptual questions

1. Why should each process believe it has its own private address space?
2. Distinguish logical/virtual addresses from physical addresses.
3. What role does the MMU play during every memory access?
4. Compare internal and external fragmentation.
5. Why does paging eliminate external fragmentation but not internal fragmentation?
6. How does segmentation reflect a program’s logical structure?
7. Why do modern systems often combine ideas from segmentation and paging?

### Allocation exercise

Free memory holes are:

```text
100 KB, 500 KB, 200 KB, 300 KB, 600 KB
```

Processes request:

```text
212 KB, 417 KB, 112 KB, 426 KB
```

8. Allocate the processes using First Fit, Best Fit, and Worst Fit.
9. Which algorithm leaves the most useful remaining holes?
10. Can enough total free memory exist while an allocation still fails? Explain.

### Paging and virtual-memory questions

11. Given a page size and virtual address, calculate the page number and offset.
12. Use a page table to translate a virtual address into a physical address.
13. What happens step by step when the CPU references a page that is not in RAM?
14. Why is a Translation Lookaside Buffer important for performance?
15. How do page-table permissions prevent one process from modifying another process’s memory?
16. Why should executable pages normally not also be writable?

### Page-replacement exercise

For the reference string:

```text
7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2
```

using three page frames:

17. Count page faults under FIFO, LRU, and Optimal replacement.
18. Why is Optimal useful for comparison but generally impossible to implement exactly?
19. Can increasing the number of frames increase FIFO page faults? Investigate Belady’s anomaly.
20. What is thrashing, and how can the OS detect and reduce it?

### Security question

21. How do address-space randomization, non-executable memory, and guard pages build on basic memory protection?

### Connection question

22. A page fault requires reading data from storage. Which scheduler, disk, and I/O mechanisms become involved before the process can continue?

---

## Chapter 8 — File Systems

### Conceptual questions

1. What information is normally stored in file metadata rather than file contents?
2. Why does deleting a filename not necessarily erase the underlying data immediately?
3. Compare contiguous, linked, and indexed file allocation.
4. How is indexed file allocation conceptually similar to paging?
5. What is the purpose of free-space bitmaps?
6. Why do file systems use caching even though it can complicate crash recovery?
7. What is journaling, and what does it guarantee after a crash?
8. Does journaling always guarantee that the latest file data is preserved? Distinguish metadata and data journaling.

### Scenario questions

9. Choose an allocation strategy for:
   - A large immutable movie file
   - A file that grows unpredictably
   - A database requiring efficient random access
10. Nova loses power halfway through renaming a file. How could journaling keep the file system structurally consistent?
11. A user can write to a file but cannot access its parent directory. What operations should succeed or fail?
12. Design permissions for a payroll file so employees can read only their own records while payroll administrators can update all records.
13. How do hard links and symbolic links differ when the original filename is deleted?
14. What should happen if a symbolic link points outside an application’s permitted directory?
15. How can an attacker use paths such as `../../secret.txt`, and how should software prevent this traversal?

### Design questions

16. Design a directory structure for a multi-user university computer that separates personal, shared, temporary, and administrative data.
17. How should a file system handle filenames from many languages while avoiding Unicode-related security confusion?
18. What trade-offs would you consider when choosing a larger disk block size?

### Connection question

19. When a process calls `open()`, identify the roles of system calls, permissions, directories, memory caching, disk scheduling, and device drivers.

---

## Chapter 9 — Disk Scheduling

> These algorithms are most directly relevant to devices with mechanical seek costs. SSDs have different performance characteristics.

### Conceptual questions

1. Why does request ordering matter more for a mechanical hard disk than for an SSD?
2. What are seek time, rotational latency, and transfer time?
3. Why can SSTF provide good average seek time but poor fairness?
4. How do SCAN and C-SCAN differ in their treatment of requests?
5. Why do LOOK and C-LOOK avoid unnecessary movement?

### Scheduling exercise

The disk head starts at cylinder `53`. The pending requests are:

```text
98, 183, 37, 122, 14, 124, 65, 67
```

Assume cylinders range from `0` to `199`.

6. Determine the service order and total head movement for:
   - FCFS
   - SSTF
   - SCAN
   - C-SCAN
   - LOOK
   - C-LOOK
7. For directional algorithms, repeat the calculation for both initial directions.
8. Which algorithm minimizes movement for this workload?
9. Could that algorithm starve any request under a continuous workload?
10. Which algorithm gives the most predictable waiting time?

### Modern-system questions

11. Why might traditional seek-based scheduling be ineffective or unnecessary for NVMe SSDs?
12. What factors still justify I/O scheduling on SSDs—such as priorities, latency targets, batching, or fairness?
13. How could a process generate so many disk requests that other users experience starvation? What limits could the OS apply?

### Connection question

14. If the disk scheduler chooses a request, how does DMA transfer its data into memory, and how is the waiting process notified?

---

## Chapter 10 — I/O Management

### Conceptual questions

1. Compare programmed I/O, interrupt-driven I/O, and DMA.
2. Why is polling sometimes wasteful but still useful in certain low-latency or simple embedded systems?
3. What happens from the moment a device raises an interrupt until a waiting process resumes?
4. Why should interrupt handlers perform as little work as possible?
5. What is the difference between buffering, caching, and spooling?
6. Why is printer spooling useful even though printing itself is sequential?
7. How does DMA reduce CPU work during large transfers?
8. If DMA accesses RAM independently, how do the CPU, OS, and device coordinate ownership and completion?

### Scenario questions

9. Select the most appropriate I/O technique for:
   - Reading a keyboard key
   - Transferring a large video file
   - Monitoring a simple embedded sensor
   - Sending thousands of queued print jobs
10. A faulty device generates millions of interrupts per second. What effect might this have on scheduling and system responsiveness?
11. How could interrupt coalescing improve performance, and what latency trade-off does it introduce?
12. Why can buffering improve throughput while increasing latency?
13. A process requests asynchronous file I/O and continues computing. How should completion be communicated?
14. What should the OS do if a device never responds?
15. Why must device drivers be treated as security-sensitive code?

### Connection question

16. Trace one disk read across the file system, I/O scheduler, driver, controller, DMA engine, interrupt handler, and process scheduler.

---

## Chapter 11 — Security and Protection

### Conceptual questions

1. Explain the difference between authentication, authorization, accounting, protection, and security.
2. Why should authorization be checked every time a protected resource is accessed?
3. What is the difference between an Access Control List and a capability-based system?
4. How does least privilege limit the damage caused by compromised software?
5. Why is deny-by-default safer than allow-by-default?
6. How do user mode, virtual memory, file permissions, and system calls work together as defense in depth?
7. Why does encryption not replace access control?
8. What can a firewall protect, and what attacks can it not prevent?

### Threat-model questions

9. A malicious application requests access to the camera, microphone, files, and network. Which permissions are actually necessary for a calculator application?
10. A web server is compromised. How do a non-root account, process sandbox, read-only file system, and network restrictions reduce the impact?
11. A process sends malformed input to a device driver. What validation should occur before the driver uses that input?
12. How could an attacker exploit:
   - A race condition
   - Excessive permissions
   - A writable executable page
   - An unvalidated IPC message
   - A path-traversal bug
13. Why should passwords be hashed with a modern password-hashing algorithm rather than encrypted or stored with a fast general-purpose hash?
14. Why should session identifiers be regenerated after login?
15. Why should session cookies use `HttpOnly`, `Secure`, and an appropriate `SameSite` policy?
16. How can rate limiting and account lockout reduce brute-force attacks, and how might overly aggressive lockout create denial-of-service risks?
17. Why must secrets be stored outside source code?
18. What information should security logs include, and what sensitive information must they avoid recording?

### Security design challenge

19. Design a least-privilege permission model for a backup service that must:
   - Read selected directories
   - Write encrypted backups
   - Access the network only to one approved destination
   - Never modify source files
   - Never read unrelated users’ data
20. If the backup destination URL is user-supplied, how would you strictly validate its scheme, host, port, redirects, and path to prevent server-side request forgery?
21. How would you update and recover the service without granting it unrestricted administrator access?

### Final connection question

22. Which earlier OS mechanisms are security boundaries, and which are primarily performance mechanisms that can still affect security?

---

# Cross-Chapter “Detective” Challenges

## 1. The Slow Music Mystery

Nova’s music stutters whenever a large file is copied.

Investigate possible causes involving:

- CPU scheduling
- Page faults
- Memory pressure
- Disk scheduling
- I/O buffering
- Interrupt load

Which measurements would help determine the real cause?

---

## 2. The Frozen Banking Server

A banking server stops processing requests, but CPU usage is almost zero.

Construct competing hypotheses involving:

- Deadlock
- Blocking I/O
- Thread-pool exhaustion
- IPC failure
- Memory thrashing
- Database lock contention

How would you distinguish among them without immediately restarting the server?

---

## 3. The Vanishing File

A user saves a document, sees a success message, and then loses the file after a power failure.

Explain possible failures involving:

- User-space buffering
- Kernel page cache
- File-system journaling
- Storage-device caches
- Missing durability or flush guarantees

What should “Save completed” actually guarantee?

---

## 4. The Suspicious Page Fault

A process repeatedly faults on pages it accessed moments earlier.

Could this indicate:

- Too few allocated frames
- Poor locality
- An unsuitable replacement algorithm
- Memory pressure from other processes
- A memory leak
- Malicious resource exhaustion

How would you investigate?

---

## 5. The Secure Browser Design

Design a browser using:

- Separate processes for tabs
- Sandboxed renderers
- Restricted IPC
- Shared memory for performance
- Synchronization for shared buffers
- Least-privilege file and network access

What should happen if one renderer becomes malicious?

---

## 6. The Complete Journey of One Click

A user clicks **Open File** in an application. Trace the event through:

1. Hardware input
2. Device interrupt
3. Driver
4. Scheduler
5. Application thread
6. System call
7. Permission check
8. File-system lookup
9. Page cache
10. Disk scheduling
11. DMA
12. Completion interrupt
13. Virtual-memory mapping
14. Application display

At each stage, identify one possible performance problem and one possible security check.

---

# Final Capstone: Design Your Own Operating System

You are designing **NovaOS** for one of these environments:

- A personal desktop
- A cloud server
- A medical device
- A gaming console
- An autonomous vehicle
- A low-power IoT sensor

Answer the following:

1. Which kernel architecture would you use, and why?
2. How would the system boot securely?
3. Which CPU scheduling policy would match the workload?
4. Would applications primarily use processes, threads, async I/O, or a combination?
5. Which synchronization primitives would you provide?
6. How would you prevent and detect deadlocks?
7. Which IPC mechanisms would be available?
8. How would virtual memory be organized?
9. Which file-system properties are essential?
10. How would storage and general I/O requests be scheduled?
11. Which operations would require explicit permissions?
12. How would you isolate faulty or malicious applications?
13. How would you update the OS safely and recover from a failed update?
14. Which metrics and security events would you monitor?
15. What trade-offs did you choose between performance, reliability, usability, and security?

A strong final answer should show that an operating system is not a collection of isolated algorithms—it is a connected system in which **every solution introduces new trade-offs and responsibilities**.