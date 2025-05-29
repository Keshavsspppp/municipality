# Municipal Solutions

## Overview
Municipal Solutions is a web-based platform designed to streamline communication and query management for municipal corporations. The project addresses inefficiencies in inter-departmental communication, which often lead to duplicated efforts, delayed responses, and increased project costs. By providing a centralized portal for citizens to submit queries and an AI-powered system to cluster, summarize, and manage them, this solution enhances coordination, reduces operational costs, and improves service delivery.

## Problem Statement
Municipal corporations often face challenges due to poor communication between departments. For example:
- **Duplicated Efforts**: Multiple departments may address the same citizen complaints (e.g., pothole repairs) independently, wasting resources.
- **Delayed Responses**: Lack of a unified system to track and prioritize queries leads to slow resolution times.
- **Increased Costs**: Inefficient workflows and redundant actions inflate project budgets.

This project tackles these issues by:
1. Allowing citizens to submit queries (text or files like PDFs/images) via a web portal.
2. Using AI to cluster similar queries, summarize them, and provide actionable insights.
3. Enabling departments to access a unified view of issues, reducing overlap and improving efficiency.

## Features
- **Query Submission Portal**: Citizens can submit text queries or upload files (e.g., images of infrastructure issues).
- **AI-Powered Query Clustering**: Groups similar queries (e.g., "potholes on Main Street") using embeddings and clustering algorithms.
- **Summarization**: Generates concise summaries of query clusters with counts (e.g., "Pothole issues on Main Street (3 queries)") using a Groq-based LLM.
- **Image Analysis**: Processes uploaded images (e.g., pothole photos) using a Convolutional Neural Network (CNN) to extract relevant information.
- **Chatbot Integration**: A Groq-based LLM chatbot provides real-time assistance to citizens and staff.
- **Inter-Departmental Dashboard**: Displays summarized queries and statuses for coordinated action.

## Tech Stack
- **MongoDB**: NoSQL database for storing citizen queries, metadata, and processed results. Chosen for its flexibility with unstructured data like text and file uploads.
- **Flask**: Python-based web framework for the backend, handling API endpoints, query processing, and database interactions.
- **Vite**: Frontend build tool for a fast, modern React-based user interface, ensuring a responsive and scalable portal.
- **Convolutional Neural Network (CNN)**: Used for analyzing image uploads (e.g., identifying potholes or damaged infrastructure in photos).
- **Groq-based LLM**: Powers query summarization and chatbot functionality for natural language understanding and response generation.
- **Additional Libraries**:
  - `sentence-transformers`: For generating text embeddings to cluster similar queries.
  - `scikit-learn`: For K-means clustering of query embeddings.
  - `PyPDF2` or `Tesseract`: For extracting text from uploaded PDFs or images.
  - `TensorFlow` or `PyTorch`: For implementing and running the CNN model.


## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+ (for Vite)
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)
- Groq API key (for LLM integration)
- Optional: GPU support for CNN training (TensorFlow/PyTorch)

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Keshavsspppp/municipality.git
   cd municipality
   ```

2. **Backend Setup**:
   ```bash
   cd server
   pip install -r requirements.txt
   ```
   - Configure MongoDB connection in `backend/.env`.
   - Set up Groq API key as an environment variable:
     ```bash
     export GROQ_API_KEY=your-groq-api-key
     ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Run the Application**:
   - Start the Flask backend:
     ```bash
     cd server
     python app.py
     ```
   - The frontend will be available at `http://localhost:5173` (Vite default).
   - The backend API will run at `http://localhost:5000`.

### Usage
1. **Submit Queries**: Access the portal (`http://localhost:5173`) and submit text queries or upload files (e.g., images of potholes).
2. **AI Processing**:
   - The backend extracts text from files (if applicable) using `PyPDF2` or `Tesseract`.
   - The CNN analyzes images to identify issues (e.g., potholes).
   - Queries are converted to embeddings using `sentence-transformers`.
   - `scikit-learn` clusters similar queries.
   - The Groq-based LLM generates summaries for each cluster.
3. **View Results**: The portal displays summarized queries with counts (e.g., "Streetlight issues on Park Avenue (5 queries)").
4. **Chatbot**: Interact with the Groq-based chatbot for assistance or query status updates.

## Future Enhancements
- Implement real-time notifications for new query submissions.
- Enhance CNN accuracy with a larger dataset of municipal-related images.
- Support multilingual queries using Groq’s LLM capabilities.
- Deploy the application on a cloud platform (e.g., AWS, Heroku).

## Contributing
Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For questions or feedback, reach out to [kartik3pandey@gmail.com](mailto:kartik3pandey@gmail.com).
