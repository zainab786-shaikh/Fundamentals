# Computer Organization

Here's the logical hierarchy for **Computer Organization**, structured so each layer builds a "problem → solution → trade-offs → next problem" narrative:

**1. Data Representation (Foundation)**

- Number Systems

  - Binary, Octal, Hexadecimal

  - Conversions

- Representing Negative Numbers

  - Sign-magnitude

  - 1's complement

  - 2's complement

- Representing Fractions

  - Fixed-point representation

  - Floating-point representation (IEEE 754)

- Character Representation

  - ASCII, Unicode

**2. Basic CPU Building Blocks**

- Boolean Logic & Digital Circuits (brief refresher)

- Arithmetic Logic Unit (ALU)

  - Adders (half, full, ripple-carry, carry-lookahead)

  - Subtractors, Multipliers, Dividers

- Registers & Register File

  - General purpose vs special purpose registers

  - Program Counter, Instruction Register, MAR/MBR

**3. Instruction Execution Mechanics**

- Instruction Cycle

  - Fetch, Decode, Execute, Store

- Control Unit Design

  - Hardwired control

  - Microprogrammed control

- Addressing & Instruction Formats (organization-level view)

**4. Performance Enhancement — Pipelining**

- Why Pipelining (problem: sequential execution is slow)

- Basic Pipeline Stages (IF, ID, EX, MEM, WB)

- Pipeline Hazards

  - Structural hazards

  - Data hazards (forwarding/bypassing)

  - Control hazards (branch prediction, branch delay slots)

- Superscalar & Out-of-Order Execution

- Speculative Execution

**5. Memory Organization (Solving the Speed-Cost-Size Trade-off)**

- Memory Hierarchy Concept

  - Registers → Cache → RAM → Secondary Storage

- Cache Memory

  - Why cache (problem: CPU-memory speed gap)

  - Mapping techniques

    - Direct-mapped

    - Fully associative

    - Set-associative

  - Replacement policies (LRU, FIFO, Random)

  - Write policies (write-through, write-back)

  - Multi-level caches (L1, L2, L3)

  - Cache coherence (in multicore context)

- Main Memory

  - RAM types (SRAM, DRAM)

  - Memory interleaving

- Virtual Memory

  - Why virtual memory (problem: limited physical memory, multiprogramming)

  - Paging

  - Segmentation

  - Page replacement algorithms (FIFO, LRU, Optimal)

  - TLB (Translation Lookaside Buffer)

**6. Input/Output Organization**

- I/O Problem (speed mismatch between CPU and I/O devices)

- Programmed I/O

- Interrupt-Driven I/O

- Direct Memory Access (DMA)

- I/O Buses & Interfaces

**7. Bus & Interconnect Organization**

- System Bus Structure (data, address, control bus)

- Bus Arbitration

- Synchronous vs Asynchronous bus

**8. Parallelism at the Organization Level**

- Multiprocessing

  - Shared memory vs distributed memory

- Multicore Architecture

- Flynn's Taxonomy (SISD, SIMD, MISD, MIMD)

- Cache Coherence Protocols (MESI etc.)

---

# Topic 1: Data Representation

## 1.1 Number Systems — The Starting Problem

**Problem:** Computers use transistors that are either ON or OFF — only two states. How do we represent numbers, text, and everything else using just two symbols?

**Solution:** Binary number system (base-2), using only 0 and 1.

```text
Decimal 13 = Binary 1101 (1×8 + 1×4 + 0×2 + 1×1)
```

**Limitation:** Binary numbers get very long and hard for humans to read/write (e.g., a byte 11010110 is unwieldy).

**Built-on Solution:** Octal (base-8) and Hexadecimal (base-16) — group binary digits (3 bits → 1 octal digit, 4 bits → 1 hex digit) for compact human-readable representation, while machine still uses binary internally.

```text
Binary: 1101 0110 → Hex: D6
```

---

## 1.2 Representing Negative Numbers — Next Problem

**Problem:** Binary as shown above only represents positive (unsigned) numbers. How do we represent negative numbers using only 0s and 1s?

### Solution 1: Sign-Magnitude

- Reserve the leftmost (most significant) bit as a sign indicator: 0 = positive, 1 = negative. Remaining bits store the magnitude.

```text
+5 = 0101

-5 = 1101
```

### Limitations of Sign-Magnitude:

1.  Two representations of zero (0000 = +0, 1000 = -0) — wastes a value and causes ambiguity.

2.  Arithmetic circuits become complex — addition/subtraction need separate logic depending on signs.

### Solution 2: 1's Complement

- Negative number = flip all bits of the positive number.

```text
+5 = 0101

-5 = 1010 (flip all bits)
```

### Limitations of 1's Complement:

1.  Still has two representations of zero (0000 and 1111).

2.  Addition requires an extra step called "end-around carry" (adding overflow bit back), adding hardware complexity.

### Solution 3: 2's Complement

(the actual solution used in nearly all modern computers)

- Negative number = flip all bits of positive number, then add 1.

```text
+5 = 0101

-5 = 1010 + 1 = 1011
```

**Why this solves prior problems:**

- Only **one representation of zero** (0000).

- Addition and subtraction use the **same hardware circuit** — subtraction becomes "add the 2's complement," eliminating the need for a separate subtractor circuit.

- This is why virtually every CPU today uses 2's complement — it directly simplifies ALU design (a preview of Topic 2).

**Remaining Consideration:** 2's complement has an asymmetric range — for n bits, range is -2^(n-1) to +2^(n-1)-1 (one more negative number than positive). This is an accepted trade-off since it eliminates dual-zero and simplifies arithmetic.

---

## 1.3 Representing Fractions — Next Problem

**Problem:** Integers alone can't represent real-world quantities like 3.14 or very large/small numbers like 6.022 × 10²³. How do we represent fractional and very large/small values in binary?

### Solution 1: Fixed-Point Representation

- Decide in advance how many bits represent the integer part and how many represent the fractional part (an implicit binary point).

```text
8-bit fixed point (4 integer, 4 fraction): 0011.1010 = 3.625
```

### Limitations of Fixed-Point:

1.  **Limited range** — since integer bits are fixed, you can't represent very large numbers.

2.  **Limited precision** — fixed fractional bits mean you can't represent very small numbers precisely.

3.  No flexibility — scientific calculations (astronomy, physics) need both huge and tiny numbers, which fixed-point cannot handle well.

### Solution 2: Floating-Point Representation (IEEE 754 standard)

- Mimic scientific notation: Number = Sign × Mantissa × 2^Exponent

- Divide bits into three fields: **Sign**, **Exponent**, **Mantissa (fraction)**.

```text
32-bit (single precision): 1 sign bit + 8 exponent bits + 23 mantissa bits
```

**Why this solves the prior problem:**

- The exponent allows representing a **huge dynamic range** (very large and very small numbers) by "floating" the decimal point.

- The mantissa provides relative precision proportional to magnitude.

**New Limitations Introduced (sets up future learning):**

