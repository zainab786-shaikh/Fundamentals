# Computer Networks — One Connected Question Journey

Think of this as one story: **two computers want to communicate**. Each solution creates a new problem, leading naturally to the next networking concept.

We will use two imaginary computers:

- **Nova** — your laptop
- **Orion** — a server on another continent

For every question, try to answer:

1. **What is the problem?**
2. **Which networking mechanism solves it?**
3. **What happens if that mechanism fails?**
4. **How does it connect to the next topic?**

---

# Chapter 0: The Beginning — “Two Computers Want to Talk”

Nova wants to send the message **“Hello”** to Orion.

But computers cannot directly understand human words. The message must become bits, travel through some medium, and become meaningful again at the destination.

## Questions

1. How is the word **“Hello”** converted into bits?
2. How can bits travel through:
   - Copper cables
   - Fiber-optic cables
   - Radio waves?
3. What is the difference between a signal and data?
4. Why can a computer not simply send the word “Hello” through a wire?
5. What problems could change or damage bits while they travel?
6. How does Orion know where one message starts and another ends?
7. If both computers use different communication rules, can they understand each other?
8. What is a network protocol, and why do networks need protocols?
9. Imagine designing your own communication protocol. What rules would you define?
10. Why is computer networking often divided into layers?

### Connection question

11. Once Nova creates the bits, how does it physically place them onto a network?

---

# Chapter 1: Physical Layer — “How Do Bits Travel?”

The first challenge is moving raw bits from one device to another.

The **Physical Layer** defines cables, radio waves, connectors, frequencies, voltages, and signal timing.

## Questions

1. How can voltage represent `0` and `1` in a copper cable?
2. How can light represent bits inside fiber-optic cable?
3. How can radio waves carry Wi-Fi signals without wires?
4. Why is fiber usually faster and more reliable over long distances than copper?
5. What is bandwidth?
6. What is the difference between bandwidth and actual speed?
7. What is latency?
8. Can a network have high bandwidth but also high latency? Give an example.
9. Why does signal strength become weaker over distance?
10. What is interference, and how can it damage communication?
11. What is the purpose of a repeater?
12. Why do network cables have maximum recommended lengths?
13. What is the difference between:
    - Simplex
    - Half-duplex
    - Full-duplex communication?
14. Why is full-duplex communication normally preferred?
15. If one bit changes during transmission, how might the receiver notice?

## Creative challenge

16. You must connect two buildings:

- They are two kilometres apart.
- Heavy electrical machinery operates between them.
- Fast and reliable communication is required.

Would you choose copper, fiber, or wireless? Why?

### Connection question

17. The physical layer can move bits, but how does the receiver organize those bits into meaningful units?

---

# Chapter 2: Data Link Layer — “Turning Bits into Frames”

A stream of bits is difficult to manage. The network groups bits into **frames**.

The Data Link Layer handles local delivery, framing, MAC addresses, error detection, and access to the shared medium.

## Questions

1. What is a frame?
2. Why are messages divided into frames instead of being sent as one endless stream?
3. How does a receiver recognize the beginning and end of a frame?
4. What is a MAC address?
5. Why does a network interface card need a MAC address?
6. Is a MAC address used mainly for local or global communication?
7. What is the difference between a MAC address and an IP address?
8. What happens if a frame arrives with an error?
9. How can a checksum or CRC help detect damaged frames?
10. Can error detection always repair an error?
11. Why might a damaged frame be discarded rather than accepted?
12. What happens when two devices transmit on a shared medium at the same time?
13. How do Ethernet and Wi-Fi handle access to the network differently?
14. Why are collisions uncommon in modern switched Ethernet?
15. What is the purpose of an Ethernet switch?

## Switch-thinking questions

16. How does a switch learn which device is connected to each port?
17. What does a switch do when it does not recognize the destination MAC address?
18. Why does a switch sometimes send a frame through several ports?
19. What is the difference between a hub and a switch?
20. Why is a switch more efficient and secure than a hub?
21. What happens if a switch receives a broadcast frame?
22. What problem could occur if switches are connected in a loop?
23. How does the Spanning Tree Protocol help prevent switching loops?

## Scenario

Nova, a printer, and another laptop are connected to the same switch.

24. Nova sends a frame to the printer. Which devices should receive it?
25. Nova sends a broadcast. Which devices should receive it?
26. What information does the switch store after seeing Nova’s frame?
27. What happens if the printer is disconnected and moved to another switch port?

