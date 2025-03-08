<h1>Notes API</h1>
    
  <h2>📌 Introduction</h2>
    <p>This is a RESTful API for managing user authentication and notes. Built using <strong>Express.js</strong> and <strong>MongoDB</strong>, the API provides endpoints for users to register, log in, and perform CRUD operations on notes. The API is deployed on <strong>Render.com</strong> and is consumed by my native <strong>Android Notes App</strong> built with <strong>Java</strong>.</p>
    
  <h2>🚀 Features</h2>
    <ul>
        <li><strong>User Authentication</strong> (JWT-based authentication)</li>
        <li><strong>Create, Read, Update, Delete (CRUD) Notes</strong></li>
        <li><strong>Secure Password Hashing</strong> using bcrypt</li>
        <li><strong>Token-based Authentication</strong> with JSON Web Tokens (JWT)</li>
        <li><strong>MongoDB Database</strong> for Data Storage</li>
        <li><strong>Deployed on Render.com</strong></li>
    </ul>
    
  <h2>🛠️ Tech Stack</h2>
    <ul>
        <li><strong>Backend Framework:</strong> Express.js</li>
        <li><strong>Database:</strong> MongoDB with Mongoose</li>
        <li><strong>Authentication:</strong> JWT & bcrypt</li>
        <li><strong>Hosting:</strong> Render.com</li>
    </ul>
    
  <h2>📥 Installation</h2>
    <h3>Clone the Repository</h3>
    <pre><code>git clone https://github.com/EngFred/notes-api</code></pre>
    
  <h3>Run the API</h3>
    <pre><code>npm start</code></pre>
    
  <h2>🌍 API Endpoints</h2>
    <h3>Authentication</h3>
    <ul>
        <li><code>POST /auth/register</code> → Register a new user</li>
        <li><code>POST /auth/login</code> → Login user</li>
    </ul>
    
  <h3>Notes CRUD</h3>
    <ul>
        <li><code>GET /notes</code> → Get all user notes (Requires Authentication)</li>
        <li><code>POST /notes</code> → Create a new note (Requires Authentication)</li>
      <li><code>POST /notes/search</code> → Search for notes (Requires Authentication)</li>
        <li><code>PUT /notes/:id</code> → Update a note (Requires Authentication)</li>
        <li><code>DELETE /notes/:id</code> → Delete a note (Requires Authentication)</li>
    </ul>

  <h3>User</h3>
    <ul>
        <li><code>GET /user</code> → Get user profile (Requires Authentication)</li>
        <li><code>PUT /user/update</code> → Update user profile (Requires Authentication)</li>
      <li><code>DELETE /user/delete</code> → Delete user profile with all their notes information (Requires Authentication)</li>
    </ul>
    
  <h2>🤝 Contributing</h2>
    <p>Contributions are welcome! Feel free to <strong>fork</strong> the repository and submit a pull request.</p>
    
  <h2>📄 License</h2>
    <p>This project is <strong>open-source</strong> and available under the <a href="LICENSE">MIT License</a>.</p>
    
  <h2>📬 Contact</h2>
    <p><strong>GitHub:</strong> <a href="https://github.com/EngFred">Omongole Fred</a></p>
    <p><strong>Email:</strong> engfred88@gmail.com</p>
    
  <p>Give this project a ⭐ if you find it useful!</p>