1.  **Precision loss / rounding errors** — not all decimal fractions can be represented exactly (e.g., 0.1 in binary floating point is a repeating fraction, causing rounding errors).

2.  **Comparison issues** — due to rounding, 0.1 + 0.2 == 0.3 may be false in floating-point arithmetic.

3.  Special cases needed: representations for +Infinity, -Infinity, NaN (Not a Number), and denormalized numbers — adding complexity to hardware (FPU - Floating Point Unit).

This is why modern CPUs have a **dedicated Floating Point Unit (FPU)** separate from the integer ALU — a preview of Topic 2 (CPU Building Blocks), where we'll see how the ALU is designed to handle these representations efficiently, starting with the adder circuits needed for 2's complement arithmetic.

---

## 1.4 Character Representation — Parallel Problem

**Problem:** Numbers alone aren't enough — how does a computer represent text (letters, punctuation)?

### Solution 1: ASCII

— assign each character a 7-bit (later 8-bit) numeric code (e.g., A = 65, a = 97).

**Limitation:** Only 128–256 characters — cannot represent non-English scripts (Chinese, Arabic, emojis, etc.), which are essential in a globalized/internationalized software world.

### Solution 2: Unicode

(UTF-8, UTF-16, UTF-32) — variable or fixed-width encoding supporting over a million code points, covering virtually all world scripts and symbols, while UTF-8 remains backward-compatible with ASCII for the first 128 characters.

---

**Summary of the intuitive chain in Topic 1:**

```text
Binary (base problem: 2-state hardware)

→ Octal/Hex (readability fix)

Sign-Magnitude (negative number problem)

→ 1's Complement (partial fix)

→ 2's Complement (real fix, enables shared add/subtract hardware)

Fixed-Point (fraction problem)

→ Floating-Point IEEE 754 (range/precision fix, introduces new rounding-error problem)

ASCII (text problem)

→ Unicode (internationalization fix)
```

---

# Topic 2: Basic CPU Building Blocks

## 2.1 Boolean Logic & Digital Circuits — The Foundation

**Problem:** We've decided *how* to represent data (Topic 1), but we need physical hardware that can actually manipulate these bits — perform decisions and computations.

**Solution:** Boolean logic gates — AND, OR, NOT, XOR, NAND, NOR — built from transistors, combined into circuits that implement logical/arithmetic functions.

**Limitation:** Individual gates are too primitive — building a full arithmetic system gate-by-gate for every operation is impractical. We need standardized, reusable building blocks.

**Built-on Solution:** Combine gates into standard functional units — **adders**, **multiplexers**, **decoders** — which become the components of the ALU.

---

## 2.2 Arithmetic Logic Unit (ALU)

**Problem:** How do we actually add two binary numbers in hardware?

### Solution 1: Half Adder

- Takes 2 single bits, produces Sum (XOR) and Carry (AND).

**Limitation:** A half adder can't handle a carry-in from a previous bit position — so it only works for adding the least significant bit. Multi-bit addition needs to propagate carries.

### Solution 2: Full Adder

- Takes 2 bits + carry-in, produces Sum and Carry-out. Chaining full adders lets us add multi-bit numbers.

**Built-on Solution: Ripple-Carry Adder**

- Chain n full adders together (carry-out of one feeds carry-in of next) to add n-bit numbers.

**Limitation of Ripple-Carry Adder:** Each bit must wait for the carry from the previous bit — the carry "ripples" through all n stages sequentially. For large numbers (32-bit, 64-bit), this creates significant **propagation delay**, slowing down every arithmetic operation (a real performance bottleneck).

**Solution: Carry-Lookahead Adder (CLA)**

- Precomputes carries in parallel using additional logic (generate/propagate signals) instead of waiting for ripple propagation.

**Trade-off introduced:** CLA is much faster but requires significantly more hardware (gates), increasing chip area, power consumption, and design complexity. This is the classic **speed vs. hardware-cost trade-off** you'll see repeatedly in CO.

---

## 2.3 Building Subtraction, Multiplication, Division on Top of the Adder

**Problem:** Do we need a completely separate circuit for subtraction?

**Solution:** Recall Topic 1.2 — 2's complement representation means A - B = A + (2's complement of B). So subtraction reuses the **same adder circuit**, just with an inverter (for flipping bits) and feeding an initial carry-in of 1 (for the "+1" step).

**Why this matters:** This is a direct payoff of choosing 2's complement in Topic 1 — one circuit does both jobs, reducing hardware duplication.

**Problem (Multiplication):** Multiplication is repeated addition — how do we do it efficiently in hardware?

### Solution 1: Shift-and-Add Algorithm

— mimics manual long multiplication: shift and conditionally add based on each bit of the multiplier.

**Limitation:** Sequential, one bit at a time — slow for large numbers (e.g., 32 cycles for 32-bit multiply).

**Built-on Solution: Booth's Algorithm** — reduces the number of add/subtract operations by recognizing patterns of consecutive 1s/0s in the multiplier, and array multipliers use parallel hardware to compute all partial products simultaneously, trading hardware complexity for speed.

**Division:** Similarly built on repeated subtraction (restoring/non-restoring division algorithms) — same speed-vs-complexity trade-off pattern.

---

## 2.4 Registers & Register File

**Problem:** The ALU can compute a result, but where do operands come from and where does the result go? Reading from main memory for every single operation is possible — but is it efficient?

**Solution (leads to Registers):** Provide a small set of extremely fast, on-chip storage locations — **registers** — directly wired to the ALU, so operands don't need to be fetched from slow memory each time.

**Limitation:** Registers are limited in number (due to chip area/cost) — so we need special-purpose registers to manage control flow and bookkeeping, not just data.

**Built-on Solution — Special-Purpose Registers:**

- **Program Counter (PC):** tracks address of next instruction — solves "how does CPU know what to execute next?"

- **Instruction Register (IR):** holds current instruction being decoded — solves "where is the instruction stored during decode?"

- **Memory Address Register (MAR) / Memory Buffer Register (MBR/MDR):** stage data between CPU and memory bus — solves "how does CPU interface with slower external memory?"

**New Problem this Introduces:** Even with registers, the CPU still occasionally needs main memory — and memory is dramatically slower than registers. This speed gap is exactly the problem that motivates the **Memory Hierarchy / Cache** (Topic 5) later.

---

**Summary of Intuitive Chain in Topic 2**

```text
Boolean Gates (primitive logic)

→ Standardized functional blocks (adders, MUX)

Half Adder (no carry-in)

→ Full Adder (handles carry-in)

→ Ripple-Carry Adder (multi-bit, but slow — sequential carry propagation)

→ Carry-Lookahead Adder (fast, but more hardware — speed/cost trade-off)

Adder reused for Subtraction (via 2's complement from Topic 1)

Shift-and-Add Multiplication (slow, sequential)

→ Booth's Algorithm / Array Multipliers (faster, more hardware)

Direct memory access per operation (slow)

→ Registers (fast local storage)

→ Special-purpose registers (PC, IR, MAR/MBR) for control flow & memory interface

→ introduces new problem: CPU-memory speed gap (→ motivates Cache, Topic 5)
```