### Connection question

28. A switch can deliver frames inside one local network. How can Nova communicate with Orion on a different network?

---

# Chapter 3: Network Layer — “Finding the Destination”

Nova and Orion are on different networks. MAC addresses alone cannot guide data across the world.

The **Network Layer** provides logical addressing and routing through **IP**.

## Questions

1. What is an IP address?
2. Why do networks need IP addresses when devices already have MAC addresses?
3. What is the difference between IPv4 and IPv6?
4. Why was IPv6 introduced?
5. What is a packet?
6. What information is stored in an IP packet header?
7. What is the difference between a frame and a packet?
8. Can the same IP packet be placed inside different types of frames during its journey?
9. What does a router do?
10. How is a router different from a switch?
11. What is a routing table?
12. How does a router choose the next destination for a packet?
13. What is a default gateway?
14. What happens if Nova does not know its default gateway?
15. What happens when a router has no route to the destination?
16. Can packets travelling between the same computers take different routes?
17. Can packets arrive out of order?
18. What is TTL or Hop Limit?
19. How does TTL prevent packets from travelling forever in a routing loop?
20. What does the `traceroute` or `tracert` command reveal?

## Journey question

Nova sends a packet to Orion through three routers.

21. Which addresses normally remain unchanged during the journey?
22. Which local addresses change at every network hop?
23. What does each router examine before forwarding the packet?
24. Does a router need to know the complete future path?
25. What happens to the packet when its TTL reaches zero?

### Connection question

26. Before Nova sends the packet to its gateway, how does it discover the gateway’s local hardware address?

---

# Chapter 4: ARP and Neighbor Discovery — “Who Owns This Address?”

Nova knows the gateway’s IP address, but Ethernet delivery requires a MAC address.

IPv4 commonly uses **ARP**. IPv6 uses **Neighbor Discovery**.

## Questions

1. What problem does ARP solve?
2. Why does Nova need the gateway’s MAC address?
3. What is an ARP request?
4. Why is an ARP request broadcast?
5. What is an ARP reply?
6. Why is the ARP result stored in a cache?
7. What happens when an ARP cache entry expires?
8. Does Nova use ARP to discover Orion’s MAC address across the internet?
9. Whose MAC address does Nova need when Orion is outside the local network?
10. What would happen if two devices claimed the same IP address?
11. How could an attacker send a false ARP reply?
12. What is ARP spoofing, and what damage could it cause?
13. Why does IPv6 use Neighbor Discovery instead of ARP?
14. How can network equipment reduce the risk of false address mappings?

### Connection question

15. Nova now knows where to send the packet, but how was its own IP address assigned?

---

# Chapter 5: IP Addressing and Subnetting — “Who Belongs to Which Network?”

A network needs an organized addressing system. Subnetting divides a large network into smaller networks.

## Questions

1. What is the network portion of an IP address?
2. What is the host portion?
3. What does a subnet mask represent?
4. What does `/24` mean in `192.168.1.0/24`?
5. How can Nova determine whether another IP address is local or remote?
6. Why are large networks divided into subnets?
7. How can subnetting improve:
   - Organization
   - Performance
   - Security?
8. What is a network address?
9. What is a broadcast address in IPv4?
10. Why should a normal host not use the network or broadcast address?
11. What is the loopback address used for?
12. What is a private IP address?
13. Why are private IP addresses not normally routed directly across the public internet?
14. What is a public IP address?
15. Why should separate departments be placed in different subnets?

## Simple subnet challenges

Given the network `192.168.10.0/24`:

16. What is its network address?
17. What is its broadcast address?
18. What is the valid host range?
19. How many usable IPv4 host addresses does it provide?
20. Are `192.168.10.20` and `192.168.10.200` in the same subnet?

Now consider:

- Nova: `192.168.10.25/24`
- Printer: `192.168.20.15/24`

21. Are they in the same subnet?
22. Can Nova send directly to the printer?
23. Which device must help them communicate?
24. What route and firewall rules might be required?

## Design challenge

25. A school has four departments:

- Administration
- Teachers
- Students
- Guests

Why might each group need a separate subnet or VLAN?

### Connection question

26. Instead of configuring every device manually, how can a new device automatically receive its network settings?

---

# Chapter 6: DHCP — “How Does a New Device Join?”

When Nova joins a network, it needs an IP address, subnet information, a gateway, and usually a DNS server.

