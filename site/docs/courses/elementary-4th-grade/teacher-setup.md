---
title: "Teacher Setup Guide"
sidebar_position: 2
---

# Teacher Setup Guide

Welcome! This guide walks you through getting Are-Self running on your classroom computer so your students can explore AI reasoning through interactive brain simulations. If you can install apps on your phone, you can do this.

## Before You Start

Before you begin, make sure you have the right hardware and software. You don't need to be a tech expert—we're just checking a few boxes.

### Hardware Requirements

**Minimum specs:** You'll need a modern laptop or desktop with at least 8GB of RAM and 50GB of free disk space. Windows, Mac, or Linux all work fine.

**Ideal setup:** 16GB of RAM is better if you plan to run Are-Self while using other applications. If multiple students will connect to one classroom machine (like in a lab), that machine should have 16GB+ RAM.

If you're not sure how much RAM your computer has, here's how to check:
- **Windows:** Right-click "This PC" and select "Properties." Look for "Installed RAM."
- **Mac:** Click the Apple menu, select "About This Mac," and check "Memory."

### Software You'll Need to Install

You need four things before we start. They're all free and open-source, and we'll install them one by one.

1. **Python 3.11 or higher** — This is the language Are-Self uses. Download it from [python.org](https://www.python.org/downloads/). During installation, check the box that says "Add Python to PATH."

2. **Node.js 18 or higher** — This powers the student-facing interface. Get it from [nodejs.org](https://nodejs.org/). Choose the LTS (Long Term Support) version.

3. **Docker Desktop** — This packages everything neatly so you don't have to install databases by hand. Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop). After installation, open Docker Desktop and let it finish starting up (you'll see a whale icon).

4. **Ollama** — This downloads and runs AI models locally on your machine. Get it from [ollama.ai](https://ollama.ai). After installation, leave it running in the background—you'll see it in your system tray.

5. **Git** — This lets you download the Are-Self code. Download from [git-scm.com](https://git-scm.com).

After you install each one, restart your computer. This ensures everything talks to each other properly.

## The 15-Minute Install

Once your software is ready, here's how to get Are-Self running.

### Step 1: Open Your Terminal

You're going to type a few commands. Don't worry—we'll give you each one exactly.

- **Windows:** Search for "PowerShell" or "Command Prompt" and open it.
- **Mac or Linux:** Search for "Terminal" and open it.

### Step 2: Clone the Are-Self Code

Copy this command into your terminal and press Enter:

```bash
git clone https://github.com/scipraxian/are-self-api.git
cd are-self-api
```

This downloads the Are-Self backend code and moves into its folder. Then clone the interface code:

```bash
cd ..
git clone https://github.com/scipraxian/are-self-ui.git
```

### Step 3: Run the Installation Script

Go back into the backend folder and run the installer:

```bash
cd are-self-api
```

**On Windows:**
```bash
python install.py
```

**On Mac or Linux:**
```bash
python3 install.py
```

This script sets up Python, installs all the dependencies, and creates the database. It takes about 5 minutes. You'll see lots of text scrolling—that's normal.

### Step 4: Start Docker

Open Docker Desktop if it's not already running. Wait for the whale icon to appear and show "Docker is running." This provides the database that stores student work.

### Step 5: Pull the AI Models

You need to download two AI models. Open a **new** terminal window (keep the other one open) and type:

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

Each model takes 3-5 minutes to download depending on your internet speed. While they're downloading, you can grab coffee—you've earned it!

**llama3.2** is the reasoning engine—it's the "Frontal Lobe" of our system.

**nomic-embed-text** is the memory system—it's like the "Hippocampus," helping Are-Self remember and organize information.

### Step 6: Start the Backend

In your first terminal window (the one where you ran `install.py`), type:

```bash
python manage.py runserver
```

**On Mac or Linux:**
```bash
python3 manage.py runserver
```

You'll see a message like "Starting development server at http://127.0.0.1:8000/". Leave this terminal running—don't close it.

### Step 7: Start the Frontend

Open a **third** terminal window and navigate to the frontend:

```bash
cd ../are-self-ui
npm install
npm run dev
```

The first command installs JavaScript libraries (takes about 2 minutes). The second starts the interface. You should see a message saying the server is running at `http://localhost:5173`.

### Step 8: Start the Celery Worker

Open a **fourth** terminal window and go back to the backend:

```bash
cd are-self-api
celery -A config worker -l info
```

You'll see "celery@[your-computer-name] ready to accept tasks." Perfect—your background task system is running.

**Quick recap:** You now have four terminal windows open running different parts of Are-Self. This is normal! They're all talking to each other behind the scenes.

## Verify It's Working

Open your web browser and go to `http://localhost:5173`. You should see the Are-Self landing page with a colorful 3D brain in the center.

### Click Through the Brain Regions

The brain has different regions. Click on each one:

- **Frontal Lobe** — This is reasoning. Click here and you should see it load.
- **Hippocampus** — This is memory. Click and verify it loads.
- **Amygdala** — This is emotion and priorities. Check it loads.
- **Cerebellum** — This is motor control and coordination. Confirm it's there.
- **Hypothalamus** — Click this one last. You should see a list of your AI models (llama3.2 and nomic-embed-text). If they're not listed, that means the models didn't finish downloading yet—wait a few more minutes and refresh the page.

If you can click through all regions and see the Hypothalamus showing your models, you're done with setup!

## Classroom Network Setup (For Labs)

If you want other classroom computers to access Are-Self on one "server" machine, follow this section. Otherwise, skip to the next section.

### One-Machine Server Setup

Let's say you have a Windows laptop at the front of your classroom and student tablets or Chromebooks that need to access it.

**On the server machine:** You've already done the setup above. Leave all four terminal windows running.

**On student machines:** Students open a web browser and type the server's IP address instead of localhost. To find your server's IP address, open a terminal and type:

**Windows:**
```bash
ipconfig
```

Look for "IPv4 Address" under your network adapter—it will look like `192.168.1.105`.

**Mac/Linux:**
```bash
ifconfig
```

Student machines then navigate to `http://[YOUR-IP]:5173` in their browser. For example: `http://192.168.1.105:5173`.

### Basic Firewall Notes

If students can't connect, it might be a firewall. Your school's IT team can help, but here's what they're looking for:

- **Port 5173** — This is the student interface.
- **Port 8000** — This is the backend API (students don't need direct access to this; it's used by port 5173).

On most school networks, your classroom teacher machine should be allowed to communicate with student devices on the same network. If not, ask your IT department to allow traffic on these ports locally.

## First Day Preparation Checklist

Before students arrive, make sure everything is ready. Use this checklist:

- [ ] **Python, Node.js, Docker, Ollama, Git installed** — All software is running.
- [ ] **Both models downloaded** — Run `ollama list` in a terminal. You should see `llama3.2` and `nomic-embed-text` listed.
- [ ] **All four terminal windows running** — Backend server, frontend, and Celery worker are all active.
- [ ] **Landing page loads** — Go to `http://localhost:5173` in your browser.
- [ ] **Brain regions respond** — Click each region and confirm they load.
- [ ] **Test Identity created** — In the interface, create a test "Identity" (this is how Are-Self tracks a student's progress).
- [ ] **Reasoning session works end-to-end** — Ask the Frontal Lobe a simple question like "What's 2+2?" and verify you get an answer.

If all boxes are checked, you're ready for students!

## Troubleshooting

Things don't always go smoothly. Here are the most common problems and how to fix them.

### "Ollama is not responding"

**The problem:** You see an error about Ollama in the terminal, or the Hypothalamus doesn't show your models.

**The fix:** Open Docker Desktop or your system menu and make sure Ollama is running. On Windows and Mac, look for an Ollama icon in your system tray. If it's not there, click your Start menu or Applications folder and launch Ollama. Wait 30 seconds, then refresh your browser.

### "Docker is not running"

**The problem:** You see an error about the database or Redis in your terminal.

**The fix:** Open Docker Desktop and wait for the whale icon to show "Docker is running." It takes about 30 seconds to start.

### "Port 5173 is already in use"

**The problem:** You see "Address already in use" when starting the frontend.

**The fix:** You likely have Are-Self running from a previous session. Close all four terminal windows. Wait 10 seconds. Then open four new terminal windows and start the backend, frontend, and Celery worker again.

### "Model not pulled / Ollama shows zero models"

**The problem:** The Hypothalamus is empty, or you see an error about missing models.

**The fix:** Open a terminal and re-run the model downloads:

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

These take 3-5 minutes. When both finish, refresh `http://localhost:5173` in your browser.

### "I see a blank page or a connection error"

**The problem:** The browser shows an error when you try to visit `http://localhost:5173`.

**The fix:** Check that the frontend is running. Go to the terminal window where you ran `npm run dev` and look for any error messages. If you see red text, close all four terminal windows, wait 10 seconds, and start fresh.

### "Students can't connect from their machines"

**The problem:** Student devices can't reach `http://192.168.1.105:5173`.

**The fix:** First, verify your server's IP address is correct using `ipconfig` (Windows) or `ifconfig` (Mac/Linux). Then ask your school's IT team to confirm that ports 5173 and 8000 are allowed between classroom devices on your local network.

## Getting Help

You're not alone. Here's where to get support:

**Discord Community:** Join the Are-Self community on [discord.gg/nGFFcxxV](https://discord.gg/nGFFcxxV). There are educators and developers there who can answer questions in real-time.

**GitHub Issues:** Found a bug? Visit [github.com/scipraxian/are-self-api/issues](https://github.com/scipraxian/are-self-api/issues) or [github.com/scipraxian/are-self-ui/issues](https://github.com/scipraxian/are-self-ui/issues) and describe what happened. Developers are usually very responsive to teacher feedback.

**FAQ:** Check [are-self.com/docs/faq](https://are-self.com/docs/faq) for answers to common questions about how Are-Self works and how to use it in lessons.

**Your School's IT Team:** For network setup questions or firewall issues, your IT team is your friend. They can help students connect to the server machine and troubleshoot permissions.

---

You've got this! Once Are-Self is running, your students will be exploring AI reasoning in ways they've never experienced before. Enjoy!