---

# Topic 3: Instruction Execution Mechanics

## 3.1 The Instruction Cycle — Core Problem

**Problem:** We now have an ALU (Topic 2) that can compute, and registers to hold data. But a program is a *sequence* of instructions stored in memory. How does the CPU know what to do, step by step, to execute a whole program automatically without human intervention?

**Solution: The Fetch-Decode-Execute Cycle**

1.  **Fetch** — Use the Program Counter (PC) to get the address of the next instruction, retrieve it from memory into the Instruction Register (IR), and increment PC.

2.  **Decode** — Interpret the bits in IR to determine what operation is required and which operands/registers are involved.

3.  **Execute** — Send appropriate signals to ALU/registers/memory to perform the operation.

4.  **Store (Write-back)** — Save the result back to a register or memory.

This cycle repeats continuously — the fundamental "heartbeat" of every CPU.

**Limitation:** This describes *what* happens conceptually, but doesn't explain *how* the CPU actually generates the correct electrical control signals (e.g., "open this gate," "enable this register," "select ALU add operation") at the right time, for every possible instruction. We need a mechanism to generate these signals — this is the **Control Unit's** job.

---

## 3.2 Control Unit Design

**Problem:** How do we build a circuit that, given a decoded instruction, produces the exact sequence of control signals needed to drive registers, ALU, and memory correctly for *every* instruction in the CPU's instruction set?

### Solution 1: Hardwired Control

- Build control logic directly as fixed digital circuits (combinational + sequential logic, e.g., using state machines) — each instruction pattern is "wired" to trigger specific control signals.

**Pros:**

- Very fast (pure hardware, no extra lookup/interpretation step).

### Limitations of Hardwired Control:

1.  **Rigid and complex to design** — every new instruction requires redesigning physical circuits.

2.  **Difficult to modify or debug** — adding a new instruction to an existing CPU design means re-engineering wiring, which is costly and error-prone.

3.  **Doesn't scale well** — as instruction sets grow more complex (many addressing modes, many operations), the control logic becomes extremely intricate.

### Solution 2: Microprogrammed Control

- Instead of hardwiring logic, store control signals as **microinstructions** in a small, fast internal memory called the **control store**. Each machine instruction maps to a sequence of microinstructions that are "read out" and executed, similar to a mini-program that generates the control signals.

**Why this solves the problem:**

- **Flexibility:** To add/modify an instruction, you just change the microcode (firmware) — no hardware redesign needed.

- **Easier to design and debug** — treats control logic design like software design.

**New Limitation Introduced:**

- Microprogrammed control is inherently **slower** than hardwired control because it adds an extra layer of indirection (reading microinstructions from control store takes time).

- This trade-off directly mirrors CISC vs RISC philosophy: CISC CPUs (e.g., older x86) historically favored microprogrammed control (rich, complex instructions), while RISC CPUs favored hardwired control (simpler instructions, executed fast) — a preview of the architecture-level ISA discussion.

**Modern Resolution:** Most modern CPUs use a **hybrid approach** — hardwired control for simple, frequent instructions (speed-critical path) and microprogrammed control for rare, complex instructions — balancing speed and flexibility.

---

## 3.3 Instruction Formats (Organization-Level View)

**Problem:** The control unit needs to decode instructions — but how is an instruction physically laid out in bits so decoding is efficient and unambiguous?

**Solution:** Divide instruction into fixed fields:

```text
\[ Opcode \| Operand(s)/Addressing info \]

- **Opcode field** — tells control unit *what* operation to perform (maps directly to which microinstruction sequence or hardwired path to trigger).

- **Operand field(s)** — tell *where* the data is (register, memory address, immediate value).
```

**Limitation:**

- **Fixed-length formats** are simple to decode (single-cycle decode) but waste bits when an instruction doesn't need many operands, and limit how much address space or immediate value you can encode.

- **Variable-length formats** save space and allow richer instructions but make decoding harder — the control unit doesn't know instruction length until partially decoded, which slows/complicates the fetch-decode pipeline stage.

**This directly sets up the next problem:** Once fetch-decode-execute works correctly, the obvious next question is: *can we make this faster by overlapping stages instead of doing them one at a time?* That's exactly the motivation for **Pipelining (Topic 4)** — instead of finishing Fetch-Decode-Execute-Store for one instruction before starting the next, overlap the stages across multiple instructions like an assembly line.

---

**Summary of Intuitive Chain in Topic 3**

```text
Problem: automatic sequential execution of a program

→ Solution: Fetch-Decode-Execute Cycle (using PC, IR from Topic 2)

Problem: how to generate correct control signals per instruction

→ Hardwired Control (fast, but rigid/hard to modify)

→ Microprogrammed Control (flexible/easy to modify, but slower — extra indirection)

→ Hybrid approach in modern CPUs (balance speed + flexibility)

Problem: how to encode instructions for decoding

→ Fixed-length format (simple/fast decode, wastes bits)

→ Variable-length format (space-efficient, harder/slower decode)

→ New Problem: instructions execute one-at-a-time, stage-by-stage — CPU sits idle much of the time

→ Motivates Pipelining (Topic 4): overlap stages across instructions for throughput
```

---

# Topic 4: Pipelining

## 4.1 The Core Problem — Sequential Execution is Slow

**Problem:** In the basic Fetch-Decode-Execute cycle (Topic 3), each instruction fully completes all stages before the next instruction even starts fetching. While Instruction 1 is in its Execute stage, the Fetch, Decode, and other hardware units sit **completely idle**. This wastes hardware resources and limits throughput — only one instruction is "in flight" at any time.

**Solution: Pipelining**

- Break instruction execution into discrete stages (classic 5-stage RISC pipeline):

```text
IF (Instruction Fetch) → ID (Instruction Decode) → EX (Execute) → MEM (Memory Access) → WB (Write Back)

- Overlap stages across multiple instructions — like an assembly line. While Instruction 1 is in EX, Instruction 2 can be in ID, and Instruction 3 can be in IF — all simultaneously, using separate hardware units for each stage.
```

**Benefit:** Ideally, throughput improves close to N times (for N stages) — a new instruction can complete roughly every clock cycle instead of every 5 cycles.

**Limitation this Introduces:** Because instructions now overlap and execute concurrently, they can **interfere with each other** — these interferences are called **hazards**, and they are the central challenge of pipeline design.

---

## 4.2 Structural Hazards

**Problem:** Two instructions in different pipeline stages simultaneously need the **same hardware resource** (e.g., both need to access memory at the same time — one for instruction fetch, another for a data load in the MEM stage).

**Solution 1 (Naive):** Stall one instruction until the resource is free.

**Limitation:** Stalling defeats the purpose of pipelining — throughput drops.

**Built-on Solution:** Duplicate critical hardware resources — e.g., use **separate instruction memory and data memory** (Harvard-style split caches, previewed later in Topic 5) so IF and MEM stages never compete for the same physical memory port.

---

## 4.3 Data Hazards

**Problem:** An instruction needs a value that a *previous* instruction hasn't finished computing/writing back yet.