**DHCP** can provide these automatically.

## Questions

1. What problem does DHCP solve?
2. What information can a DHCP server provide?
3. Why does a new device initially use broadcast messages?
4. Explain the basic DHCP process:
   - Discover
   - Offer
   - Request
   - Acknowledge
5. What is a DHCP lease?
6. Why are addresses leased rather than permanently given?
7. What happens when the lease is close to expiring?
8. What happens if no DHCP server answers?
9. Why might servers and printers use reserved or static addresses?
10. Can two DHCP servers accidentally offer conflicting settings?
11. What is a rogue DHCP server?
12. How could a rogue DHCP server redirect traffic through an attacker?
13. How can managed switches help block unauthorized DHCP servers?
14. Why should DHCP provide more than just an IP address?

### Connection question

15. Nova now has an IP address, but people prefer names such as `example.com`. How are names translated into addresses?

---

# Chapter 7: DNS — “Humans Remember Names, Networks Use Addresses”

The **Domain Name System** translates domain names into network information.

## Questions

1. Why is DNS necessary?
2. What would internet use be like without DNS?
3. What happens when Nova looks up `example.com`?
4. What is the difference between:
   - A DNS resolver
   - A root server
   - A top-level-domain server
   - An authoritative server?
5. Why is DNS a distributed system rather than one global server?
6. What is a DNS record?
7. What are the purposes of:
   - `A`
   - `AAAA`
   - `CNAME`
   - `MX`
   - `NS`
   - `TXT` records?
8. What is DNS caching?
9. How does caching improve performance?
10. What is TTL in a DNS record?
11. What problem can occur if a DNS record changes while old results remain cached?
12. Why might two users receive different IP addresses for the same domain?
13. How can DNS help distribute traffic across multiple servers?
14. What happens when a DNS lookup fails?
15. Can Nova still connect to a server by IP address when DNS is unavailable?
16. What is DNS cache poisoning?
17. How does DNSSEC help establish trust in DNS answers?
18. What privacy problem exists with traditional unencrypted DNS?
19. How do encrypted DNS approaches improve privacy?
20. Does encrypted DNS automatically prove that the destination server is trustworthy?

### Connection question

21. DNS gives Nova Orion’s address. Which protocol should carry Nova’s actual application data reliably?

---

# Chapter 8: Transport Layer — “Which Application Should Receive the Data?”

A computer may run a browser, email application, game, and video call simultaneously.

The **Transport Layer** provides process-to-process communication through ports. Its major protocols include **TCP** and **UDP**.

## Questions

1. What is a port number?
2. Why is an IP address alone not enough to deliver data to the correct application?
3. What is a socket?
4. Can two applications use the same port on the same address and transport protocol?
5. What is the difference between a source port and a destination port?
6. Why does a client usually use a temporary port?
7. What is the difference between TCP and UDP?
8. Why is TCP called connection-oriented?
9. Why is UDP called connectionless?
10. Does UDP mean that packets will definitely be lost?
11. Does TCP guarantee that the receiving application will process the data correctly?
12. When might speed matter more than perfect delivery?
13. When is reliable ordered delivery essential?

## Protocol-choice challenge

Choose TCP, UDP, or a modern protocol built on UDP where appropriate:

14. Sending an email
15. Loading a web page
16. A live voice call
17. Online gaming
18. A file transfer
19. A DNS query
20. Live video streaming
21. A bank transaction

Explain each choice.

### Connection question

22. If Nova chooses TCP, how does TCP create a connection and deliver data reliably?

---

# Chapter 9: TCP — “Making Unreliable Networks Feel Reliable”

IP packets may be lost, duplicated, delayed, or reordered. TCP attempts to provide an ordered and reliable byte stream.

## Questions

1. Why does TCP need a connection before transferring application data?
2. Explain the three-way handshake:
   - SYN
   - SYN-ACK
   - ACK
3. Why is a two-message handshake not enough?
4. What is a sequence number?
5. How do sequence numbers help detect:
   - Missing data
   - Duplicate data
   - Out-of-order data?
6. What is an acknowledgment?
7. What happens when an acknowledgment does not arrive?
8. How does TCP decide when to retransmit?
9. Why can retransmitting too early waste bandwidth?
10. Why can retransmitting too late make an application feel slow?
11. What is a sliding window?
12. How can TCP send several segments before waiting for acknowledgments?
13. What is flow control?
14. How does flow control protect a slow receiver?
15. What is congestion control?
16. How is congestion control different from flow control?
17. Why should a sender reduce its rate when the network is congested?
18. What happens when a TCP segment arrives out of order?
19. How is a TCP connection normally closed?
20. What could happen if one side suddenly crashes without closing the connection?
21. Why can packet loss make a TCP connection slower?
22. Why might a long-distance TCP connection take time to reach full speed?

