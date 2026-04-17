---
title: "Administrator & IT Guide"
sidebar_position: 13
---

## Executive Summary

Are-Self is an open-source, locally-hosted AI learning platform designed for K-12 classrooms. A teacher in your school wants to run a six-week curriculum unit that uses Are-Self to teach math, science, writing, and other subjects while developing critical thinking skills. 

Why should you support this? Are-Self is one of the safest AI tools your students will encounter, specifically because it runs entirely on your school's hardware with zero cloud dependency. Unlike commercial AI products that collect data, require accounts, or funnel conversations to external servers, Are-Self stores everything locally, collects no personal information, has no internet access by default, and gives your IT team complete control over what students can do. It's free, open-source, auditable code—and it aligns with your school's data privacy, security, and compliance obligations.

This guide explains the technical requirements, privacy posture, and support needs so you can make an informed decision and implement Are-Self safely.

---

## Technical Requirements

### Hardware

**Server:**
- Recommended: 16 GB RAM, modern multi-core processor, 100 GB storage
- Minimum: 8 GB RAM, quad-core processor, 50 GB storage
- The server runs Docker containers (application, database, cache, and language models)

**Student Devices:**
- Any device with a modern web browser: laptops, desktops, Chromebooks, tablets
- No special software installation required on client devices
- Connection via browser to the local Are-Self server

### Software Stack

Are-Self is built on open-source components:
- **Docker** – Container orchestration and isolation
- **Python** – Backend API and AI reasoning engine
- **Node.js** – Frontend build tooling
- **PostgreSQL** – Session and memory data storage
- **Redis** – Caching and task queue
- **Ollama** – Local language model serving (no cloud model provider required)
- **React** – Web interface

### Network Requirements

- **Default (and recommended for K-12):** Local network only. No outbound internet access needed after the initial setup and language model download.
- **Setup phase:** One-time internet connection to pull Docker images and download the language model (~4 GB). This can happen on any internet-connected device and be transferred offline.
- **No cloud failover by default:** The system does not automatically phone home, sync to cloud, or establish backup connections. It is air-gapped unless you explicitly configure otherwise (which you should NOT do for K-12).

---

## Privacy & Compliance

### COPPA (Children's Online Privacy Protection Act)

Are-Self is compliant with COPPA requirements for K-12:
- No personal data is collected (no names, emails, ages, locations unless a student types them into a conversation)
- No accounts or logins required
- No tracking or analytics
- No third-party data sharing
- No behavioral profiling or advertising

### FERPA (Family Educational Rights and Privacy Act)

Are-Self aligns with FERPA obligations:
- Student learning data (reasoning sessions, responses, work) stays on school-owned hardware
- You (the school operator) control who accesses the data
- You control data retention and deletion policies
- No data leaves your infrastructure without explicit administrative action

### CIPA (Children's Internet Protection Act)

Are-Self supports CIPA compliance:
- By default, the system operates with no internet access—there is no unfiltered web content flowing to student devices
- Content filtering at the device level is still your responsibility for any web-enabled devices
- The Are-Self application itself enforces offline operation

### State-Specific Data Privacy Considerations

