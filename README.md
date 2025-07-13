<div align="center">

<img src="https://github.com/user-attachments/assets/7571f879-c872-40ad-ab44-38845900a6a2" style="width: 40%; max-width: 250px;" />

<br>

---

<h3>Service Sentinel Frontend</h3>

<p>Vue 3 application for managing and visualizing real-time service monitoring, connected to the Service Sentinel backend.</p>

---

### Navigation

[Overview](#overview) | [Tech Stack](#tech-stack) | [How to Install](#how-to-install) | [Features](#features)

</div>

<br>

## Overview

Service Sentinel Frontend is the client-side interface of the full-stack monitoring system. Built using Vue 3, Vite, and Bootstrap 5, it provides real-time views into service statuses, user management tools, and interactive UI components. It communicates with the backend via REST API.

Related Projects:

<ul>
  <li><a href="https://github.com/Kiemoniasty/Sentinel_Service_Backend">Sentinel Service Backend</a></li>
</ul>

<br>

## Tech Stack

| Category       | Technology            |
|----------------|------------------------|
| Language       | JavaScript (ES6+)      |
| Framework      | Vue 3 + Composition API|
| UI Library     | Bootstrap 5            |
| Build Tool     | Vite                   |
| Routing        | Vue Router             |
| State (optional)| Pinia (recommended)   |
| Auth           | JWT                    |

<br>

## How to Install

<details>
<summary>🔧 Local Setup</summary>

```bash
# Clone the repository
git clone https://github.com/your_username/Sentinel_Service_Frontend.git
cd Sentinel_Service_Frontend

# Install dependencies
npm install

# Run in development mode
npm run dev
```
</details> 

<details>
<summary>🚀 Production Build</summary>

```bash
# Compile project
npm run build
```
⚠️ Create a .env file based on .env.example to configure the backend API URL.
</details>

<br>

## Features

| Feature                             | Status |
| ----------------------------------- | ------ |
| JWT-based authentication            | ✅      |
| User profile and management         | ✅      |
| Service availability history        | ✅      |
| Alert and status display            | ✅      |
| Clean Bootstrap-based UI            | ✅      |

<br>

✅ done
🛠️ in progress
🕒 planned