## Scenario

Nova sends segments `1`, `2`, `3`, and `4`, but segment `2` is lost.

23. What can Orion do with segments `3` and `4`?
24. How does Nova discover that segment `2` is missing?
25. Which data must be retransmitted?
26. In what order should the application receive the data?

### Connection question

27. TCP delivers bytes reliably, but how does Nova know what those bytes mean?

---

# Chapter 10: Application Layer — “Giving Meaning to the Data”

Application protocols define the meaning and structure of exchanged messages.

Examples include HTTP, email protocols, SSH, and DNS.

## Questions

1. Why do we need application protocols when TCP already provides reliable delivery?
2. What information might an application protocol define?
3. What is the difference between a client and a server?
4. Can one computer act as both a client and a server?
5. What is a request-response model?
6. What is an application message?
7. Why must both sides agree on message format and encoding?
8. What happens if a client uses a newer protocol version than the server supports?
9. Why should servers validate every field received from a client?
10. Why should network messages include size limits?

## HTTP questions

11. What happens after you enter a web address into a browser?
12. What is an HTTP request?
13. What is an HTTP response?
14. What is the purpose of:
    - Methods
    - Headers
    - Status codes
    - Message bodies?
15. How are `GET` and `POST` different?
16. What do these status-code groups generally mean?
    - `2xx`
    - `3xx`
    - `4xx`
    - `5xx`
17. What is the difference between HTTP and HTTPS?
18. Why should login credentials never be sent over ordinary HTTP?
19. What is an HTTP cookie?
20. Why are cookies commonly needed when HTTP is stateless?
21. What security protections should sensitive cookies use?
22. Why should a server not trust information simply because it came from its own web page?

## Other application protocols

23. Why are different protocols used for:
    - Email
    - Remote login
    - File transfer
    - Web browsing?
24. What is the difference between sending and retrieving email?
25. Why is SSH safer than older unencrypted remote-login protocols?
26. Why should outdated and plaintext protocols be avoided?

### Connection question

27. Before sensitive HTTP data travels through the network, how can Nova verify Orion’s identity and encrypt the communication?

---

# Chapter 11: TLS and Secure Communication — “Can We Trust the Other Side?”

Ordinary network traffic may be observed or modified. **TLS** helps provide confidentiality, integrity, and server authentication.

## Questions

1. What is encryption?
2. What is the difference between plaintext and ciphertext?
3. What security problems does TLS try to solve?
4. What does confidentiality mean?
5. What does integrity mean?
6. What does authentication mean?
7. Why is encryption alone not enough if Nova cannot verify Orion’s identity?
8. What is a digital certificate?
9. What information does a certificate contain?
10. What is a Certificate Authority?
11. Why does Nova trust certain Certificate Authorities?
12. What should happen if the certificate’s domain name does not match the website?
13. What should happen if a certificate has expired?
14. Why is clicking through a certificate warning dangerous?
15. What is the difference between symmetric and asymmetric encryption?
16. Why is asymmetric cryptography useful during connection setup?
17. Why is symmetric encryption normally used for most application data?
18. What is a digital signature?
19. How can a digital signature detect message modification?
20. Does HTTPS prove that a website is honest?
21. What does HTTPS protect, and what does it not protect?
22. Why must private keys be protected carefully?
23. What could happen if Orion’s private key is stolen?
24. Why should systems use modern TLS versions and disable outdated protocols?

## Scenario

An attacker controls the Wi-Fi access point between Nova and Orion.

25. What could the attacker see if Nova uses HTTP?
26. What could the attacker modify?
27. What changes if Nova uses correctly configured HTTPS?
28. What could still be visible even when message contents are encrypted?
29. What happens if Nova accepts the attacker’s false certificate?

### Connection question

30. Nova’s home network uses private addresses. How can it communicate with the public internet?

---

# Chapter 12: NAT — “Many Devices, One Public Address”

A home may contain dozens of devices but have only one public IPv4 address.

**Network Address Translation**, or NAT, allows private devices to share that address.

## Questions

