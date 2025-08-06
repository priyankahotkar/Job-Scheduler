# CareEco Distributed Job Scheduler

A professional, visually appealing distributed job scheduler dashboard built with React.  
This project allows you to manage, schedule, and monitor user-defined jobs across a simulated cluster of worker machines.

---

## Features

- **Cron-like Scheduling:**  
  Schedule jobs with flexible intervals (e.g., every 5 minutes, daily at 3 AM).

- **Job Management:**  
  Add, edit, delete, and view jobs with priorities, dependencies, and retry policies.

- **Distributed Execution:**  
  Simulate job execution across multiple worker nodes with capacity and status tracking.

- **Live Dashboard:**  
  Real-time updates of job and worker status, including running jobs, next scheduled job, and system stats.

- **Modern UI:**  
  Responsive design with Tailwind CSS, animated status indicators, and professional header/footer.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/priyankahotkar/Job-Scheduler.git
   cd careeco-job-scheduler
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open in your browser:**  
   Visit [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── JobCard.jsx
│   │   ├── JobForm.jsx
│   │   ├── SystemStats.jsx
│   │   └── WorkerPanel.jsx
│   ├── core/
│   │   ├── Job.js
│   │   ├── JobScheduler.js
│   │   └── Worker.js
│   └── App.jsx
├── public/
│   └── index.html
└── README.md
```

---

## Customization

- **Add/Remove Workers:**  
  Modify `JobScheduler.js` to change the number or properties of worker nodes.

- **Job Commands:**  
  The `command` field is a placeholder string. You can extend the logic to execute real scripts or API calls.

- **Styling:**  
  Uses [Tailwind CSS](https://tailwindcss.com/) for rapid UI development.  
  Customize styles in the component files as needed.

---

## How It Works (Detailed Explanation)

### 1. **Job Definition and Storage**

- Jobs are defined as objects with properties like `id`, `name`, `schedule`, `command`, `priority`, `dependencies`, and `retryPolicy`.
- Jobs are stored in-memory using a `Map` in the `JobScheduler` class.

### 2. **Scheduling and Execution**

- The scheduler periodically checks for jobs that are due to run (based on their cron-like schedule and dependencies).
- Jobs are assigned to available workers, respecting worker capacity and job priority.
- Execution is simulated with random durations and success/failure outcomes.
- If a job fails, the retry policy is applied (with exponential backoff).

### 3. **Worker Management**

- Workers are represented by the `Worker` class, each with a unique ID, name, and capacity.
- Workers track their current jobs, total executed jobs, success/failure counts, and status (`idle` or `busy`).

### 4. **Dependencies**

- Jobs can depend on other jobs. A job will only run if all its dependencies have completed successfully.

### 5. **UI Components**

- **Header/Footer:** Professional, responsive layout for branding and navigation.
- **SystemStats:** Shows overall system/job/worker statistics.
- **WorkerPanel:** Visualizes each worker’s status, load, and active jobs.
- **JobCard:** Displays job details, status, and actions (edit/delete).
- **JobForm:** Modal form for creating and editing jobs, including dependencies and retry policy.

### 6. **Live Updates**

- The UI polls the scheduler every 500ms to reflect real-time job and worker status.
- All state changes (job execution, completion, failure, etc.) are reflected in the dashboard.

### 7. **Filtering and Search**

- Jobs can be filtered by status, priority, and searched by name/description.

---

## Contributing

Contributions are welcome! To contribute:

1. **Fork the repository** and create your branch:

   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make your changes** and commit:

   ```bash
   git commit -am "Add your feature"
   ```

3. **Push to your fork** and submit a Pull Request.

**Guidelines:**

- Write clear, descriptive commit messages.
- Keep code style consistent with the project (uses Prettier and Tailwind CSS).
- Add comments and documentation for new features.
- Test your changes before submitting.

---