```text
I1: ADD R1, R2, R3 ; R1 = R2 + R3

I2: SUB R4, R1, R5 ; needs R1 -- but I1 hasn't written R1 back yet!

Because I2 enters ID/EX while I1 is still in EX/MEM/WB, I2 could read a stale value of R1.
```

**Solution 1 (Naive): Stalling**

- Insert "bubble" cycles until I1 completes WB before I2 reads R1.

**Limitation:** Reduces pipeline efficiency — every dependent instruction pair costs multiple stall cycles, eroding the performance gain pipelining was supposed to deliver.

**Built-on Solution: Forwarding / Bypassing**

- Add extra hardware paths that route the ALU result directly from the EX or MEM stage output **back** into the EX stage input of a later instruction, without waiting for the formal Write-Back to the register file.

**Why this helps:** Eliminates most stalls caused by data dependencies since the value is "forwarded" as soon as it's computed, not after it's officially written back.

**Remaining Limitation:** Forwarding **cannot solve every case** — specifically, a **Load-Use Hazard**: if an instruction loads a value from memory (MEM stage) and the very next instruction needs it immediately in EX, the data simply isn't available yet even with forwarding (MEM happens after EX).

**Further Solution:** A mandatory one-cycle stall specifically for load-use hazards, combined with **compiler instruction scheduling** — reordering independent instructions to fill the gap instead of idly stalling.

---

## 4.4 Control Hazards

**Problem:** Branch instructions (if, jump, loop) aren't resolved (we don't know the target address or whether the branch is taken) until partway through the pipeline (often EX or later). But the pipeline has *already fetched* the next sequential instructions by then — if the branch is taken, those fetched instructions are **wrong** and must be discarded.

**Solution 1 (Naive): Stall/Flush**

- Freeze fetching until the branch outcome is known, then resume.

**Limitation:** Branches are frequent (roughly every 5th instruction in typical code) — stalling on every branch severely hurts performance.

### Solution 2: Branch Delay Slot

- Always execute the instruction immediately after the branch regardless of outcome (compiler guarantees this slot has a useful, safe instruction) — hides one cycle of stall.

**Limitation:** Only hides a single cycle; deeper pipelines need the branch resolved much earlier, and it complicates the compiler/ISA design — this technique fell out of favor in deep pipelines.

**Built-on Solution: Branch Prediction**

- Predict whether a branch will be taken (static prediction, or dynamic prediction using history tables like a Branch History Table / 2-bit saturating counters) **before** it's resolved, and speculatively fetch/execute along the predicted path.

**New Problem Introduced:** What if the prediction is **wrong**?

**Solution: Speculative Execution + Pipeline Flush/Recovery**

- Continue executing speculatively; if the prediction is confirmed correct, proceed normally (no penalty). If wrong, **flush** the incorrectly fetched instructions from the pipeline and restart fetch from the correct address — incurring a "misprediction penalty" (several lost cycles), but this is far better than stalling on *every* branch.

---

## 4.5 Superscalar & Out-of-Order Execution (Building Further)

**Problem:** Even with hazards resolved, a basic pipeline still only issues **one instruction per cycle**. Can we do better?

**Solution: Superscalar Execution**

- Duplicate execution units (multiple ALUs, multiple pipelines) so multiple instructions can be **issued and executed in the same cycle**, provided they don't have dependencies/resource conflicts.

**Limitation:** Instructions in a program are strictly ordered, but not all are ready to execute at the same time (some wait on data), while later independent instructions could execute sooner — strict in-order issue wastes opportunity.

**Built-on Solution: Out-of-Order Execution**

- Use a hardware scheduling window (reservation stations, reorder buffer) to execute instructions **as soon as their operands are ready**, regardless of original program order, then **retire/commit results in original order** to preserve correct program semantics.

**Trade-off:** Massively improves performance but adds significant hardware complexity (register renaming to avoid false dependencies, reorder buffers, larger die area, higher power consumption).

---

**Summary of Intuitive Chain in Topic 4**

```text
Problem: sequential execution wastes hardware, low throughput

→ Solution: Pipelining (overlap IF-ID-EX-MEM-WB across instructions)

New Problem: hardware resource conflicts (Structural Hazards)

→ Solution: Duplicate resources (separate I-cache/D-cache)

New Problem: instructions depend on not-yet-ready results (Data Hazards)

→ Naive Stalling (correct but slow)

→ Forwarding/Bypassing (fast, but fails for load-use case)

→ Load-use stall + compiler scheduling (final refinement)

New Problem: branches invalidate fetched instructions (Control Hazards)

→ Naive Stall (too slow, branches are frequent)

→ Branch Delay Slot (hides 1 cycle, doesn't scale to deep pipelines)

→ Branch Prediction (speculative fetch, but risk of misprediction)

→ Speculative Execution + Flush/Recovery (handles misprediction cost)

New Problem: only 1 instruction/cycle even without hazards

→ Superscalar Execution (multiple execution units)

→ Out-of-Order Execution (execute when ready, retire in order) — max performance, max hardware complexity

This pipeline discussion exposed a recurring theme: the CPU is now executing very fast, but it constantly needs data from memory — and memory is slow. That exact tension is what we'll unpack next.
```

---

# Topic 5: Memory Organization

## 5.1 The Core Problem — The CPU-Memory Speed Gap

**Problem:** From Topics 2 and 4, we saw the CPU (with pipelining, fast registers) executing instructions extremely quickly. But main memory (RAM) is dramatically slower than the CPU. If every instruction/data access had to go directly to RAM, the CPU would spend most of its time **waiting**, negating all the speed gains from pipelining and fast ALUs. Also, we face a fundamental trade-off: fast memory technologies are expensive and small; large memory technologies are slow and cheap. We can't have "fast AND huge AND cheap" memory.

**Solution: Memory Hierarchy**

- Organize memory into layers, each trading off speed, size, and cost:

```text
Registers (fastest, smallest, most expensive)

↓

Cache (L1 → L2 → L3)

↓

Main Memory (RAM)

↓

Secondary Storage (SSD/HDD) (slowest, largest, cheapest)

- Exploit **locality of reference** — programs tend to access the same or nearby data repeatedly (temporal locality) and sequentially (spatial locality) — so keeping recently/likely-used data in faster, smaller memory close to the CPU gives most of the speed benefit of fast memory without the cost of making *all* memory fast.
```

**Limitation:** This is a conceptual framework — it doesn't yet specify *how* the fast small layer (cache) decides what data to hold, given it can't hold everything. This directly leads to the design of cache memory.

---

## 5.2 Cache Memory — Deciding What to Store

**Problem:** Cache is much smaller than RAM. Given any memory address the CPU requests, how does hardware quickly determine (a) whether the requested data is already in cache (**hit**) and (b) if not, where to place it (**miss**)?

### Solution 1: Direct-Mapped Cache

- Each memory block maps to **exactly one** specific cache location (via address mod cache_size).

**Pros:** Simple, fast lookup (no searching needed — just compute the index).