1. What problem does NAT solve?
2. How can several private devices share one public IP address?
3. What information does a NAT device store?
4. Why are port numbers important for NAT?
5. How does the router know which internal device should receive a reply?
6. What happens when a NAT table entry expires?
7. Why is starting a connection from inside the network usually easier than starting one from outside?
8. What is port forwarding?
9. What security risk can careless port forwarding introduce?
10. Is NAT the same as a firewall?
11. Why should NAT not be treated as the only security control?
12. How can NAT make peer-to-peer communication more difficult?
13. Why does IPv6 reduce the need for address-conserving NAT?
14. Does using IPv6 mean a firewall is unnecessary?
15. Why should inbound access still be denied by default?

### Connection question

16. Before traffic leaves Nova’s home, how does the network decide which traffic is allowed or blocked?

---

# Chapter 13: Firewalls — “Who Is Allowed to Communicate?”

A firewall examines network traffic and applies security rules.

## Questions

1. What is the purpose of a firewall?
2. What information can a firewall use when making a decision?
3. What does deny-by-default mean?
4. Why is deny-by-default normally safer than allow-by-default?
5. What is an inbound rule?
6. What is an outbound rule?
7. Why should outbound traffic sometimes be restricted?
8. What is the difference between packet filtering and stateful filtering?
9. How does a stateful firewall recognize reply traffic?
10. What is an application-layer firewall?
11. Can a firewall detect every malicious message?
12. Why does allowing all traffic on port `443` not guarantee safety?
13. What is network segmentation?
14. How does segmentation limit an attacker’s movement?
15. Why should guest Wi-Fi be separated from trusted devices?
16. Should a printer be allowed to initiate connections to every computer?
17. Should a database server be directly accessible from the internet?
18. Why should firewall rules be as narrow as possible?
19. What should be logged when a firewall blocks suspicious traffic?
20. Why must logs avoid storing unnecessary sensitive data?

## Rule-design challenge

A company has:

- A public web server
- A private application server
- A private database
- Employee laptops
- Guest Wi-Fi

21. Which systems should be allowed to contact the database?
22. Should guests be able to contact employee laptops?
23. Should the database be able to browse the public internet?
24. Which traffic should be blocked by default?
25. Where would you place each system to reduce risk?

### Connection question

26. Many users now connect without cables. What new problems appear in wireless networking?

---

# Chapter 14: Wireless Networks — “Communicating Through the Air”

Wi-Fi uses radio waves, which are shared and easier to observe than a private cable.

## Questions

1. How is Wi-Fi different from Ethernet?
2. Why do Wi-Fi devices share the communication medium?
3. Why can nearby networks interfere with one another?
4. What is an SSID?
5. Is hiding an SSID a strong security measure?
6. What is a wireless channel?
7. Why can choosing a less crowded channel improve performance?
8. Why does Wi-Fi performance decrease with distance?
9. How do walls and other objects affect wireless signals?
10. Why can many connected devices slow an access point?
11. Why does Wi-Fi generally avoid collisions rather than detect them?
12. What is the hidden-node problem?
13. What is roaming between access points?
14. How can several access points provide one continuous network?
15. Why should modern Wi-Fi security be used?
16. Why is an open Wi-Fi network dangerous?
17. Does using HTTPS make open Wi-Fi completely safe?
18. Why should the access point’s administrator password be changed?
19. Why should guest devices be isolated?
20. What is a fake or “evil twin” access point?
21. How could Nova distinguish the genuine network from a fake one?
22. Why should automatic connection to unknown networks be disabled?

## Design challenge

23. Design Wi-Fi for a three-floor school. Consider:

- Access-point placement
- Signal overlap
- Channel selection
- Student and staff separation
- Guest access
- Authentication
- Device limits

### Connection question

24. Even when every component works, why can a network still feel slow?

---

# Chapter 15: Performance — “Why Is the Network Slow?”

Network quality depends on more than headline bandwidth.

## Questions

1. What is bandwidth?
2. What is throughput?
3. Why is throughput often lower than bandwidth?
4. What is latency?
5. What is jitter?
6. What is packet loss?
7. Which matters most for downloading a large file?
8. Which matters most for an online game?
9. Which matters most for a video call?
10. Why does high jitter damage real-time audio?
11. Why can small amounts of packet loss seriously affect TCP performance?
12. What is network congestion?
13. How does congestion resemble a traffic jam?
14. Why can simply increasing link speed fail to solve congestion?
15. What is a bottleneck?
16. How do you identify the slowest part of a network path?
17. What is Quality of Service?
18. Should video calls receive higher priority than software downloads?
19. How can caching improve speed?
20. How can a Content Delivery Network reduce latency?
21. Why is a nearby server often faster than a distant server?
22. Why can a speed test look excellent while a video call still performs badly?
23. How can buffering hide temporary network variation?
24. Why does excessive buffering sometimes increase latency?

