+++
title = "Enabling pools in NTS"
slug = "enabling-pools-in-nts"
authors = ["Ruben Nijveld"]
date = "2024-10-30"

[taxonomies]
tags = ["ntpd-rs", "time synchonization"] 

[extra]
source = "Trifecta Tech Foundation"
+++

We previously talked about how [secure time is required for a safe internet](https://tweedegolf.nl/en/blog/122/a-safe-internet-requires-secure-time). We mentioned how we want to increase the adoption of NTS, the secure time synchronization standard built on top of NTP. For this, we proposed to develop a public NTS pool. In this article, we expand on what pooling is, and what is required to enable an NTS pool.

<!-- more -->

## What is pooling?

The NTP protocol is set up as a hierarchy of servers. At the top of this hierarchy are the stratum one servers, directly connected to highly precise clocks, such as atomic clocks or precise GPS antennas. Stratum two servers then connect to stratum one servers to get their time indirectly. This hierarchy can continue down to 16 levels. In practice though most computers use stratum three or four.

Because stratum one servers are harder to set up, you will generally find fewer of those available. However, especially in the early 2000s, lots of people tended to connect to one of these stratum one servers and they often became overloaded with requests. This caused the protocol to become unreliable: servers would not respond when demand for their services was especially high. Stratum two and three servers could’ve helped to ease this, but their discoverability was poor at best, and each of these servers individually could not promise to stay functional forever. 

To combat this, a public NTP pool was created. By widely distributing the pool address and making sure it was easily found by anyone looking for NTP servers, it quickly became the de facto standard configured in NTP daemons. This relieved pressure on stratum one servers, because the pool could contain stratum two and three servers that would handle most of the traffic. It also showed that the pool could very effectively optimize time synchronization performance: by providing only servers geographically close to a client, the client would automatically get better synchronization performance.

## Using pooling for NTS

We currently do not have a pooling solution for NTS, so we run the risk of encountering the same problems we previously encountered with NTP: users might overwhelm stratum one servers and could run into discoverability issues for finding servers that are best suited for them. Unfortunately the pooling solution that worked for NTP cannot work in the same way for NTS. 

NTS works by initially running a key exchange protocol via a TLS connection. As a result of the key exchange protocol, the client gets a shared secret, a set of cookies, some additional parameters and (optionally) a different address for the actual NTP server if that server doesn’t run on the same address as the NTS key exchange server. Once this key exchange completes, the NTP client and server communicate with regular NTP packets, with additional extension fields added to the messages to secure the communication using MACs (message authentication codes). The client sends each cookie only once, and the server tries to send a new encrypted cookie to the client every time it responds to replenish the list of cookies for the client.

The key exchange process sits in the way of using pooling the way it is traditionally done in the NTP pool. The NTP pool uses DNS, where resolving the NTP pool domain name to an IP address results in a list of addresses that the client can connect to. The NTP pool resolver uses the IP address of the client to return an address that is geographically close to the client. 

However if we were to do the same for NTS, each of the TLS servers handling traffic would have to share the same domain name. While we could issue a few certificates, in reality a pool can contain thousands of servers, and it is impossible to get that many certificates for the same domain name. In practice, the servers in the pool would share the same certificate. But sharing that certificate also means that each server in the pool has access to the secret keys. If there are thousands of operators all sharing the same certificate, in practice you have no security at all, as you then need to trust all operators absolutely. That would prevent all of the open processes that allowed the current NTP pool to be created.

## NTS pooling proposals

With that difficult situation in mind, there have been put forward several proposals for enabling pooling for NTS in a more secure way:

- We could do nothing, keeping the situation as is, and use a shared certificate for a group of servers.
- We could keep the NTP DNS pool mechanism, and then use certificates for the IP addresses returned by the pool. 
- We could set up one large NTS key exchange server that handles all the key exchange operations that the pool needs and uses the optional NTP server .
- We could use DNS SRV records instead of the normal A records. In an SRV record we can return a domain name instead of an IP address. Each server in the pool could then have its own certificate, only available to themselves, while still allowing the pool to share a list of servers that a client can connect to via DNS.
- We could set up a load-balancing proxy NTS key exchange server that offloads the actual key exchange protocol to the individual servers in the pool. 

We believe the first three options in this list are unlikely candidates. Doing nothing means that we can never have a large public pool in the same spirit as the current NTP pool, with too many people needing absolute trust. The IP address certificate option is impractical because IP address certificates are expensive and hard or impossible to acquire. This would throw up an unreasonably large barrier for entry to a public pool.

The third proposal, setting up a large NTS key exchange server has several problems: first it would require the single pool operator to handle most of the cryptographic load of the NTS traffic. Secondly, with so many connections coming into this NTS server, we probably want to update the key material relatively frequently, which is impractical to do manually, so we would need some sort of additional standardized protocol to handle the communication of the key exchange server and the different pool servers. But most importantly, the cryptographic primitives used by the servers in the pool and the pool itself need to be the same, meaning that any upgrade that wants to add a new algorithm needs to be deployed to all servers on the pool at the same time. While not impossible, this is hard to coordinate and do easily, and could result in cryptographic algorithms not being updated when they should be.

We believe that there are two proposals worth discussing a little more. Both the DNS SRV record and load balancing key exchange server proposals have their pros and cons, and both are worth exploring in more detail.

### DNS SRV record pooling

This proposal wants to keep using DNS for pooling, but instead of returning IP addresses this proposal wants to return specific domain names for each server in the pool. Normal A or AAAA records can however only contain IP addresses, not domain names. DNS, on the other hand, does have SRV records. These records are meant to provide the address of a server offering a specific service, and they may contain domain names instead of just IP addresses.

An advantage of this pooling approach is that we mostly know what to expect in terms of load on the pool itself and we mostly know what kind of behavior we can expect from the DNS protocol. There are some uncertainties surrounding how SRV records are handled compared to A/AAAA records, which would need some exploring. For NTS servers there isn’t much of a change either: a server that wants to enter the pool just needs to be registered to it, but other than that, the incoming traffic is no different than regular NTS traffic.

The biggest disadvantage of this solution is that clients will need adjustment. A pooling NTS client will first need to do the SRV DNS resolve before it can continue the rest of the normal NTS key exchange. Existing NTS clients will be incompatible with this solution, meaning it will take some time before client implementations have been updated and before we can expect any traffic to the pool at all. Adoption will be slowed down significantly. This incompatibility also means that any future client will need to be explicitly configured to be connecting to a pool. If misconfigured to connect to the pool normally, it will completely miss the SRV records and not be able to connect at all.

### Load balancing key exchange server pooling

The load balancing NTS pooling proposal takes the opposite approach. Any existing NTS client will already work with this pool proposal, you will only need to point your client to the pool. In this proposal, we set up the pool to appear as a normal NTS key exchange server. But whenever a client connects, the pool doesn’t actually process the connection itself. Instead, it passes on the connection to one of the servers in the pool and allows that server to handle the key exchange process instead.

For this to work, we need to change the way the key exchange process happens. During a normal NTS key exchange, key material is exported from the TLS session. This means that the key material stays between the two machines connected to each other. With the load balancing pool, the client and the server are not directly connected, with the pool sitting in between the two. This is why the load balancing proposal contains extensions that pass on the key material that the pool extracts to the server. A server should recognize these kinds of connections from the pool and handle them differently to a normal NTS key exchange request. Finally, once the pool receives the response from the server, it sends it back to the client. If an NTP server wasn’t already specified in the response, it will add the address of the server to the response.

All this means that the client will be completely unaware of the nature of the pool and will just connect to it as it would with any other NTS key exchange server. The response from the pool will be the same as any other NTS key exchange response, it just always includes a server address on which the client should continue communicating.

One drawback of this approach is that we currently don’t know how well this can be scaled up; We don’t have a good idea yet how often clients will go through the key exchange protocol compared to all NTP traffic and compared to how many DNS requests the current pool receives. And while we have some estimates, it would be important to figure out how much traffic such a pool could handle; For this, we really need an implementation for this proposal.

## Conclusion and future work

The status quo of time synchronization is unsafe. We have the means to change this; NTS is already out there. However, we need to facilitate the adoption of NTS by creating NTS pools. This will result in an easily discoverable, most accurate source of securely transferred time synchronization that could become the default.

Several proposals for NTS pools have been discussed; now it is time for action. We need to find out what the operational properties of these proposals are, i.e. how much traffic can they handle; how easy are they to operate in a pool; are there any practical limitations that have been overlooked?

If you’d like to support or discover more of the work we’re doing on secure time synchronization for a safe internet, please visit the [Time synchronization initiative page](https://trifectatech.org/initiatives/time-synchronization/) on the Trifecta Tech Foundation website. The Trifecta Tech Foundation is the non-profit that is the long-term home of our time synchronization work, including [ntpd-rs](https://github.com/pendulum-project/ntpd-rs) (Network Time Protocol) and [Statime](https://github.com/pendulum-project/statime) (Precision Time Protocol).
