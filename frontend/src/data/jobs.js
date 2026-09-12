export const jobs = [
  {
    id: "job-1",
    title: "Frontend Developer",
    company: "Nova Labs",
    location: "Remote",
    workMode: "Remote",
    description: "Build and maintain our React-based dashboard.",
    questions: [
      {
        id: "q-1-1",
        label: "Full name",
        type: "text",
        required: true,
      },
      {
        id: "q-1-2",
        label: "Years of React experience",
        type: "number",
        required: true,
      },
      {
        id: "q-1-3",
        label: "Preferred work mode",
        type: "dropdown",
        required: true,
        options: ["Remote", "Hybrid", "On-site"],
      },
      {
        id: "q-1-4",
        label: "Why do you want this role?",
        type: "textarea",
        required: false,
      }
    ]
  },
  {
    id: "job-2",
    title: "Content Writer",
    company: "Brightside Media",
    location: "New York, NY",
    workMode: "Hybrid",
    description: "Write long-form articles and marketing copy.",
    questions: [
      {
        id: "q-2-1",
        label: "Full name",
        type: "text",
        required: true,
      },
      {
        id: "q-2-2",
        label: "Portfolio URL",
        type: "text",
        required: true,
      },
      {
        id: "q-2-3",
        label: "Topics you can write about",
        type: "checkbox",
        required: true,
        options: ["Tech", "Finance", "Health", "Travel", "Lifestyle"],
      },
      {
        id: "q-2-4",
        label: "Sample pitch",
        type: "textarea",
        required: true,
      }
    ]
  },
  {
    id: "job-3",
    title: "Sales Associate",
    company: "PeakReach",
    location: "San Francisco, CA",
    workMode: "On-site",
    description: "Drive outbound sales and manage client relationships.",
    questions: [
      {
        id: "q-3-1",
        label: "Full name",
        type: "text",
        required: true,
      },
      {
        id: "q-3-2",
        label: "Do you have a driver's license?",
        type: "boolean",
        required: true,
      },
      {
        id: "q-3-3",
        label: "Highest education",
        type: "dropdown",
        required: true,
        options: ["High School", "Bachelor's", "Master's", "Other"],
      },
      {
        id: "q-3-4",
        label: "Notice period (in days)",
        type: "number",
        required: false,
      }
    ]
  }
];