## Investigation scenario

Nova’s video call freezes every evening.

25. Could the problem be:
   - Wi-Fi interference?
   - Too many local users?
   - ISP congestion?
   - High latency?
   - Packet loss?
   - An overloaded server?
26. Which measurement would test each possibility?
27. Why should you measure before replacing equipment?

### Connection question

28. When a network fails, how can we find the failing layer systematically?

---

# Chapter 16: Network Troubleshooting — “Where Did Communication Break?”

A good troubleshooter moves from simple checks to more complex ones.

## Questions

1. Why should troubleshooting begin with the simplest possible cause?
2. What can indicator lights reveal?
3. How can you check whether a device has an IP address?
4. What does a self-assigned address suggest?
5. What does testing the loopback address prove?
6. What does pinging Nova’s own IP address test?
7. What does pinging the default gateway test?
8. What does pinging a public IP address test?
9. What does successfully opening a site by IP but not by name suggest?
10. What does `traceroute` or `tracert` help reveal?
11. What can `nslookup` or `dig` test?
12. What can `arp` or the neighbor table reveal?
13. What can a packet capture reveal?
14. Why must packet captures be handled securely?
15. Why does a failed `ping` not always mean the destination is offline?
16. How can a firewall make a working service appear unavailable?
17. What is the difference between:
    - Connection refused
    - Connection timed out
    - Name not found?
18. Why is it useful to test from another device?
19. Why should only one major variable be changed at a time?
20. Why should the final solution and root cause be documented?

## Troubleshooting ladder

Nova cannot open `example.com`. Put these checks in a sensible order:

21. Check physical or Wi-Fi connectivity.
22. Inspect Nova’s IP configuration.
23. Test the loopback interface.
24. Ping the default gateway.
25. Test a public IP address.
26. Test DNS resolution.
27. Test the destination port.
28. Inspect firewall rules.
29. Trace the route.
30. Capture packets if necessary.

Explain what each result would prove.

---

# Chapter 17: Routing at Scale — “How Does the Internet Find a Path?”

A home router may know only a few routes, but the internet connects millions of networks.

## Questions

1. What is the difference between static and dynamic routing?
2. When is a static route useful?
3. Why does a large network need dynamic routing?
4. What is a routing metric?
5. Why is the shortest path not always the best path?
6. What factors might affect route selection?
7. What happens when a link fails?
8. How do routers learn an alternative path?
9. What is routing convergence?
10. Why can slow convergence interrupt communication?
11. What is an autonomous system?
12. Why does the internet consist of many autonomous systems?
13. What is the basic purpose of BGP?
14. Why does internet routing involve policy as well as distance?
15. Could an incorrect route advertisement redirect large amounts of traffic?
16. What security and reliability problems can route hijacking cause?
17. Why should route announcements be carefully validated?
18. Can the “best” route change while a connection is active?
19. What happens to packets during a temporary routing loop?
20. Which IP header field limits the damage from routing loops?

### Connection question

21. Routing connects networks, but how can large applications remain available when individual servers or links fail?

---

# Chapter 18: Reliability, Load Balancing, and Cloud Networks

Modern services often run on many servers in several locations.

## Questions

1. Why should an important service not depend on one server?
2. What is redundancy?
3. What is a single point of failure?
4. What is failover?
5. What is a health check?
6. What should happen when a server fails a health check?
7. What is load balancing?
8. How can a load balancer distribute requests?
9. Why might equal request counts still create unequal server load?
10. What is session affinity?
11. Why can session affinity make failover harder?
12. How can applications avoid depending on one server’s local memory?
13. What is horizontal scaling?
14. What is vertical scaling?
15. What are the trade-offs between them?
16. How can DNS help direct users to nearby servers?
17. What is a Content Delivery Network?
18. Which content is easiest to cache at the edge?
19. Why is dynamic private data harder to cache?
20. What happens if an entire data centre becomes unavailable?
21. Why should backups be kept in a separate failure domain?
22. How can automatic failover create problems if it is not tested?
23. What should be monitored to detect failure early?
24. Why is secure communication still needed inside a cloud network?
25. How does least privilege apply to network services in the cloud?