**Limitation:** If two frequently-used memory blocks happen to map to the **same** cache line, they keep evicting each other even though the rest of the cache is empty — called **thrashing/conflict misses**. This wastes available cache capacity.

### Solution 2: Fully Associative Cache

- Any memory block can go into **any** cache line — eliminates conflict misses entirely, since placement is unrestricted.

**Limitation:** To check for a hit, hardware must **search every single cache line simultaneously** (via parallel comparators) — this is expensive in hardware (die area, power) and doesn't scale well as cache size grows.

**Built-on Solution: Set-Associative Cache** (the practical middle ground)

- Divide cache into sets; each memory block maps to one specific **set** (like direct-mapped), but within that set, the block can go into **any of N ways** (like fully associative, but only searching N lines, not the whole cache).

- This is a tunable trade-off: 2-way, 4-way, 8-way set-associative — balancing hit rate improvement against hardware search cost.

**New Problem Introduced:** In associative/set-associative caches, when a new block needs to be loaded into a full set, which existing line do we evict?

---

## 5.3 Cache Replacement Policies

**Problem:** When cache/set is full and a new block must be loaded, which existing cache line should be evicted to make room?

### Solution 1: FIFO (First-In-First-Out)

- Evict the oldest-loaded line.

**Limitation:** Ignores actual usage pattern — might evict a line that's still being frequently accessed just because it was loaded first (goes against locality principle).

### Solution 2: LRU (Least Recently Used)

- Evict the line that hasn't been accessed for the longest time — directly exploits temporal locality (recently used data is likely to be used again soon).

**Limitation:** True LRU requires tracking access order/timestamps for every line — expensive in hardware for high associativity (many ways per set).

**Built-on Solution:** Approximate LRU (e.g., clock/pseudo-LRU algorithms) — trade a small amount of accuracy for significantly cheaper hardware implementation. **Random replacement** is also sometimes used as an even cheaper (if slightly less effective) alternative in some designs.

---

## 5.4 Cache Write Policies

**Problem:** When the CPU **writes** to a memory address that's in cache, do we update only the cache, or also main memory? If only cache, cache and RAM become inconsistent.

### Solution 1: Write-Through

- Every write updates **both** cache and main memory immediately.

**Pros:** Cache and memory always stay consistent — simple correctness story.

**Limitation:** Every write incurs the latency of a main memory access, largely negating the speed benefit of cache for write-heavy workloads.

### Solution 2: Write-Back

- Write only to cache, and mark the line as "dirty." Only write the data back to main memory later, when that dirty line is evicted.

**Why this helps:** Multiple writes to the same location cost only one eventual memory write, not one per write — much faster for write-heavy code.

**Limitation Introduced:** Requires extra "dirty bit" bookkeeping, and if a system crashes before a dirty line is flushed, data can be lost — also makes cache coherence (Topic 8, multicore) considerably more complex, since multiple caches might hold conflicting "dirty" copies of the same data.

---

## 5.5 Multi-Level Caches

**Problem:** Even a well-designed single cache is a fixed size/speed trade-off point. Can we do better than one flat cache layer?

**Solution:** Add multiple cache levels — small/very-fast **L1** (per-core, split into instruction and data caches to solve the structural hazard from Topic 4.2), larger/slower **L2** (per-core or shared), and even larger/slower **L3** (shared across cores) — each level acting as a "safety net" for the level above, progressively trading speed for capacity, closely mirroring the overall memory hierarchy idea but within the cache itself.

---

## 5.6 Main Memory (RAM) Technology

**Problem:** Cache solves the speed gap for *frequently accessed* data, but we still need a reasonably fast, reasonably large main memory layer beneath it.

**Solution: DRAM (Dynamic RAM)** — used for main memory: cheap, dense (many bits per chip), but requires periodic **refreshing** (capacitor-based storage leaks charge) and is slower than cache.

**Contrast: SRAM (Static RAM)** — used for cache: faster, no refresh needed (transistor-latch based), but far more expensive and less dense — this is *why* cache is small and RAM is large, tying directly back into the hierarchy design in 5.1.

**Limitation of single-bank DRAM:** Sequential accesses to memory still queue up behind each other.

**Built-on Solution: Memory Interleaving** — split memory into multiple banks that can be accessed in parallel/overlapping fashion, increasing effective memory bandwidth.

---

## 5.7 Virtual Memory — A Different Kind of Memory Problem

**Problem:** So far we've solved the *speed* problem (cache). But a separate problem exists: physical RAM is limited in size, and multiple programs run "simultaneously" (multiprogramming). How do we let programs use more memory than physically exists, and safely isolate one program's memory from another's, without programs needing to know the actual physical memory layout?

**Solution: Virtual Memory**

- Give each process its own **virtual address space**, independent of physical memory layout. Hardware (MMU) and OS translate virtual addresses to physical addresses at runtime.

**Mechanism 1: Paging**

- Divide virtual and physical memory into fixed-size blocks (**pages** and **frames**). A **page table** maps virtual pages to physical frames. Pages not currently needed can live on disk, and be brought into RAM only when accessed.

**Limitation:** Fixed-size pages don't align with logical program structures (a function or data structure doesn't naturally fit into page-sized chunks) — this is more a "segmentation" problem than paging solves.

**Mechanism 2: Segmentation**

- Divide memory into variable-sized **logical segments** (code segment, stack segment, data segment) that match how programmers/compilers naturally think about a program.

**Limitation of Segmentation alone:** Variable-sized segments reintroduce a problem similar to fixed-partition memory allocation — external fragmentation (gaps between segments of different sizes that are individually too small to be reused).

**Built-on Solution: Paged Segmentation** (used in many real systems) — combine both: segments provide logical structure, and each segment is internally divided into fixed-size pages, getting the benefits of both (logical organization + no external fragmentation).

**New Problem Introduced:** If a needed page isn't in physical memory (it's only on disk), how do we choose which existing physical page to evict to make room — very similar to the cache replacement problem in 5.3, but now at a much larger, disk-backed scale.

---

## 5.8 Page Replacement Algorithms

**Problem:** Physical RAM has limited frames; when a "page fault" occurs (needed page is on disk, not RAM) and RAM is full, which resident page should be evicted?

### Solution 1: FIFO

— same limitation as cache FIFO (5.3): ignores actual usage; can even suffer from **Belady's Anomaly** (increasing the number of frames can, counterintuitively, increase page faults).

### Solution 2: LRU

— evict the least-recently-used page. Better hit rates by exploiting locality, but expensive to implement precisely at OS scale (tracking exact access history for potentially millions of pages).

