#import "@preview/basic-resume:0.2.9": *

#let name = "Mitchell Berg"
#let location = "Arlington Heights, IL"
#let email = "mitchell@mitchellberg.org"
#let github = "github.com/Naftaliro"
#let linkedin = "linkedin.com/in/mitchellryanberg"
#let personal-site = "mitchellberg.org"

#show: resume.with(
  author: name,
  location: location,
  email: email,
  github: github,
  linkedin: linkedin,
  personal-site: personal-site,
  accent-color: "#26428b",
  font: "New Computer Modern",
  paper: "us-letter",
  author-position: left,
  personal-info-position: left,
)

== Professional Summary

Linux-focused IT support professional with 3+ years of experience leading technical operations, resolving complex OS, hardware, software, and connectivity issues, and automating workflows with Bash and Python. Incoming Level II Support professional focused on custom-built systems and HPC environments; continuing LPIC-1 study.

== Technical Skills

- *Operating Systems*: Linux (Fedora, Arch, Debian/Ubuntu), Windows, macOS
- *Systems & Support*: SSH, VMware, VirtualBox, Docker, endpoint management, device recovery, technical documentation
- *Automation & Networking*: Bash, Python, PowerShell, Git, TCP/IP, VPN (OpenVPN, WireGuard), firewall troubleshooting

== Professional Experience

#work(
  title: "Incoming Level II Support",
  location: "Des Plaines, IL",
  company: "Ace Computers",
  dates: "Starts Aug 2026",
)
- Incoming Tier-2 technical-support role for custom-built systems and HPC environments, centered on diagnostics, escalation handling, and Linux/Windows system support.

#work(
  title: "Manager & Lead Technician",
  location: "Niles, IL",
  company: "uBreakiFix by Asurion",
  dates: dates-helper(start-date: "Dec 2022", end-date: "Jul 2026"),
)
- Led 3–5 technicians in a 15–20 repair-per-day environment; primary escalation for complex OS, hardware, and software issues across Windows, macOS, iOS, and Android.
- Developed Python and Bash automations for reporting and inventory workflows; built structured onboarding programs that standardized repair quality and improved ramp-up.
- Administered MDM and customer-owned device-recovery workflows; performed OS-level diagnostics involving boot failures, filesystems, driver conflicts, and system recovery.
- Resolved connectivity problems involving VPN configuration, firewall behavior, and protocol-level diagnostics.

#work(
  title: "Sales Representative",
  location: "Schaumburg, IL",
  company: "Preferred Vendors Inc",
  dates: dates-helper(start-date: "Sep 2018", end-date: "Dec 2021"),
)
- Managed territory sales through CRM systems and structured outreach, building strong technical communication skills across in-person and remote client interactions.

== Selected Projects

#project(
  name: "pz-server-manager",
  role: "Maintainer",
  url: "github.com/Naftaliro/pz-server-manager",
)
- Windows desktop application for managing Project Zomboid dedicated servers, with SteamCMD integration, live console access, mod management, and automatic updates.

#project(
  name: "first-steps",
  role: "Maintainer",
  url: "github.com/Naftaliro/first-steps",
)
- GTK4 + LibAdwaita onboarding wizard for Zorin OS 18 and Ubuntu-based systems; guides new Linux users through setup without a terminal.

== Certifications & Recognition

- *Linux Professional Institute Certification (LPIC-1)* — In Progress
- *Evolve Security Certified Professional (ESCP)* — Evolve Security Academy, Chicago; 400+ hours; 2022–Present
- *PicoCTF 2019* — Top 30 Global Finish; reverse engineering, cryptography, web exploitation, and binary analysis