Data privacy requirements vary by state (CCPA in California, similar laws in other states). Are-Self supports compliance by:
- Operating entirely on your hardware (data doesn't leave state)
- Allowing you to manage data retention and deletion
- Providing transparency (open-source code you can audit)
- Giving you full control over data access and sharing

Contact your state education department or legal counsel to confirm requirements in your jurisdiction. Are-Self's architecture gives you maximum control to meet state-specific obligations.

### References

See the full privacy and security documentation at **are-self.com/docs/security/data-flow-privacy** for detailed technical specifications.

---

## Data Handling

### What Data Is Stored

All student learning data is stored in a PostgreSQL database on your school's server:
- **Reasoning sessions** – Student conversations with Are-Self, including questions and responses
- **Tool logs** – Records of what tools (calculators, search, research) the student used
- **Memories** – Persistent learning context that the AI uses to personalize future interactions (optional feature that you can enable or disable)

### What Data Is NOT Collected

- **No personally identifiable information (PII)** – The system never captures names, SSNs, email addresses, or addresses unless typed into a conversation by the student
- **No behavioral profiles** – Are-Self does not build a long-term psychological profile or learning "score" about students
- **No analytics or telemetry** – No data is sent to servers for usage tracking or analytics
- **No third-party data sharing** – Data does not flow to EdTech companies, analytics providers, or advertisers

### Data Retention

- **You control the policy** – Decide how long to keep session data (e.g., delete after the six-week unit, keep for a semester, archive for a year)
- **Easy deletion** – Database records can be purged via the admin interface
- **Archiving option** – Export and securely delete records if needed for record retention

### Data Location

- **Default: School hardware only** – All data lives in the PostgreSQL database on the server you operate
- **Cloud failover disabled by default** – The system does not automatically back up to cloud storage
- **Your choice:** If you want to enable cloud backup (not recommended for K-12), that requires explicit administrator configuration and is logged

---

## Security Posture

### Open Source & Auditable

- **MIT Licensed** – The code is publicly available on GitHub. Any security expert can review it
- **No hidden backdoors or telemetry** – Because the code is open, closed-source threats are impossible
- **Community auditing** – Security researchers can identify and report issues

### Dependency Management

- Are-Self uses well-maintained open-source dependencies (Docker, PostgreSQL, Redis, Ollama)
- A dependency audit process is documented to track known CVEs (Common Vulnerabilities and Exposures)
- Updates and patches are published as new releases

### Network Isolation

- **No outbound connections by default** – The application does not make requests to external servers
- **Local language models only** – AI reasoning happens on your hardware using Ollama; no queries go to OpenAI, Google, or other cloud providers
- **Firewall rules** – Your IT team can restrict network access to the Are-Self server (e.g., allow only local network, require VPN for admin access)

### Code Review & Transparency

All code changes are version-controlled and trackable. You can audit the full history of what's been added or modified. No proprietary black boxes.

For comprehensive security documentation, see **are-self.com/docs/security**.

---

## Infrastructure Deployment Options

Are-Self is flexible. Choose the deployment model that fits your school's technology infrastructure:

### Option 1: Single Classroom Computer

**Setup:** One computer in a classroom runs the Are-Self server. Students gather around or come in pairs/small groups.

**Pros:**
- Minimal IT overhead
- Perfect for piloting with one teacher
- No network setup required
- No infrastructure changes

**Cons:**
- Limited concurrent users (5-10 students comfortably)
- Teacher manages the single computer

**Ideal For:** A single classroom, small pilot programs

---

### Option 2: Computer Lab Server

**Setup:** A dedicated server computer in a lab runs Are-Self. Student devices (laptops, Chromebooks) in the lab connect via browser to the server's IP address.

**Pros:**
- Serves 20-30 concurrent students
- Students use their own devices or lab machines
- Cleaner IT management (one server to maintain)
- Scalable if you add more lab machines

**Cons:**
- Requires IT to set up and secure the server
- Network configuration (DHCP, firewall rules)

**Ideal For:** Schools with existing computer labs or shared classroom resources

---

### Option 3: School-Wide Server

**Setup:** A central server (on-premises or in your data center) runs Are-Self. Any device on the school network can connect via browser.

**Pros:**
- Serves the entire school (100+ concurrent users if hardware allows)
- Any device with a browser can participate (desktops, Chromebooks, tablets)
- IT manages one central resource
- Easy to scale across multiple grades and subjects

**Cons:**
- Requires stronger server hardware (16-32 GB RAM)
- Needs IT infrastructure planning and security hardening
- Network bandwidth considerations

**Ideal For:** District-wide implementations or schools with strong IT infrastructure

---

### Chromebooks as Client Devices

Are-Self works with any device that has a modern web browser. **Chromebooks are excellent client devices** because:
- They require no local software installation
- They're managed centrally (via Google Admin Console)
- Students just navigate to the Are-Self URL and start working
- No compatibility issues—they're lightweight clients connecting to the server

---

## Teacher Support Needs

### Initial Setup (30–60 minutes, one-time)

Your IT team will need to:
1. **Install Docker** on the server machine
2. **Clone Are-Self** from GitHub and configure environment variables (database credentials, admin password, etc.)
3. **Start the application** using Docker Compose (one command)
4. **Verify connectivity** from a student device

Detailed setup instructions are in the Are-Self documentation. A non-expert IT person can follow the steps.

### Language Model Download (One-time, ~4 GB)

After the application starts, the language model is downloaded (~4 GB). This can happen:
- Automatically on first run (if internet is available)
- Via manual download on any internet-connected device and transferred offline
- Scheduled for off-hours to avoid bandwidth contention

### Ongoing Support

**Typical needs:**
- Occasional Docker restart (if the service hangs)
- Ollama model updates (new language model versions, quarterly)
- Database backups (standard PostgreSQL backup routine)
- Network troubleshooting (if the teacher can't connect, check firewall and IP routing)

**Frequency:** Minimal. After initial setup, Are-Self runs stably with little intervention.

### Optional IT Involvement

- **Network hardening:** Restrict Are-Self server access to the local network or VPN
- **Monitoring:** Set up basic health checks to alert if the service goes down
- **Backup strategy:** Automated PostgreSQL backups to protect session data
- **User authentication:** If you want admin login credentials for multiple staff, IT can set that up

---

## Frequently Asked Questions (Administrator Edition)

### "Does this send student data to the cloud?"

No. By default, Are-Self does not send any data outside your school's network. All student conversations, reasoning logs, and memories are stored in a PostgreSQL database on your server. No cloud backup, no analytics, no syncing to external services.

If you want to enable cloud backup in the future, that requires explicit administrator configuration and should only be done with proper data governance and encryption. For K-12, we recommend leaving this disabled.

### "Is this like ChatGPT?"

No. ChatGPT is a cloud-based service run by OpenAI. Every time you ask ChatGPT a question, it goes to OpenAI's servers, your conversation is logged, and that data is used to improve their product.

Are-Self is the opposite: it runs on your hardware, locally, with no internet access. The teacher controls everything the AI can do. Conversations stay on your server. No company has access to your data. Think of it as a private, school-owned AI tool, not a commercial service.

### "What if a student asks the AI something inappropriate?"

The AI runs a local language model with no web access—it can only reason about what it's been taught by you. It can't look up content on the internet, it can't access external databases, and it can't be manipulated by prompt injection attacks to bypass the teacher's controls.

Additionally:
- **Teacher controls tools:** The teacher decides what tools (calculators, research, etc.) the AI can use
- **Teacher controls knowledge:** The teacher can upload learning materials, textbooks, and resources the AI can reference
- **Sessions are logged:** Every conversation is stored and auditable by you
- **No persistence across sessions:** Each new session starts fresh; the AI doesn't "learn" new behavior from student interactions unless you explicitly configure memory features

If a student tries to use Are-Self for something non-educational, the teacher sees it immediately in the session logs and can address it.

### "Do we need to notify parents?"

Yes, we recommend it. A parent letter template is provided in the Are-Self documentation. Parents appreciate transparency about what their child is doing in class. The letter explains what Are-Self is, why it's safe, and how to contact you with questions. Many schools get positive feedback from parents after sending it.

A few schools do not require parent notification (depends on your district policy). Check with your principal or district legal counsel.

### "What's the cost?"

Free. Are-Self is MIT licensed open-source software. There are no subscription fees, no per-seat licenses, no hidden costs. You own the code and the data. Your only cost is the hardware you run it on (which you already have or can acquire separately from Are-Self).

No vendor lock-in, no surprises. Just free software that respects your students and your school's data.

### "Who built this?"

An independent developer named Michael, released under the scipraxian handle. Are-Self is not backed by a company, a venture capital firm, or an EdTech conglomerate. It's an open-source project built by someone who cares about student privacy and school autonomy.

There is no profit motive, no data business model, and no conflict of interest. The code is public. The project is transparent. You can evaluate it on its merits.

### "What if there's a security vulnerability?"

Like any software, Are-Self may have undiscovered security issues. However:
- The code is open-source and auditable by security researchers
- Issues can be reported directly to the maintainer
- Updates are released as they become available
- Your IT team controls when and whether to apply updates
- Since the system is air-gapped (no internet access), the attack surface is much smaller than cloud-based alternatives

If you're concerned, you can audit the code yourself before deploying, or hire a security firm to review it. That's the advantage of open source.

### "Can we integrate this with our student information system (SIS)?"

Not out of the box, but it's possible. Are-Self is designed to run independently, with no account system (students don't log in). If you want to integrate with your SIS for reporting or single-sign-on, contact the maintainer for guidance. The open-source nature means you can modify it to fit your needs.

For a basic six-week pilot, integration is not necessary. Students just open a browser and start using Are-Self.

### "What happens when the teacher leaves or the project ends?"

You own the data and the deployment. When the six-week unit is over:
- **Keep or delete data:** You decide whether to keep session records (for assessment) or delete them
- **Keep the server:** The application can stay running for future use by other teachers
- **Remove the server:** If you want to repurpose the hardware, simply shut down the Docker containers and reclaim the system
- **Export data:** You can export session data for archival or assessment purposes

Are-Self doesn't lock you in. It's your system, on your hardware, with your data.

---

## Implementation Checklist

Use this checklist to guide your decision and deployment:

**Decision Phase:**
- [ ] Principal has reviewed and approved the pilot program
- [ ] IT leadership is aligned on infrastructure and support
- [ ] District legal/compliance has confirmed no policy conflicts
- [ ] Teacher has completed Are-Self training or orientation
- [ ] Parent notification letter is ready (optional but recommended)

**Setup Phase:**
- [ ] Hardware is selected (classroom computer, lab server, or school-wide server)
- [ ] Docker is installed and tested
- [ ] Are-Self is cloned and configured
- [ ] Language model is downloaded
- [ ] Student devices are tested for connectivity
- [ ] Admin interface is accessible to the teacher

**Pilot Phase:**
- [ ] Teacher runs first lesson with Are-Self
- [ ] Students are introduced to the tool and classroom norms
- [ ] Sessions are monitored for technical issues
- [ ] Teacher provides feedback on user experience
- [ ] IT stands by for troubleshooting

**Review Phase:**
- [ ] Pilot concludes after six weeks
- [ ] Teacher and students provide feedback
- [ ] Assessment data is reviewed (if applicable)
- [ ] Decision is made: end program, continue, or expand to other classes

---

## Next Steps

1. **Review this guide** with IT leadership and your principal
2. **Visit are-self.com** to read the full technical documentation
3. **Contact the maintainer** (via the website) if you have specific questions about your infrastructure
4. **Plan your pilot** – select one teacher, one class, one six-week unit
5. **Set up a time** with IT to do the initial installation and testing
6. **Distribute the parent letter** one week before the unit begins

Are-Self is designed to be low-friction for IT and low-risk for your school. It respects student privacy, operates on your hardware, and gives you complete control. We're excited to support student learning in your school.