**Solution 3 (theoretical benchmark): Optimal (Belady's Algorithm)** — evict the page that will be used furthest in the future. Not implementable in practice (requires future knowledge) but used as a theoretical upper bound to measure how close practical algorithms (like LRU approximations — e.g., the Clock algorithm) come to ideal performance.

---

## 5.9 Translation Lookaside Buffer (TLB) — Speeding Up Virtual Memory

**Problem:** Virtual memory requires translating every virtual address to a physical address via the page table on **every single memory access** — but the page table itself lives in main memory, meaning every memory access now potentially requires **an extra memory access** just to do the translation, doubling effective memory latency.

**Solution: TLB (Translation Lookaside Buffer)**

- A small, very fast **cache specifically for recent virtual-to-physical address translations**, sitting between CPU and main memory — directly reusing the same "cache" idea from 5.2, but applied to page table entries instead of data.

**Why this works:** Programs exhibit locality in *which pages* they access, so recent translations are highly likely to be reused — a TLB hit avoids the extra page-table memory access entirely.

**Remaining Limitation:** A **TLB miss** still requires a full page table walk (potentially multiple memory accesses for multi-level page tables), and on a **process context switch**, TLB entries for the old process are often invalid for the new process — requiring a TLB flush (or tagging entries with process IDs to avoid full flushes), which is a recurring theme when we later discuss multiprocessing/multicore context switching overhead.

---

**Summary of Intuitive Chain in Topic 5**

```text
Problem: CPU fast, memory slow, can't afford all memory to be fast

→ Memory Hierarchy (registers → cache → RAM → disk, exploiting locality)

Problem: cache is small — how to map/find data in it?

→ Direct-Mapped (fast, but conflict misses/thrashing)

→ Fully Associative (no conflict misses, but expensive parallel search)

→ Set-Associative (tunable middle ground)

Problem: cache full — what to evict?

→ FIFO (ignores usage) → LRU (exploits locality, expensive) → Approximate LRU/Random (cheaper)

Problem: write consistency between cache and memory

→ Write-Through (consistent, slow) → Write-Back (fast, needs dirty-bit + coherence complexity)

Problem: one cache level is a fixed trade-off point

→ Multi-level caches (L1/L2/L3)

Problem: RAM itself — cost/density vs speed

→ DRAM (main memory, needs refresh) vs SRAM (cache, fast, costly)

→ Memory Interleaving (parallel banks for bandwidth)

Problem: limited physical RAM + need for process isolation/multiprogramming

→ Virtual Memory

→ Paging (fixed blocks, easy allocation, but ignores logical structure)

→ Segmentation (logical structure, but external fragmentation)

→ Paged Segmentation (best of both)

Problem: page fault, RAM full — what to evict?

→ FIFO (Belady's anomaly) → LRU (better, costly) → Optimal (theoretical benchmark)

Problem: address translation adds an extra memory access per access

→ TLB (cache for translations) — but misses still costly, and context switches complicate it
```

---

# Topic 6: Input/Output Organization

## 6.1 The Core Problem — CPU-I/O Speed Mismatch

**Problem:** We've optimized the CPU (pipelining) and memory (cache hierarchy). But I/O devices — keyboards, disks, network cards, printers — operate at wildly different (usually much slower, sometimes irregular) speeds compared to the CPU. If the CPU has to directly manage every detail of every I/O transfer, how do we do this without either wasting massive CPU time or losing data?

---

## 6.2 Programmed I/O — The First Attempt

**Problem:** How does the CPU actually get data into/out of a device?

**Solution: Programmed I/O**

- CPU executes a loop that continuously **polls** a device's status register, checking "are you ready?" When ready, the CPU itself transfers each data word between the device and memory/registers, one instruction at a time.

**Why this works (initially):** Simple to implement — no extra hardware needed beyond basic status/data registers on the device.

**Limitation:** This is **busy-waiting** — the CPU is 100% occupied continuously polling and transferring, unable to do any other useful work, even though most of that time the device isn't actually ready. For slow devices (e.g., a keyboard, where a human types maybe 5 characters/second), this wastes enormous amounts of CPU time.

---

## 6.3 Interrupt-Driven I/O — Solving the Busy-Wait Problem

**Problem:** Can the CPU do other useful work while waiting for a slow device, instead of polling continuously?

**Solution: Interrupt-Driven I/O**

- CPU issues an I/O request and then continues executing **other instructions/programs**. When the device finishes (or is ready), it sends an **interrupt signal** to the CPU. The CPU then pauses its current work (saving state), executes an **Interrupt Service Routine (ISR)** to handle the transfer, then resumes the interrupted program.

**Why this helps:** Eliminates busy-waiting — CPU utilization improves dramatically since it can do productive work between I/O requests and completions.

**Limitation Introduced:**

1.  **Context-switch overhead** — saving/restoring CPU state (registers, PC) on every interrupt has a real cost, and if interrupts are very frequent (e.g., high-speed network traffic), this overhead can itself become significant.

2.  **Still CPU-driven, word-by-word** — the CPU itself is still directly involved in copying **every single word/byte** of data between the device and memory during the ISR. For large data transfers (e.g., reading a large file from disk), the CPU spends a lot of cycles just moving data, rather than doing other computation.

---

## 6.4 Direct Memory Access (DMA) — Removing the CPU from Data Transfer

**Problem:** For bulk data transfers, can we avoid involving the CPU in the actual data-copying at all, and only involve it for setup and completion notification?

**Solution: DMA (Direct Memory Access)**

- A separate, specialized hardware controller (the **DMA controller**) is given the source, destination, and length of the transfer by the CPU (a brief setup step). The DMA controller then independently manages the entire bulk transfer directly between the device and main memory, **without CPU involvement**, and sends a single interrupt to the CPU only when the **entire transfer is complete**.

**Why this helps:** The CPU is freed almost entirely from data-transfer duty — it just initiates the transfer and gets notified upon completion, allowing it to do other computation throughout the bulk transfer.

**New Problem Introduced:** Since both the CPU and DMA controller can need to access main memory, they might **compete for the memory bus at the same time** — this reintroduces a structural-hazard-like resource conflict (similar to Topic 4.2), now between CPU and DMA rather than between pipeline stages.

**Solution to this Conflict: Cycle Stealing**

- The DMA controller takes control of the bus for a single memory cycle at a time, temporarily pausing the CPU's own bus access ("stealing" a cycle), then releases it — balancing DMA transfer speed against CPU responsiveness, rather than either device monopolizing the bus entirely (which would be "burst mode" DMA, a further trade-off between transfer speed and CPU stall time).

---

**Summary of Intuitive Chain in Topic 6**

```text
Problem: CPU vs I/O device speed mismatch

→ Programmed I/O: CPU polls device directly (simple, but wastes CPU time busy-waiting)

Problem: CPU wastes time busy-waiting

→ Interrupt-Driven I/O: CPU works elsewhere, device interrupts when ready

(better CPU utilization, but context-switch overhead + CPU still copies every word)

Problem: CPU still bottlenecked copying bulk data word-by-word

→ DMA: dedicated controller handles entire transfer, CPU only notified at completion

(frees CPU almost entirely, but introduces bus contention with CPU)

Problem: CPU and DMA controller compete for memory bus

→ Cycle Stealing: DMA takes bus one cycle at a time, balancing transfer speed vs CPU stalling

This naturally raises the question: what exactly *is* this "bus" that both CPU and DMA are contending for, and how is it organized to support multiple devices safely?
```

---

# Topic 7: Bus & Interconnect Organization

## 7.1 The Core Problem — Shared Communication Pathway

**Problem:** From Topics 2, 5, and 6, we now have multiple independent components — CPU, main memory, cache, I/O devices, DMA controller — that all need to communicate (send addresses, data, and control signals) with each other. Wiring a dedicated point-to-point connection between every possible pair of components would require an enormous, impractical number of wires (grows quadratically with the number of components). How do we let many components communicate without this explosion of dedicated wiring?

**Solution: System Bus**

- A shared set of common wires (lines) that all components connect to and communicate over, divided into three logical parts:

  - **Data Bus** — carries the actual data being transferred.

  - **Address Bus** — carries the memory/device address being accessed.

  - **Control Bus** — carries control signals (read/write, interrupt requests, clock, bus grant/request signals).

**Why this helps:** Massively reduces wiring complexity — adding a new device just means tapping into the existing shared bus, not wiring it to every other component individually.

**New Problem Introduced:** Because the bus is **shared**, only one device can drive (transmit on) it at any given moment, otherwise signals collide/corrupt. This directly reintroduces the resource-contention theme we saw with DMA vs CPU in Topic 6.4, but now generalized to *all* devices on the system.

---

## 7.2 Bus Arbitration — Deciding Who Gets to Talk

**Problem:** With multiple devices (CPU, DMA controller, multiple I/O controllers) all potentially wanting to use the bus at the same time, how do we decide, fairly and correctly, which one gets control of the bus at any given moment?

### Solution 1: Centralized Arbitration (e.g., Daisy Chaining)

- A single arbiter (often built into or near the CPU) grants bus access. In daisy chaining specifically, the "bus grant" signal passes physically through devices in a fixed priority chain — the first device in the chain that wants the bus takes it and stops the grant signal from propagating further.

**Pros:** Simple, cheap to implement (minimal extra control lines).

**Limitation:**

1.  **Fixed priority** — devices earlier in the chain always get priority, so if the highest-priority device requests the bus frequently, lower-priority devices can suffer **starvation** (never getting a turn).

2.  Chain propagation delay grows with the number of devices, and if a device in the middle of the chain fails, it can break arbitration for all devices after it.

**Built-on Solution 2: Centralized Parallel Arbitration**

- Every device has its own dedicated request/grant line directly to a central arbiter, which can use more sophisticated policies (round-robin, priority-based with aging) to avoid starvation.

**Trade-off:** Requires more control lines (one request/grant pair per device) — more wiring/hardware than daisy chaining, but fairer and avoids the single-point chain-break problem.

### Solution 3: Distributed Arbitration

- No central arbiter; devices collectively negotiate bus access using shared arbitration logic/protocol (each device compares its own priority/ID against others on shared lines).

**Trade-off:** Removes single point of failure (no central arbiter to break), but requires more complex distributed logic replicated at every device, and negotiation itself takes bus cycles.

---

## 7.3 Synchronous vs Asynchronous Bus — Timing the Communication

**Problem:** Once a device has control of the bus, how do sender and receiver agree on exactly *when* data on the bus is valid and should be read/latched?

### Solution 1: Synchronous Bus

- All devices share a common clock signal; data transfer happens at fixed, predetermined clock edges — everyone "agrees" on timing because they're synchronized to the same clock.

**Pros:** Simple protocol, straightforward to design and predict timing.

**Limitation:** The bus speed is limited by the **slowest device** on it — since all transfers happen in fixed clock cycles, a fast device is forced to wait for cycles sized for the slowest possible participant, and clock skew becomes a real physical problem as bus length or device count grows (harder to keep all devices perfectly synchronized to the same clock edge).

**Built-on Solution: Asynchronous Bus**

- No shared clock. Instead, uses a **handshaking protocol** — e.g., sender asserts a "data ready" signal, receiver responds with "data accepted/ack" signal, and only then does the sender proceed to the next transfer. Timing adapts naturally to however fast each specific device actually is.

**Why this helps:** Each device communicates at its own natural speed — fast devices aren't held back by slow ones, and there's no clock-skew concern since there's no shared clock to distribute.

**Trade-off Introduced:** The handshaking protocol (request/ack round trip) adds **overhead per transfer** compared to a simple synchronous clock edge, and the control logic to manage handshaking is more complex than simply following a clock.

**Practical Resolution:** Many real systems use a **hybrid** — e.g., a synchronous bus for tightly coupled, similar-speed components (CPU-memory), with asynchronous or bridged buses (like PCI, USB) for peripheral I/O devices with more varied speeds — directly building on the memory hierarchy and I/O organization ideas from Topics 5 and 6 by matching bus type to the speed characteristics of what it connects.

---

**Summary of Intuitive Chain in Topic 7**

```text
Problem: too many wires needed for point-to-point connections between all components

→ System Bus (shared data/address/control lines)

Problem: only one device can use the shared bus at a time — who gets priority?

→ Daisy Chaining (simple, but fixed priority causes starvation, chain-break risk)

→ Centralized Parallel Arbitration (fairer, avoids chain-break, but more wiring)

→ Distributed Arbitration (no single point of failure, but complex replicated logic)

Problem: how do sender/receiver agree on when data is valid?

→ Synchronous Bus (simple, but limited by slowest device + clock skew issues)

→ Asynchronous Bus (adapts to each device's speed, but handshaking overhead per transfer)

→ Hybrid: match bus type to component speed characteristics (CPU-memory sync, I/O async)

This sets up our final topic naturally: so far we've discussed a **single CPU** system. But what happens when we have **multiple CPUs/cores**, all needing to share memory and buses simultaneously? This introduces an entirely new class of problems around parallel execution and keeping multiple caches consistent.
```

---

# Topic 8: Parallelism at the Organization Level

## 8.1 The Core Problem — Single CPU Performance Hits Physical Limits

**Problem:** From Topics 2–7, we've pushed single-CPU performance via pipelining, superscalar/out-of-order execution, caching, and fast buses. But there are physical limits — increasing clock speed further generates too much heat (power density), and instruction-level parallelism (superscalar/OoO from Topic 4.5) has diminishing returns since most programs don't have infinite independent instructions to exploit. How do we continue improving performance beyond a single CPU's limits?

**Solution: Use Multiple Processors/Cores Working Together**

- Instead of making one CPU faster, use several CPUs (or cores) executing simultaneously, dividing work among them.

**New Problem This Immediately Raises:** Not all parallel hardware is the same — we need a way to **classify** different styles of parallel execution to reason about them systematically.

---

## 8.2 Flynn's Taxonomy — Classifying Parallelism

**Problem:** Given many different possible parallel hardware designs, how do we categorize them based on how instructions and data relate?

**Solution: Flynn's Taxonomy** — classify by number of instruction streams and data streams:

- **SISD (Single Instruction, Single Data):** Traditional single-core CPU — one instruction stream operates on one data stream at a time (everything covered in Topics 1–7 so far).

- **SIMD (Single Instruction, Multiple Data):** One instruction operates simultaneously on multiple data elements (e.g., GPUs, vector processors) — efficient for uniform, data-parallel tasks (image processing, matrix math).

- **MISD (Multiple Instruction, Single Data):** Multiple instructions operate on the same data stream — rare in practice (used in some fault-tolerant systems for redundant computation checking).

- **MIMD (Multiple Instruction, Multiple Data):** Multiple independent processors each execute their own instructions on their own data — this describes most modern **multicore/multiprocessor systems**.

**Limitation:** This is purely a *classification* — it doesn't tell us **how** the multiple processors in MIMD systems actually share (or don't share) memory, which is the next concrete design decision.