---

# Cross-Chapter Detective Challenges

## 1. “The Website Is Down”

Nova cannot open a website.

Possible causes include:

- Wi-Fi failure
- Missing IP configuration
- Default-gateway failure
- DNS failure
- Routing failure
- Firewall blocking
- TLS certificate failure
- Web-server failure

### Questions

1. What should you test first?
2. How would you determine whether DNS is the problem?
3. How would you determine whether the server’s port is reachable?
4. What would a certificate warning suggest?
5. At which networking layer does each possible failure belong?

---

## 2. “The Message Arrived Twice”

Nova sends a payment request. The server receives it twice.

### Questions

1. Could a network retransmission cause duplicate delivery?
2. Does TCP guarantee that the business operation occurs only once?
3. How should the application identify repeated requests?
4. How can an idempotency key prevent a duplicate payment?
5. Why must networking reliability and application correctness work together?

---

## 3. “Fast Download, Bad Video Call”

Nova downloads files quickly, but video calls freeze.

### Questions

1. Could bandwidth still be sufficient?
2. How could latency affect the call?
3. How could jitter affect the call?
4. How could packet loss affect the call?
5. Could another device be filling the router’s buffers?
6. Which measurements would reveal the real problem?

---

## 4. “The Fake Coffee-Shop Network”

Nova sees these networks:

- `CoffeeShop-Free`
- `CoffeeShop_Free`
- `CoffeeShop-Guest`

### Questions

1. Could one be a malicious access point?
2. Why is the network name alone insufficient proof?
3. What information could an attacker collect?
4. How does HTTPS help?
5. Why should Nova avoid certificate warnings?
6. What additional precautions should Nova take?

---

## 5. “One Click Across the World”

A user enters `https://example.com` and presses Enter.

Trace the complete journey:

1. Nova joins Wi-Fi.
2. DHCP provides network settings.
3. DNS resolves the domain.
4. Nova checks whether the destination is local.
5. ARP discovers the gateway’s MAC address.
6. Nova creates an Ethernet or Wi-Fi frame.
7. The router performs forwarding and possibly NAT.
8. Internet routers select paths.
9. TCP or another transport protocol creates communication.
10. TLS authenticates the server and protects the connection.
11. HTTP sends the request.
12. A load balancer selects a server.
13. The server returns a response.
14. Nova verifies, reassembles, and displays the content.

For every step, identify:

- The protocol involved
- The address used
- One possible failure
- One security risk

---

# Final Capstone — Design a Secure School Network

Design a network for a school containing:

- 500 students
- 50 teachers
- 20 administrators
- A computer laboratory
- Security cameras
- Printers
- Guest Wi-Fi
- Internal servers
- Internet access

## Design questions

1. Which devices need wired connections?
2. Which devices can use wireless connections?
3. How many switches and access points might be needed?
4. How would you divide the network into subnets or VLANs?
5. Should students communicate directly with administration computers?
6. Should guest devices access internal servers?
7. Should security cameras access the public internet?
8. How would devices receive IP addresses?
9. Which systems should have reserved or static addresses?
10. Which DNS services would be used?
11. Where would you place firewalls?
12. Which traffic would be denied by default?
13. How would teachers securely access internal resources?
14. How would you protect Wi-Fi access?
15. How would you prevent a student from installing a rogue DHCP server?
16. How would you protect against ARP spoofing?
17. How would you monitor unusual network activity?
18. How would you prioritize video classes over large downloads?
19. What happens if the main internet connection fails?
20. How would you back up device configurations?
21. How would network devices receive security updates?
22. How would you protect administrative passwords and keys?
23. Which events should be logged?
24. How would you troubleshoot a classroom that loses connectivity?
25. How would your design balance:
    - Security
    - Performance
    - Reliability
    - Cost
    - Ease of management?

---

# The Ultimate Understanding Question

Nova sends **“Hello”** to Orion.

Explain how that single message passes through:

- An application protocol
- TCP or UDP
- IP
- A frame
- Wi-Fi or Ethernet
- Switches
- Routers
- NAT
- Firewalls
- DNS
- TLS
- The destination server

Then explain how Orion sends the response back.

If you can clearly tell this complete story, you are no longer memorizing isolated networking terms—you are beginning to understand **how a computer network works as one connected system**.