---

## 8.3 Multiprocessing — Shared Memory vs Distributed Memory

**Problem:** In a MIMD system with multiple processors, how do they access data and communicate/cooperate with each other?

### Solution 1: Shared Memory Multiprocessing

- All processors access a **single common physical memory space** — any processor can read/write any memory location, and communication between processors happens implicitly through shared variables.

**Pros:** Simple programming model — much like programming a single CPU, just with parallel threads.

**Limitation:** As the number of processors grows, they all contend for the **same memory/bus** (directly recalling the bus-contention problem from Topic 7) — this becomes a serious bottleneck, limiting how many processors can be usefully added (poor scalability beyond a moderate number of cores).

### Solution 2: Distributed Memory Multiprocessing

- Each processor has its **own private local memory**; processors communicate explicitly by passing messages over an interconnection network (no shared address space).

**Why this helps:** Eliminates the shared-bus bottleneck — scales to very large numbers of processors (e.g., supercomputer clusters), since each processor's memory access stays local.

**Trade-off Introduced:** Programming is significantly harder — the programmer/software must explicitly manage message-passing and data distribution, rather than relying on simple shared variables; communication over the network also has higher latency than a shared memory access.

---

## 8.4 Multicore Architecture — The Practical Middle Ground

**Problem:** Full distributed-memory systems (separate machines) are for large-scale clusters. But how do we get parallelism *within a single chip*, where physical proximity actually makes shared memory feasible again?

**Solution: Multicore Architecture**

- Place multiple independent processor cores on a **single chip**, where cores share certain resources (e.g., L3 cache, memory controller, bus — recalling Topics 5 and 7) but each has its own private execution resources (registers, L1 cache, often private L2).

**Why this is practical:** Physical proximity on-chip means shared memory access is fast (unlike distributed systems across a network), while each core still has private fast cache (L1) to avoid constant contention for shared resources.

**New Problem Introduced:** If each core has its **own private cache** (L1, sometimes L2) but they all can read/write the **same shared main memory**, what happens when two cores each cache their own copy of the *same* memory location, and one core modifies its copy? The other core's cached copy is now **stale/incorrect** — this is the classic **cache coherence problem**.

---

## 8.5 Cache Coherence — Keeping Multiple Cached Copies Consistent

**Problem:** Core A and Core B both cache a copy of memory address X. Core A writes a new value to its cached copy of X. How does the system ensure Core B doesn't keep using its now-stale cached value of X, while still preserving the speed benefits of caching (Topic 5)?

### Solution 1: Snooping Protocols (Bus-Based)

- Every cache "listens" (snoops) on the shared bus for write operations from other caches. If a cache sees another core writing to an address it also has cached, it takes action (invalidate its own copy or update it).

**Specific Protocol: MESI** (Modified, Exclusive, Shared, Invalid)

- Each cache line is tagged with one of four states:

  - **Modified:** this cache has the only copy, and it's been changed (dirty) — must write back before anyone else reads it.

  - **Exclusive:** this cache has the only copy, but it matches main memory (clean).

  - **Shared:** multiple caches may have this line, all consistent with main memory.

  - **Invalid:** this cache's copy is stale/unusable.

- When a core writes to a Shared or Exclusive line, it broadcasts an invalidation on the bus; other caches holding that line transition to Invalid, forcing them to re-fetch the correct value on next access.

**Why this works:** Directly reuses the shared-bus infrastructure from Topic 7 (every cache already "sees" bus traffic) — no extra network needed for small-to-moderate core counts.

**Limitation:** Snooping requires **broadcasting** every relevant write to *all* caches on the bus — as the number of cores grows large (many-core chips, 16+ cores), the bus gets flooded with coherence traffic, and bus bandwidth becomes the bottleneck (directly echoing the shared-memory scalability problem from 8.3).

**Built-on Solution: Directory-Based Coherence**

- Instead of broadcasting to everyone, maintain a centralized (or distributed) **directory** that tracks exactly *which* caches hold a copy of each memory block. When a write occurs, the directory sends invalidation messages **only to the specific caches** that actually have a copy, rather than broadcasting to all.

**Trade-off:** Scales much better to many-core systems (no broadcast storm), but adds the overhead/complexity of maintaining the directory itself (extra memory to store directory state, and directory lookup latency on every coherence action).

---

**Summary of Intuitive Chain in Topic 8**

```text
Problem: single CPU performance hits physical/ILP limits

→ Solution: use multiple processors/cores in parallel

Problem: how to classify different parallel hardware styles?

→ Flynn's Taxonomy: SISD, SIMD, MISD, MIMD

Problem (within MIMD): how do multiple processors access memory/communicate?

→ Shared Memory (simple programming, but bus/memory contention limits scalability)

→ Distributed Memory (scales well, but hard to program + network latency)

Problem: want shared-memory simplicity + on-chip speed

→ Multicore Architecture (cores share L3/bus, private L1/L2)

Problem: private per-core caches can go stale relative to each other

→ Snooping Protocols / MESI (bus broadcast invalidation — simple, but doesn't scale to many cores)

→ Directory-Based Coherence (targeted invalidation — scales better, but directory overhead)
```

---

**🎓 Full Course Recap — The End-to-End Intuitive Chain**

```text
Topic 1 (Data Representation): how to represent numbers/negatives/fractions/text in binary

→ 2's complement chosen → simplifies ALU design (Topic 2)

Topic 2 (CPU Building Blocks): adders, ALU, registers

→ registers solve slow-memory-per-operation problem → but CPU still needs main memory occasionally

Topic 3 (Instruction Execution): fetch-decode-execute cycle, control unit design

→ sequential execution is slow → motivates pipelining

Topic 4 (Pipelining): overlap stages, hazards (structural/data/control), superscalar/OoO

→ CPU now very fast → memory becomes the bottleneck

Topic 5 (Memory Organization): cache hierarchy, virtual memory, TLB

→ CPU/memory fast → I/O devices become the relative bottleneck

Topic 6 (I/O Organization): programmed I/O → interrupts → DMA

→ all components need to communicate → shared bus needed

Topic 7 (Bus Organization): shared bus, arbitration, sync/async timing

→ single CPU hits performance limits → need multiple CPUs

Topic 8 (Parallelism): multiprocessing, multicore, cache coherence

→ completes the loop: multiple cores each need the cache/memory/bus concepts from Topics 5 & 7,

now generalized to a multi-core, multi-cache context

This completes **Computer Organization** as one continuous, problem-driven narrative — each topic's unresolved limitation became the motivating problem for the next.
```
